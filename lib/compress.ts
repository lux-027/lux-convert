import { MIME, baseName, getExt, type Output } from './files';
import { getCategory } from './formats';
import { canvasToJpegPage, jpegsToPdf } from './image';
import { renderPdfPages } from './document';
import { runFFmpeg } from './ffmpeg';
import type { Progress } from './convert';

export type Level = 'low' | 'medium' | 'high';

export const LEVELS: { value: Level; label: string; hint: string }[] = [
  { value: 'low', label: 'Hafif', hint: 'En iyi kalite, daha az küçülme' },
  { value: 'medium', label: 'Önerilen', hint: 'Kalite ve boyut dengesi' },
  { value: 'high', label: 'Güçlü', hint: 'En küçük boyut, daha düşük kalite' },
];

export const MIN_RATIO = 5;

const levelFor = (ratio: number): Level => (ratio > 0.65 ? 'low' : ratio > 0.35 ? 'medium' : 'high');
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function mediaDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const el = document.createElement(getCategory(file) === 'video' ? 'video' : 'audio');
    const url = URL.createObjectURL(file);
    const done = (d: number) => {
      URL.revokeObjectURL(url);
      resolve(d);
    };
    el.preload = 'metadata';
    el.onloadedmetadata = () => done(Number.isFinite(el.duration) ? el.duration : 0);
    el.onerror = () => done(0);
    el.src = url;
  });
}

const pick = <T,>(level: Level, low: T, medium: T, high: T) => (level === 'low' ? low : level === 'medium' ? medium : high);

const ESTIMATES: Record<string, [number, number, number]> = {
  image: [0.8, 0.55, 0.3],
  document: [0.7, 0.5, 0.3],
  audio: [0.6, 0.45, 0.25],
  video: [0.6, 0.4, 0.2],
};

/** Rough expected output/input size ratio for a preset level, used for previews only. */
export function estimateRatio(file: File, level: Level) {
  const e = ESTIMATES[getCategory(file) ?? ''] ?? ESTIMATES.image;
  return pick(level, ...e);
}

export function canCompress(file: File) {
  const cat = getCategory(file);
  const ext = getExt(file.name);
  if (cat === 'image') return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext);
  if (cat === 'document') return ext === 'pdf';
  return cat === 'audio' || cat === 'video';
}

async function compressImage(file: File, level: Level, cb: Progress, ratio?: number): Promise<Output> {
  const ext = getExt(file.name);
  if (ext === 'gif') {
    const scale = pick(level, 1, 0.8, 0.6);
    const colors = pick(level, 192, 128, 64);
    const blob = await runFFmpeg({
      input: file,
      inputName: file.name,
      outExt: 'gif',
      args: ['-vf', `scale=trunc(iw*${scale}/2)*2:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=${colors}[p];[b][p]paletteuse=dither=bayer`, '-loop', '0'],
      ...cb,
    });
    return { blob, name: file.name };
  }
  const { default: imageCompression } = await import('browser-image-compression');
  const fileType = ext === 'bmp' ? 'image/jpeg' : undefined;
  const blob = await imageCompression(file, {
    maxSizeMB: (file.size / 1024 / 1024) * (ratio ?? pick(level, 0.8, 0.55, 0.3)),
    maxWidthOrHeight: ratio ? 8192 : pick(level, 8192, 3840, 2048),
    initialQuality: ratio ? 0.92 : pick(level, 0.85, 0.7, 0.5),
    maxIteration: ratio ? 15 : 8,
    useWebWorker: true,
    fileType,
    onProgress: (p: number) => cb.onProgress?.(p / 100),
  });
  return { blob, name: fileType ? `${baseName(file.name)}.jpg` : file.name };
}

async function compressPdf(file: File, level: Level, cb: Progress, ratio?: number): Promise<Output> {
  cb.onStatus?.('Sayfalar işleniyor…');
  const quality = ratio ? 0.25 + 0.6 * ratio : pick(level, 0.8, 0.65, 0.45);
  const pages = await renderPdfPages(
    file,
    ratio ? 0.9 + 1.2 * ratio : pick(level, 2, 1.5, 1.1),
    (c, s) => canvasToJpegPage(c, quality, { w: s.width, h: s.height }),
    (p) => cb.onProgress?.(p * 0.9)
  );
  const blob = await jpegsToPdf(pages);
  cb.onProgress?.(1);
  return { blob, name: file.name };
}

async function compressAudio(file: File, level: Level, cb: Progress, ratio?: number): Promise<Output> {
  const ext = getExt(file.name);
  const duration = ratio ? await mediaDuration(file) : 0;
  const kbps = duration ? Math.round(clamp((file.size * ratio! * 8) / duration / 1000, 16, 320)) : 0;
  let outExt = ext;
  let args: string[];
  if (ext === 'ogg' || ext === 'oga') {
    outExt = 'ogg';
    args = ['-vn', '-c:a', 'libvorbis', '-q:a', pick(level, '4', '2', '0')];
  } else if (ext === 'm4a' || ext === 'aac') {
    args = ['-vn', '-c:a', 'aac', '-b:a', pick(level, '128k', '96k', '64k')];
  } else if (ext === 'opus') {
    args = ['-vn', '-c:a', 'libopus', '-b:a', pick(level, '96k', '64k', '32k')];
  } else {
    outExt = 'mp3';
    args = ['-vn', '-c:a', 'libmp3lame', '-b:a', pick(level, '160k', '112k', '64k')];
  }
  if (kbps) {
    const i = args.findIndex((a) => a === '-b:a' || a === '-q:a');
    args.splice(i, 2, '-b:a', `${kbps}k`);
    if (kbps < 48) args.push('-ac', '1');
  } else if (level === 'high') args.push('-ac', '1');
  const blob = await runFFmpeg({ input: file, inputName: file.name, outExt, args, ...cb });
  return { blob, name: `${baseName(file.name)}.${outExt}` };
}

async function compressVideo(file: File, level: Level, cb: Progress, ratio?: number): Promise<Output> {
  const duration = ratio ? await mediaDuration(file) : 0;
  if (duration) {
    const totalK = (file.size * ratio! * 8) / duration / 1000;
    const audioK = totalK > 800 ? 128 : totalK > 300 ? 96 : 48;
    const videoK = Math.round(Math.max(40, (totalK - audioK) * 0.93));
    const maxW = videoK < 400 ? 640 : videoK < 900 ? 854 : videoK < 2000 ? 1280 : 1920;
    const blob = await runFFmpeg({
      input: file,
      inputName: file.name,
      outExt: 'mp4',
      args: [
        '-c:v', 'libx264', '-preset', 'veryfast', '-b:v', `${videoK}k`, '-maxrate', `${Math.round(videoK * 1.2)}k`, '-bufsize', `${videoK * 2}k`,
        '-pix_fmt', 'yuv420p', '-vf', `scale='min(${maxW},trunc(iw/2)*2)':-2`,
        '-c:a', 'aac', '-b:a', `${audioK}k`,
        '-movflags', '+faststart',
      ],
      ...cb,
    });
    return { blob, name: `${baseName(file.name)}.mp4` };
  }
  const maxW = pick(level, 1920, 1280, 854);
  const blob = await runFFmpeg({
    input: file,
    inputName: file.name,
    outExt: 'mp4',
    args: [
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', pick(level, '26', '30', '34'), '-pix_fmt', 'yuv420p',
      '-vf', `scale='min(${maxW},trunc(iw/2)*2)':-2`,
      '-c:a', 'aac', '-b:a', pick(level, '128k', '96k', '64k'),
      '-movflags', '+faststart',
    ],
    ...cb,
  });
  return { blob, name: `${baseName(file.name)}.mp4` };
}

/** `ratio` (0–1) targets that fraction of the original size instead of a preset level. */
export async function compressFile(
  file: File,
  level: Level,
  cb: Progress = {},
  ratio?: number
): Promise<Output & { unchanged?: boolean }> {
  const cat = getCategory(file);
  if (ratio) level = levelFor(ratio);
  let out: Output;
  if (cat === 'image') out = await compressImage(file, level, cb, ratio);
  else if (cat === 'document' && getExt(file.name) === 'pdf') out = await compressPdf(file, level, cb, ratio);
  else if (cat === 'audio') out = await compressAudio(file, level, cb, ratio);
  else if (cat === 'video') out = await compressVideo(file, level, cb, ratio);
  else throw new Error('Bu dosya türü sıkıştırılamıyor.');
  if (out.blob.size >= file.size) {
    return { blob: new Blob([file], { type: file.type || MIME[getExt(file.name)] }), name: file.name, unchanged: true };
  }
  return out;
}
