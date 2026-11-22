'use client';

import { recordConversions } from '@/lib/stats';
import { useCallback, useRef, useState } from 'react';
import { Download, Minus, Plus, RotateCcw } from 'lucide-react';
import DropArea from './DropArea';
import FileRow, { type Status } from './FileRow';
import { Button, IconButton, Segmented } from './ui';
import { getCategory, type Category } from '@/lib/formats';
import { downloadAll, downloadBlob, formatBytes, type Output } from '@/lib/files';
import { LEVELS, MIN_RATIO, canCompress, compressFile, type Level } from '@/lib/compress';

type Item = {
  id: string;
  file: File;
  category: Category | null;
  status: Status;
  progress: number;
  statusText?: string;
  output?: Output & { unchanged?: boolean };
  error?: string;
};

const ACCEPT = '.jpg,.jpeg,.png,.webp,.gif,.bmp,.pdf,.mp3,.wav,.ogg,.flac,.m4a,.aac,.opus,.wma,.aiff,.mp4,.webm,.mov,.mkv,.avi,.m4v,.3gp,.wmv';
const MAX_FILES = 25;

type Mode = Level | 'custom';
const MODES: { value: Mode; label: string }[] = [...LEVELS.map(({ value, label }) => ({ value, label })), { value: 'custom', label: 'Ayarla' }];

export default function Compressor() {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<Mode>('medium');
  const [percent, setPercent] = useState(50);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (id: string, patch: Partial<Item>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const addFiles = useCallback((files: File[]) => {
    setItems((list) => [
      ...list,
      ...files.slice(0, Math.max(MAX_FILES - list.length, 0)).map<Item>((file) => {
        const ok = canCompress(file);
        return {
          id: crypto.randomUUID(),
          file,
          category: getCategory(file),
          status: ok ? 'idle' : 'error',
          progress: 0,
          error: ok ? undefined : 'Bu dosya türü sıkıştırılamıyor.',
        };
      }),
    ]);
  }, []);

  const pending = items.filter((i) => (i.status === 'idle' || i.status === 'error') && canCompress(i.file));
  const done = items.filter((i) => i.status === 'done' && i.output);
  const totalBefore = done.reduce((s, i) => s + i.file.size, 0);
  const totalAfter = done.reduce((s, i) => s + i.output!.blob.size, 0);

  const resetDone = () => setItems((list) => list.map((i) => (i.status === 'done' ? { ...i, status: 'idle', output: undefined } : i)));
  const changeMode = (m: Mode) => {
    setMode(m);
    resetDone();
  };
  const changePercent = (p: number) => {
    setPercent(Math.min(100, Math.max(MIN_RATIO, Math.round(p))));
    resetDone();
  };
  const custom = mode === 'custom';
  const ratio = custom ? percent / 100 : undefined;
  const totalOriginal = items.reduce((s, i) => s + i.file.size, 0);

  const run = async () => {
    setRunning(true);
    let succeeded = 0;
    for (const item of pending) {
      update(item.id, { status: 'working', progress: 0, statusText: undefined, error: undefined });
      try {
        const output = await compressFile(
          item.file,
          custom ? 'medium' : mode,
          {
            onProgress: (p) => update(item.id, { progress: p }),
            onStatus: (s) => update(item.id, { statusText: s }),
          },
          ratio
        );
        update(item.id, { status: 'done', output, progress: 1 });
        if (!output.unchanged) succeeded++;
      } catch (e) {
        update(item.id, { status: 'error', error: e instanceof Error ? e.message : 'Sıkıştırma başarısız oldu.' });
      }
    }
    setRunning(false);
    recordConversions(succeeded);
  };

  const levelHint = custom ? 'Hedef boyutu kendiniz belirleyin' : LEVELS.find((l) => l.value === mode)!.hint;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <Segmented options={MODES} value={mode} onChange={changeMode} />
        <p className="text-xs text-fg-2">{levelHint}</p>
      </div>

      {custom && (
        <div data-appear className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-5 shadow-[0_2px_12px_rgb(60_64_67/0.08)]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-fg-2 uppercase">Hedef boyut</p>
              <p className="mt-1 text-2xl font-medium tracking-tight text-fg tabular-nums">
                {totalOriginal ? formatBytes((totalOriginal * percent) / 100) : `%${percent}`}
              </p>
            </div>
            <p className="text-right text-xs text-fg-2 tabular-nums">
              {totalOriginal ? (
                <>
                  Orijinal {formatBytes(totalOriginal)}
                  <br />
                  <span className="font-medium text-fg">%{percent}</span> · −%{100 - percent}
                </>
              ) : (
                'Orijinal boyuta göre'
              )}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <IconButton aria-label="Küçült" title="Küçült" onClick={() => changePercent(percent - 5)} disabled={running || percent <= MIN_RATIO}>
              <Minus className="h-4 w-4" />
            </IconButton>
            <input
              type="range"
              min={MIN_RATIO}
              max={100}
              step={1}
              value={percent}
              onChange={(e) => changePercent(Number(e.target.value))}
              disabled={running}
              aria-label="Hedef boyut yüzdesi"
              className="h-1.5 flex-1 cursor-pointer accent-ink"
            />
            <IconButton aria-label="Büyüt" title="Büyüt" onClick={() => changePercent(percent + 5)} disabled={running || percent >= 100}>
              <Plus className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="mt-2 flex justify-between px-12 text-[11px] text-fg-2">
            <span>Daha küçük</span>
            <span>Orijinal</span>
          </div>
        </div>
      )}

      {!items.length ? (
        <DropArea
          onFiles={addFiles}
          accept={ACCEPT}
          formats={['JPG', 'PNG', 'WEBP', 'GIF', 'PDF', 'MP3', 'WAV', 'MP4', 'MOV']}
          hint="Dosyalarınız cihazınızdan çıkmaz, işlem tarayıcınızda yapılır."
        />
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_2px_12px_rgb(60_64_67/0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
            <span className="text-sm text-fg-2">
              {items.length} dosya
              {done.length > 0 && totalAfter < totalBefore && (
                <span className="ml-2 text-success">
                  · {formatBytes(totalBefore - totalAfter)} kazanıldı
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="text" className="h-9 px-3" onClick={() => inputRef.current?.click()} disabled={running}>
                <Plus className="h-4 w-4" />
                Dosya ekle
              </Button>
              <Button variant="text" className="h-9 px-3 text-fg-2" onClick={() => setItems([])} disabled={running}>
                <RotateCcw className="h-4 w-4" />
                Temizle
              </Button>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(Array.from(e.target.files));
                  e.target.value = '';
                }}
              />
            </div>
          </div>
          <ul className="divide-y divide-line">
            {items.map((item) => {
              const saved = item.output ? 1 - item.output.blob.size / item.file.size : 0;
              return (
                <FileRow
                  key={item.id}
                  file={item.file}
                  category={item.category}
                  status={item.status}
                  progress={item.progress}
                  statusText={item.statusText}
                  error={item.error}
                  disabled={item.status === 'working'}
                  idleText={
                    custom ? (
                      <>
                        {formatBytes(item.file.size)} → <span className="font-medium text-fg">≈ {formatBytes((item.file.size * percent) / 100)}</span>
                      </>
                    ) : undefined
                  }
                  doneText={
                    item.output &&
                    (item.output.unchanged ? (
                      <>Dosya zaten optimize · {formatBytes(item.file.size)}</>
                    ) : (
                      <>
                        {formatBytes(item.file.size)} → {formatBytes(item.output.blob.size)} (−%{Math.round(saved * 100)})
                      </>
                    ))
                  }
                  onRemove={() => setItems((list) => list.filter((i) => i.id !== item.id))}
                  onDownload={item.output && (() => downloadBlob(item.output!.blob, item.output!.name))}
                />
              );
            })}
          </ul>
          <div className="flex flex-col-reverse gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
            {done.length > 1 && (
              <Button variant="tonal" onClick={() => downloadAll(done.map((i) => i.output!), 'lux-convert-sikistirilmis.zip')}>
                <Download className="h-4 w-4" />
                Tümünü indir (ZIP)
              </Button>
            )}
            <Button onClick={run} disabled={running || !pending.length}>
              {running ? 'Sıkıştırılıyor…' : pending.length ? `Sıkıştır (${pending.length})` : 'Sıkıştırıldı'}
            </Button>
          </div>
        </div>
      )}
      <p className="text-center text-xs text-fg-2">
        PDF sıkıştırma sayfaları görüntüye çevirir; metin seçilemez hale gelebilir. Sıkıştırılmış dosya daha büyük çıkarsa orijinal korunur.
      </p>
    </div>
  );
}
