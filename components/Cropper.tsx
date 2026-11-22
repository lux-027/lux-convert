'use client';

import { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Download, FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw, Upload } from 'lucide-react';
import DropArea from './DropArea';
import { Button, IconButton, Segmented, Select } from './ui';
import { baseName, downloadBlob, formatBytes } from '@/lib/files';
import { canvasToBlob, loadImage } from '@/lib/image';

const ASPECTS = [
  { value: 'free', label: 'Serbest' },
  { value: '1', label: '1:1' },
  { value: '1.3333', label: '4:3' },
  { value: '1.5', label: '3:2' },
  { value: '1.7778', label: '16:9' },
  { value: '0.8', label: '4:5' },
  { value: '0.5625', label: '9:16' },
];

const OUTPUTS = [
  { value: 'png', mime: 'image/png', label: 'PNG' },
  { value: 'jpg', mime: 'image/jpeg', label: 'JPG' },
  { value: 'webp', mime: 'image/webp', label: 'WEBP' },
];

function initialCrop(w: number, h: number, aspect?: number): Crop {
  if (!aspect) return { unit: '%', x: 5, y: 5, width: 90, height: 90 };
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, w, h), w, h);
}

async function transform(src: Blob, rotate: number, flipH: boolean, flipV: boolean) {
  const img = await loadImage(src);
  const w = img.naturalWidth || 1024;
  const h = img.naturalHeight || 1024;
  const swap = rotate % 180 !== 0;
  const canvas = document.createElement('canvas');
  canvas.width = swap ? h : w;
  canvas.height = swap ? w : h;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  return canvasToBlob(canvas, 'image/png');
}

export default function Cropper() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string>('');
  const [rotate, setRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspect, setAspect] = useState('free');
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(0.92);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!file) return;
    let url = '';
    let cancelled = false;
    setError('');
    const make = rotate || flipH || flipV ? transform(file, rotate, flipH, flipV) : Promise.resolve(file as Blob);
    make
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      })
      .catch(() => setError('Görüntü okunamadı.'));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, rotate, flipH, flipV]);

  const aspectNum = aspect === 'free' ? undefined : Number(aspect);

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const c = initialCrop(width, height, aspectNum);
    setCrop(c);
    setPixelCrop({
      unit: 'px',
      x: ((c.x ?? 0) / 100) * width,
      y: ((c.y ?? 0) / 100) * height,
      width: ((c.width ?? 0) / 100) * width,
      height: ((c.height ?? 0) / 100) * height,
    });
  };

  const changeAspect = (v: string) => {
    setAspect(v);
    const img = imgRef.current;
    if (!img) return;
    const c = initialCrop(img.width, img.height, v === 'free' ? undefined : Number(v));
    setCrop(c);
    setPixelCrop({
      unit: 'px',
      x: ((c.x ?? 0) / 100) * img.width,
      y: ((c.y ?? 0) / 100) * img.height,
      width: ((c.width ?? 0) / 100) * img.width,
      height: ((c.height ?? 0) / 100) * img.height,
    });
  };

  const img = imgRef.current;
  const scaleX = img ? img.naturalWidth / img.width : 1;
  const scaleY = img ? img.naturalHeight / img.height : 1;
  const outW = pixelCrop ? Math.round(pixelCrop.width * scaleX) : 0;
  const outH = pixelCrop ? Math.round(pixelCrop.height * scaleY) : 0;

  const save = async () => {
    if (!img || !pixelCrop || !file || !outW || !outH) return;
    setBusy(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d')!;
      const out = OUTPUTS.find((o) => o.value === format)!;
      if (format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outW, outH);
      }
      ctx.drawImage(img, pixelCrop.x * scaleX, pixelCrop.y * scaleY, outW, outH, 0, 0, outW, outH);
      const blob = await canvasToBlob(canvas, out.mime, quality);
      downloadBlob(blob, `${baseName(file.name)}-kirpilmis.${format}`);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setSrc('');
    setRotate(0);
    setFlipH(false);
    setFlipV(false);
    setCrop(undefined);
    setPixelCrop(undefined);
  };

  if (!file) {
    return (
      <DropArea
        multiple={false}
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif,image/svg+xml"
        onFiles={(f) => setFile(f[0])}
        hint="JPG, PNG, WEBP, GIF, BMP, AVIF, SVG · Görüntünüz cihazınızdan çıkmaz."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-line bg-surface p-4">
        {error ? (
          <p className="text-sm text-error">{error}</p>
        ) : (
          src && (
            <ReactCrop
              crop={crop}
              aspect={aspectNum}
              keepSelection
              ruleOfThirds
              onChange={(_, percent) => setCrop(percent)}
              onComplete={(c) => setPixelCrop(c)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imgRef} src={src} alt="Kırpılacak görüntü" onLoad={onLoad} className="max-h-[65vh] w-auto" />
            </ReactCrop>
          )
        )}
      </div>

      <aside className="space-y-6 rounded-3xl border border-line p-5">
        <div>
          <p className="mb-1 truncate text-sm font-medium text-fg" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-fg-2">
            {formatBytes(file.size)}
            {img && ` · ${img.naturalWidth} × ${img.naturalHeight} px`}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-fg-2 uppercase">En-boy oranı</p>
          <Segmented className="flex flex-wrap rounded-2xl" options={ASPECTS} value={aspect} onChange={changeAspect} />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-fg-2 uppercase">Döndür ve çevir</p>
          <div className="flex gap-1">
            <IconButton aria-label="Sola döndür" title="Sola döndür" onClick={() => setRotate((r) => (r + 270) % 360)}>
              <RotateCcw className="h-4 w-4" />
            </IconButton>
            <IconButton aria-label="Sağa döndür" title="Sağa döndür" onClick={() => setRotate((r) => (r + 90) % 360)}>
              <RotateCw className="h-4 w-4" />
            </IconButton>
            <IconButton aria-label="Yatay çevir" title="Yatay çevir" onClick={() => setFlipH((v) => !v)} className={flipH ? 'bg-primary-container text-on-primary-container' : ''}>
              <FlipHorizontal2 className="h-4 w-4" />
            </IconButton>
            <IconButton aria-label="Dikey çevir" title="Dikey çevir" onClick={() => setFlipV((v) => !v)} className={flipV ? 'bg-primary-container text-on-primary-container' : ''}>
              <FlipVertical2 className="h-4 w-4" />
            </IconButton>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-fg-2 uppercase">Çıktı</p>
          <div className="flex items-center gap-3">
            <Select aria-label="Çıktı biçimi" className="w-28" value={format} onChange={(e) => setFormat(e.target.value)}>
              {OUTPUTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <span className="text-sm text-fg-2">
              {outW} × {outH} px
            </span>
          </div>
          {format !== 'png' && (
            <label className="mt-4 block">
              <span className="flex justify-between text-xs text-fg-2">
                <span>Kalite</span>
                <span>%{Math.round(quality * 100)}</span>
              </span>
              <input type="range" min={0.3} max={1} step={0.01} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="mt-2 w-full" />
            </label>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={save} disabled={busy || !outW || !outH}>
            <Download className="h-4 w-4" />
            Kırp ve indir
          </Button>
          <Button variant="text" onClick={reset}>
            <Upload className="h-4 w-4" />
            Başka görüntü seç
          </Button>
        </div>
      </aside>
    </div>
  );
}
