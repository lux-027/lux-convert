import { MIME, baseName, getExt, zipOutputs, type Output } from './files';
import { canvasToBlob } from './image';

type PdfJs = typeof import('pdfjs-dist');
let pdfjsPromise: Promise<PdfJs> | null = null;

export function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export async function openPdf(file: Blob) {
  const pdfjs = await loadPdfJs();
  try {
    return await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  } catch (e) {
    if (e instanceof Error && e.name === 'PasswordException') throw new Error('Şifreli PDF dosyaları desteklenmiyor.');
    throw new Error('PDF okunamadı. Dosya bozuk olabilir.');
  }
}

export async function renderPdfPages(
  file: Blob,
  scale: number,
  onProgress?: (p: number) => void
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }[]> {
  const doc = await openPdf(file);
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    pages.push({ canvas, width: base.width, height: base.height });
    onProgress?.(i / doc.numPages);
  }
  await doc.destroy();
  return pages;
}

async function pdfToImages(file: File, target: 'jpg' | 'png', onProgress?: (p: number) => void): Promise<Output> {
  const pages = await renderPdfPages(file, 2, onProgress);
  const name = baseName(file.name);
  const outs: Output[] = [];
  for (let i = 0; i < pages.length; i++) {
    const blob = await canvasToBlob(pages[i].canvas, MIME[target], 0.92);
    outs.push({ blob, name: pages.length === 1 ? `${name}.${target}` : `${name}-sayfa-${i + 1}.${target}` });
  }
  if (outs.length === 1) return outs[0];
  return { blob: await zipOutputs(outs), name: `${name}-${target}.zip` };
}

async function pdfToText(file: File): Promise<string> {
  const doc = await openPdf(file);
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    let text = '';
    for (const item of content.items) {
      if ('str' in item) text += item.str + (item.hasEOL ? '\n' : '');
    }
    parts.push(text.trim());
  }
  await doc.destroy();
  return parts.join('\n\n');
}

type Block =
  | { type: 'h'; level: number; text: string }
  | { type: 'p'; text: string }
  | { type: 'li'; text: string; marker: string }
  | { type: 'img'; src: string }
  | { type: 'table'; rows: string[][] }
  | { type: 'hr' };

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

function htmlToBlocks(html: string): Block[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,noscript,head').forEach((n) => n.remove());
  const blocks: Block[] = [];
  const walk = (el: Element) => {
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const t = clean(node.textContent ?? '');
        if (t) blocks.push({ type: 'p', text: t });
        continue;
      }
      if (!(node instanceof Element)) continue;
      const tag = node.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        const t = clean(node.textContent ?? '');
        if (t) blocks.push({ type: 'h', level: Number(tag[1]), text: t });
      } else if (tag === 'p' || tag === 'pre' || tag === 'blockquote') {
        node.querySelectorAll('img').forEach((img) => blocks.push({ type: 'img', src: img.getAttribute('src') ?? '' }));
        const t = tag === 'pre' ? (node.textContent ?? '') : clean(node.textContent ?? '');
        if (t.trim()) blocks.push({ type: 'p', text: t });
      } else if (tag === 'ul' || tag === 'ol') {
        Array.from(node.children)
          .filter((c) => c.tagName.toLowerCase() === 'li')
          .forEach((li, i) => {
            const t = clean(li.textContent ?? '');
            if (t) blocks.push({ type: 'li', text: t, marker: tag === 'ol' ? `${i + 1}.` : '•' });
          });
      } else if (tag === 'table') {
        const rows = Array.from(node.querySelectorAll('tr')).map((tr) =>
          Array.from(tr.querySelectorAll('th,td')).map((c) => clean(c.textContent ?? ''))
        );
        if (rows.length) blocks.push({ type: 'table', rows });
      } else if (tag === 'img') {
        blocks.push({ type: 'img', src: node.getAttribute('src') ?? '' });
      } else if (tag === 'hr') {
        blocks.push({ type: 'hr' });
      } else if (tag === 'br') {
        continue;
      } else {
        walk(node);
      }
    }
  };
  walk(doc.body);
  return blocks;
}

function textToBlocks(text: string): Block[] {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((p) => ({ type: 'p' as const, text: p }))
    .filter((b) => b.text.trim());
}

let fontCache: Promise<[string, string]> | null = null;
function loadFonts() {
  const toBase64 = async (url: string) => {
    const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  if (!fontCache) {
    fontCache = Promise.all([toBase64('/fonts/NotoSans-Regular.ttf'), toBase64('/fonts/NotoSans-Bold.ttf')]);
    fontCache.catch(() => (fontCache = null));
  }
  return fontCache;
}

function imageSize(src: string): Promise<{ w: number; h: number; ok: boolean }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight, ok: true });
    img.onerror = () => resolve({ w: 0, h: 0, ok: false });
    img.src = src;
  });
}

async function blocksToPdf(blocks: Block[]): Promise<Blob> {
  const [{ jsPDF }, [regular, bold]] = await Promise.all([import('jspdf'), loadFonts()]);
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  pdf.addFileToVFS('NotoSans-Regular.ttf', regular);
  pdf.addFileToVFS('NotoSans-Bold.ttf', bold);
  pdf.addFont('NotoSans-Regular.ttf', 'Noto', 'normal');
  pdf.addFont('NotoSans-Bold.ttf', 'Noto', 'bold');

  const margin = 56;
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensure = (h: number) => {
    if (y + h > pageH - margin) {
      pdf.addPage();
      y = margin;
    }
  };
  const write = (text: string, size: number, style: 'normal' | 'bold', indent = 0, after = size * 0.6) => {
    pdf.setFont('Noto', style);
    pdf.setFontSize(size);
    const lh = size * 1.4;
    for (const line of pdf.splitTextToSize(text, maxW - indent) as string[]) {
      ensure(lh);
      pdf.text(line, margin + indent, y + size);
      y += lh;
    }
    y += after;
  };

  for (const b of blocks) {
    if (b.type === 'h') write(b.text, [0, 22, 18, 15, 13, 12, 11][b.level], 'bold', 0, 8);
    else if (b.type === 'p') write(b.text, 11, 'normal');
    else if (b.type === 'li') {
      pdf.setFont('Noto', 'normal');
      pdf.setFontSize(11);
      ensure(16);
      pdf.text(b.marker, margin + 6, y + 11);
      write(b.text, 11, 'normal', 22, 3);
    } else if (b.type === 'table') {
      for (const row of b.rows) write(row.join('   |   '), 10, 'normal', 0, 2);
      y += 8;
    } else if (b.type === 'hr') {
      ensure(16);
      pdf.setDrawColor(200);
      pdf.line(margin, y + 6, pageW - margin, y + 6);
      y += 16;
    } else if (b.type === 'img' && b.src.startsWith('data:')) {
      const size = await imageSize(b.src);
      if (!size.ok) continue;
      let w = Math.min(maxW, size.w * 0.75);
      let h = (w / size.w) * size.h;
      if (h > pageH - margin * 2) {
        h = pageH - margin * 2;
        w = (h / size.h) * size.w;
      }
      ensure(h);
      const fmt = b.src.slice(5, b.src.indexOf(';')).split('/')[1]?.toUpperCase() ?? 'PNG';
      try {
        pdf.addImage(b.src, fmt === 'JPG' ? 'JPEG' : fmt, margin, y, w, h);
        y += h + 10;
      } catch {}
    }
  }
  return pdf.output('blob');
}

async function docxToHtml(file: File) {
  const mammoth = await import('mammoth');
  const { value } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
  return value;
}

const htmlPage = (title: string, body: string) =>
  `<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n<title>${title}</title>\n<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 16px;line-height:1.6}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:4px 8px}</style>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function parseCsv(text: string): string[][] {
  const delim = (text.split('\n')[0].match(/;/g)?.length ?? 0) > (text.split('\n')[0].match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === delim) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f !== ''));
}

function csvToJson(text: string) {
  const [header, ...rows] = parseCsv(text.replace(/^\uFEFF/, ''));
  if (!header) throw new Error('CSV dosyası boş.');
  return JSON.stringify(
    rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? '']))),
    null,
    2
  );
}

function jsonToCsv(text: string) {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Geçersiz JSON dosyası.');
  }
  const arr = (Array.isArray(data) ? data : [data]) as Record<string, unknown>[];
  if (!arr.length || typeof arr[0] !== 'object') throw new Error('JSON bir nesne dizisi olmalıdır.');
  const keys = Array.from(new Set(arr.flatMap((o) => Object.keys(o ?? {}))));
  const esc = (v: unknown) => {
    const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(','), ...arr.map((o) => keys.map((k) => esc(o?.[k])).join(','))].join('\n');
}

export async function convertDocument(file: File, target: string, onProgress?: (p: number) => void): Promise<Output> {
  const ext = getExt(file.name);
  const name = `${baseName(file.name)}.${target}`;
  const text = (s: string, mime = MIME[target]) => ({ blob: new Blob([s], { type: `${mime};charset=utf-8` }), name });

  if (ext === 'pdf') {
    if (target === 'jpg' || target === 'png') return pdfToImages(file, target, onProgress);
    if (target === 'txt') return text(await pdfToText(file));
  }
  if (ext === 'docx') {
    if (target === 'txt') {
      const mammoth = await import('mammoth');
      const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return text(value);
    }
    const html = await docxToHtml(file);
    if (target === 'html') return text(htmlPage(escapeHtml(baseName(file.name)), html));
    if (target === 'pdf') return { blob: await blocksToPdf(htmlToBlocks(html)), name };
  }
  if (ext === 'txt' || ext === 'md') {
    const content = await file.text();
    if (target === 'pdf') return { blob: await blocksToPdf(textToBlocks(content)), name };
    if (target === 'html') {
      const body = textToBlocks(content)
        .map((b) => `<p>${escapeHtml((b as { text: string }).text).replace(/\n/g, '<br>')}</p>`)
        .join('\n');
      return text(htmlPage(escapeHtml(baseName(file.name)), body));
    }
  }
  if (ext === 'html' || ext === 'htm') {
    const content = await file.text();
    if (target === 'pdf') return { blob: await blocksToPdf(htmlToBlocks(content)), name };
    if (target === 'txt') {
      return text(
        htmlToBlocks(content)
          .map((b) => ('text' in b ? b.text : 'rows' in b ? b.rows.map((r) => r.join('\t')).join('\n') : ''))
          .filter(Boolean)
          .join('\n\n')
      );
    }
  }
  if (ext === 'csv' && target === 'json') return text(csvToJson(await file.text()));
  if (ext === 'json' && target === 'csv') return text(jsonToCsv(await file.text()));
  throw new Error('Bu dönüşüm desteklenmiyor.');
}
