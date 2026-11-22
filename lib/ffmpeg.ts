import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { MIME, getExt } from './files';

const CORE_BASE = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';

let instance: Promise<FFmpeg> | null = null;
let queue: Promise<unknown> = Promise.resolve();

function load(): Promise<FFmpeg> {
  if (!instance) {
    instance = (async () => {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { toBlobURL } = await import('@ffmpeg/util');
      const ff = new FFmpeg();
      await ff.load({
        classWorkerURL: `${location.origin}/ffmpeg/worker.js`,
        coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return ff;
    })().catch((e) => {
      instance = null;
      throw new Error(`Dönüştürme motoru yüklenemedi: ${e instanceof Error ? e.message : e}`);
    });
  }
  return instance;
}

export type FFmpegJob = {
  input: Blob;
  inputName: string;
  outExt: string;
  args: string[];
  onProgress?: (p: number) => void;
  onStatus?: (s: string) => void;
};

export function runFFmpeg(job: FFmpegJob): Promise<Blob> {
  const run = async () => {
    job.onStatus?.('Motor yükleniyor…');
    const ff = await load();
    job.onStatus?.('İşleniyor…');
    const id = Math.random().toString(36).slice(2, 8);
    const inName = `in_${id}.${getExt(job.inputName) || 'bin'}`;
    const outName = `out_${id}.${job.outExt}`;
    const onProgress = ({ progress }: { progress: number }) => {
      if (Number.isFinite(progress)) job.onProgress?.(Math.min(Math.max(progress, 0), 1));
    };
    const logs: string[] = [];
    const onLog = ({ message }: { message: string }) => {
      logs.push(message);
      if (logs.length > 30) logs.shift();
    };
    ff.on('progress', onProgress);
    ff.on('log', onLog);
    try {
      await ff.writeFile(inName, new Uint8Array(await job.input.arrayBuffer()));
      const code = await ff.exec(['-hide_banner', '-y', '-i', inName, ...job.args, outName]);
      if (code !== 0) {
        console.error(logs.join('\n'));
        if (logs.some((l) => /does not contain any stream|matches no streams/i.test(l)))
          throw new Error('Dosyada bu çıktı için uygun akış yok (örneğin videoda ses kanalı bulunmuyor).');
        throw new Error('Dosya işlenemedi. Dosya bozuk veya desteklenmeyen bir kodek içeriyor olabilir.');
      }
      const data = await ff.readFile(outName);
      return new Blob([data as BlobPart], { type: MIME[job.outExt] ?? 'application/octet-stream' });
    } finally {
      ff.off('progress', onProgress);
      ff.off('log', onLog);
      await ff.deleteFile(inName).catch(() => {});
      await ff.deleteFile(outName).catch(() => {});
    }
  };
  const p = queue.then(run, run);
  queue = p.catch(() => {});
  return p;
}

const EVEN = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';
const H264 = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p'];

export function convertArgs(target: string, fromImage = false): string[] {
  switch (target) {
    case 'mp3':
      return ['-vn', '-c:a', 'libmp3lame', '-q:a', '2'];
    case 'wav':
      return ['-vn', '-c:a', 'pcm_s16le'];
    case 'ogg':
      return ['-vn', '-c:a', 'libvorbis', '-q:a', '5'];
    case 'flac':
      return ['-vn', '-c:a', 'flac'];
    case 'm4a':
    case 'aac':
      return ['-vn', '-c:a', 'aac', '-b:a', '192k'];
    case 'opus':
      return ['-vn', '-c:a', 'libopus', '-b:a', '128k'];
    case 'mp4':
    case 'mov':
    case 'mkv':
      return [...H264, '-vf', EVEN, '-c:a', 'aac', '-b:a', '160k', ...(target === 'mp4' ? ['-movflags', '+faststart'] : [])];
    case 'webm':
      return ['-c:v', 'libvpx', '-deadline', 'realtime', '-cpu-used', '8', '-crf', '10', '-b:v', '2M', '-c:a', 'libvorbis'];
    case 'avi':
      return ['-c:v', 'mpeg4', '-q:v', '4', '-c:a', 'libmp3lame', '-q:a', '4'];
    case 'gif':
      return fromImage
        ? []
        : ['-vf', 'fps=12,scale=480:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse', '-loop', '0'];
    default:
      throw new Error('Desteklenmeyen hedef biçim');
  }
}
