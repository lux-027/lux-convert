import { MIME, baseName, type Output } from './files';

export function loadImage(src: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(src);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Görüntü okunamadı. Dosya bozuk veya tarayıcınız bu biçimi desteklemiyor olabilir.'));
    };
    img.src = url;
  });
}

export function imageToCanvas(img: HTMLImageElement, background?: string, maxSide?: number) {
  let w = img.naturalWidth || 1024;
  let h = img.naturalHeight || 1024;
  if (maxSide && Math.max(w, h) > maxSide) {
    const s = maxSide / Math.max(w, h);
    w = Math.round(w * s);
    h = Math.round(h * s);
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Görüntü kodlanamadı'))), mime, quality);
  });
}

function encodeBmp(canvas: HTMLCanvasElement): Blob {
  const { width: w, height: h } = canvas;
  const data = canvas.getContext('2d')!.getImageData(0, 0, w, h).data;
  const rowSize = Math.ceil((w * 3) / 4) * 4;
  const size = 54 + rowSize * h;
  const buf = new ArrayBuffer(size);
  const v = new DataView(buf);
  v.setUint16(0, 0x4d42, true);
  v.setUint32(2, size, true);
  v.setUint32(10, 54, true);
  v.setUint32(14, 40, true);
  v.setInt32(18, w, true);
  v.setInt32(22, h, true);
  v.setUint16(26, 1, true);
  v.setUint16(28, 24, true);
  v.setUint32(34, rowSize * h, true);
  const out = new Uint8Array(buf);
  for (let y = 0; y < h; y++) {
    const row = 54 + (h - 1 - y) * rowSize;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = data[i + 3] / 255;
      const o = row + x * 3;
      out[o] = Math.round(data[i + 2] * a + 255 * (1 - a));
      out[o + 1] = Math.round(data[i + 1] * a + 255 * (1 - a));
      out[o + 2] = Math.round(data[i] * a + 255 * (1 - a));
    }
  }
  return new Blob([buf], { type: MIME.bmp });
}

async function encodeIco(img: HTMLImageElement): Promise<Blob> {
  const side = Math.min(256, Math.max(img.naturalWidth || 256, img.naturalHeight || 256));
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = side;
  const ctx = canvas.getContext('2d')!;
  const s = side / Math.max(img.naturalWidth || side, img.naturalHeight || side);
  const w = (img.naturalWidth || side) * s;
  const h = (img.naturalHeight || side) * s;
  ctx.drawImage(img, (side - w) / 2, (side - h) / 2, w, h);
  const png = new Uint8Array(await (await canvasToBlob(canvas, 'image/png')).arrayBuffer());
  const header = new DataView(new ArrayBuffer(22));
  header.setUint16(2, 1, true);
  header.setUint16(4, 1, true);
  header.setUint8(6, side >= 256 ? 0 : side);
  header.setUint8(7, side >= 256 ? 0 : side);
  header.setUint16(10, 1, true);
  header.setUint16(12, 32, true);
  header.setUint32(14, png.length, true);
  header.setUint32(18, 22, true);
  return new Blob([header.buffer, png], { type: MIME.ico });
}

export async function canvasesToPdf(canvases: HTMLCanvasElement[], quality = 0.92, pageSizes?: { w: number; h: number }[]) {
  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  for (let i = 0; i < canvases.length; i++) {
    const c = canvases[i];
    const bytes = new Uint8Array(await (await canvasToBlob(c, 'image/jpeg', quality)).arrayBuffer());
    const image = await pdf.embedJpg(bytes);
    const size = pageSizes?.[i] ?? { w: c.width * 0.75, h: c.height * 0.75 };
    const page = pdf.addPage([size.w, size.h]);
    page.drawImage(image, { x: 0, y: 0, width: size.w, height: size.h });
  }
  const out = await pdf.save();
  return new Blob([out as BlobPart], { type: MIME.pdf });
}

export async function convertImage(file: File, target: string, quality = 0.92): Promise<Output> {
  const img = await loadImage(file);
  const name = `${baseName(file.name)}.${target}`;
  switch (target) {
    case 'jpg':
      return { blob: await canvasToBlob(imageToCanvas(img, '#ffffff'), 'image/jpeg', quality), name };
    case 'png':
    case 'webp':
    case 'avif':
      return { blob: await canvasToBlob(imageToCanvas(img), MIME[target], quality), name };
    case 'bmp':
      return { blob: encodeBmp(imageToCanvas(img)), name };
    case 'ico':
      return { blob: await encodeIco(img), name };
    case 'pdf':
      return { blob: await canvasesToPdf([imageToCanvas(img, '#ffffff')], quality), name };
    default:
      throw new Error('Desteklenmeyen hedef biçim');
  }
}
