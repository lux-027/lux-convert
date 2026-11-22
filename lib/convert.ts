import { baseName, getExt, type Output } from './files';
import { getCategory } from './formats';
import { canvasToBlob, convertImage, imageToCanvas, loadImage } from './image';
import { convertArgs, runFFmpeg } from './ffmpeg';
import { convertDocument } from './document';

export type Progress = { onProgress?: (p: number) => void; onStatus?: (s: string) => void };

export async function convertFile(file: File, target: string, cb: Progress = {}): Promise<Output> {
  const category = getCategory(file);
  const name = `${baseName(file.name)}.${target}`;
  if (category === 'image') {
    const ext = getExt(file.name);
    if (target === 'gif' || (ext === 'gif' && (target === 'mp4' || target === 'webm'))) {
      let input: Blob = file;
      let inputName = file.name;
      if (ext !== 'gif') {
        input = await canvasToBlob(imageToCanvas(await loadImage(file)), 'image/png');
        inputName = 'image.png';
      }
      const blob = await runFFmpeg({ input, inputName, outExt: target, args: convertArgs(target, ext !== 'gif'), ...cb });
      return { blob, name };
    }
    return convertImage(file, target);
  }
  if (category === 'audio' || category === 'video') {
    const blob = await runFFmpeg({ input: file, inputName: file.name, outExt: target, args: convertArgs(target), ...cb });
    return { blob, name };
  }
  if (category === 'document') return convertDocument(file, target, cb.onProgress);
  throw new Error('Bu dosya türü desteklenmiyor.');
}
