export type Output = { blob: Blob; name: string };

export function getExt(name: string) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

export function baseName(name: string) {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.slice(0, i) : name;
}

export function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / Math.pow(1024, i);
  return `${v.toFixed(i === 0 ? 0 : v < 10 ? 1 : 0).replace('.', ',')} ${units[i]}`;
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function uniqueNames(outputs: Output[]) {
  const seen = new Map<string, number>();
  return outputs.map((o) => {
    const n = seen.get(o.name) ?? 0;
    seen.set(o.name, n + 1);
    return n === 0 ? o : { ...o, name: `${baseName(o.name)} (${n}).${getExt(o.name)}` };
  });
}

export async function zipOutputs(outputs: Output[]) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  for (const o of uniqueNames(outputs)) zip.file(o.name, o.blob);
  return zip.generateAsync({ type: 'blob' });
}

export async function downloadAll(outputs: Output[], zipName: string) {
  if (outputs.length === 1) return downloadBlob(outputs[0].blob, outputs[0].name);
  downloadBlob(await zipOutputs(outputs), zipName);
}

export const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  opus: 'audio/ogg',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
  avi: 'video/x-msvideo',
  pdf: 'application/pdf',
  txt: 'text/plain',
  html: 'text/html',
  csv: 'text/csv',
  json: 'application/json',
  zip: 'application/zip',
};
