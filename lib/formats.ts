import { getExt } from './files';

export type Category = 'image' | 'audio' | 'video' | 'document';

const INPUTS: Record<Category, string[]> = {
  image: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'avif', 'svg', 'ico'],
  audio: ['mp3', 'wav', 'ogg', 'oga', 'flac', 'aac', 'm4a', 'opus', 'wma', 'aiff', 'aif', 'amr'],
  video: ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', '3gp', 'flv', 'wmv', 'mpeg', 'mpg', 'ts'],
  document: ['pdf', 'docx', 'txt', 'md', 'html', 'htm', 'csv', 'json'],
};

export const CATEGORY_LABEL: Record<Category, string> = {
  image: 'Görüntü',
  audio: 'Ses',
  video: 'Video',
  document: 'Belge',
};

export const ACCEPT = Object.values(INPUTS)
  .flat()
  .map((e) => `.${e}`)
  .join(',');

export function getCategory(file: File): Category | null {
  const ext = getExt(file.name);
  for (const [cat, exts] of Object.entries(INPUTS) as [Category, string[]][]) {
    if (exts.includes(ext)) return cat;
  }
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return null;
}

let avifSupport: boolean | null = null;
export function canEncodeAvif() {
  if (avifSupport === null) {
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 1;
      avifSupport = c.toDataURL('image/avif').startsWith('data:image/avif');
    } catch {
      avifSupport = false;
    }
  }
  return avifSupport;
}

const norm = (e: string) => (e === 'jpeg' ? 'jpg' : e === 'htm' ? 'html' : e === 'oga' ? 'ogg' : e === 'aif' ? 'aiff' : e);

export function getTargets(file: File): string[] {
  const ext = norm(getExt(file.name));
  const cat = getCategory(file);
  let list: string[] = [];
  switch (cat) {
    case 'image':
      list = ['jpg', 'png', 'webp', ...(canEncodeAvif() ? ['avif'] : []), 'gif', 'bmp', 'ico', 'pdf'];
      if (ext === 'gif') list.push('mp4', 'webm');
      break;
    case 'audio':
      list = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'opus'];
      break;
    case 'video':
      list = ['mp4', 'webm', 'mov', 'mkv', 'avi', 'gif', 'mp3', 'wav', 'm4a'];
      break;
    case 'document':
      list =
        ext === 'pdf'
          ? ['jpg', 'png', 'txt']
          : ext === 'docx'
            ? ['pdf', 'txt', 'html']
            : ext === 'txt' || ext === 'md'
              ? ['pdf', 'html']
              : ext === 'html'
                ? ['pdf', 'txt']
                : ext === 'csv'
                  ? ['json']
                  : ext === 'json'
                    ? ['csv']
                    : [];
      break;
  }
  return list.filter((t) => t !== ext);
}
