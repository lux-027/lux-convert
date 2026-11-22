'use client';

import { useCallback, useRef, useState } from 'react';
import { Download, Plus, RotateCcw } from 'lucide-react';
import DropArea from './DropArea';
import FileRow, { type Status } from './FileRow';
import { Button, Segmented } from './ui';
import { getCategory, type Category } from '@/lib/formats';
import { downloadAll, downloadBlob, formatBytes, type Output } from '@/lib/files';
import { LEVELS, canCompress, compressFile, type Level } from '@/lib/compress';

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

export default function Compressor() {
  const [items, setItems] = useState<Item[]>([]);
  const [level, setLevel] = useState<Level>('medium');
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

  const pending = items.filter((i) => i.status === 'idle' && canCompress(i.file));
  const done = items.filter((i) => i.status === 'done' && i.output);
  const totalBefore = done.reduce((s, i) => s + i.file.size, 0);
  const totalAfter = done.reduce((s, i) => s + i.output!.blob.size, 0);

  const changeLevel = (l: Level) => {
    setLevel(l);
    setItems((list) => list.map((i) => (i.status === 'done' ? { ...i, status: 'idle', output: undefined } : i)));
  };

  const run = async () => {
    setRunning(true);
    for (const item of pending) {
      update(item.id, { status: 'working', progress: 0, statusText: undefined });
      try {
        const output = await compressFile(item.file, level, {
          onProgress: (p) => update(item.id, { progress: p }),
          onStatus: (s) => update(item.id, { statusText: s }),
        });
        update(item.id, { status: 'done', output, progress: 1 });
      } catch (e) {
        update(item.id, { status: 'error', error: e instanceof Error ? e.message : 'Sıkıştırma başarısız oldu.' });
      }
    }
    setRunning(false);
  };

  const levelHint = LEVELS.find((l) => l.value === level)!.hint;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <Segmented options={LEVELS.map(({ value, label }) => ({ value, label }))} value={level} onChange={changeLevel} />
        <p className="text-xs text-fg-2">{levelHint}</p>
      </div>

      {!items.length ? (
        <DropArea
          onFiles={addFiles}
          accept={ACCEPT}
          hint="JPG, PNG, WEBP, GIF, PDF, MP3, WAV, MP4, MOV ve daha fazlası · Dosyalarınız cihazınızdan çıkmaz."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-line bg-bg">
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
