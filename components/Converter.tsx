'use client';

import { recordConversions } from '@/lib/stats';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ArrowRight, Plus, RotateCcw } from 'lucide-react';
import DropArea from './DropArea';
import FileRow, { DownloadButton, type Status } from './FileRow';
import { Button, Select } from './ui';
import { ACCEPT, getCategory, getTargets, type Category } from '@/lib/formats';
import { downloadAll, downloadBlob, formatBytes, type Output } from '@/lib/files';
import { convertFile } from '@/lib/convert';

type Item = {
  id: string;
  file: File;
  category: Category | null;
  targets: string[];
  target: string;
  status: Status;
  progress: number;
  statusText?: string;
  output?: Output;
  error?: string;
};

const MAX_FILES = 25;

export default function Converter() {
  const [items, setItems] = useState<Item[]>([]);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (id: string, patch: Partial<Item>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const addFiles = useCallback((files: File[]) => {
    setItems((list) => {
      const room = MAX_FILES - list.length;
      const added = files.slice(0, Math.max(room, 0)).map<Item>((file) => {
        const category = getCategory(file);
        const targets = category ? getTargets(file) : [];
        return {
          id: crypto.randomUUID(),
          file,
          category,
          targets,
          target: targets[0] ?? '',
          status: targets.length ? 'idle' : 'error',
          progress: 0,
          error: targets.length ? undefined : 'Bu dosya türü henüz desteklenmiyor.',
        };
      });
      return [...list, ...added];
    });
  }, []);

  const commonTargets = useMemo(() => {
    const valid = items.filter((i) => i.targets.length);
    if (valid.length < 2) return [];
    return valid[0].targets.filter((t) => valid.every((i) => i.targets.includes(t)));
  }, [items]);

  const pending = items.filter((i) => i.target && (i.status === 'idle' || (i.status === 'error' && i.targets.length)));
  const done = items.filter((i) => i.status === 'done' && i.output);

  const convertAll = async () => {
    setRunning(true);
    let succeeded = 0;
    for (const item of pending) {
      update(item.id, { status: 'working', progress: 0, statusText: undefined, error: undefined });
      try {
        const output = await convertFile(item.file, item.target, {
          onProgress: (p) => update(item.id, { progress: p }),
          onStatus: (s) => update(item.id, { statusText: s }),
        });
        update(item.id, { status: 'done', output, progress: 1 });
        succeeded++;
      } catch (e) {
        update(item.id, { status: 'error', error: e instanceof Error ? e.message : 'Dönüştürme başarısız oldu.' });
      }
    }
    setRunning(false);
    recordConversions(succeeded);
  };

  if (!items.length) {
    return (
      <DropArea
        onFiles={addFiles}
        accept={ACCEPT}
        formats={['JPG', 'PNG', 'WEBP', 'MP3', 'WAV', 'MP4', 'MOV', 'PDF', 'DOCX', 'CSV']}
        hint="En fazla 25 dosya · Dosyalarınız cihazınızdan çıkmaz, işlem tarayıcınızda yapılır."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_2px_12px_rgb(60_64_67/0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-fg-2">
          <span>
            {items.length} dosya
          </span>
          {commonTargets.length > 0 && (
            <label className="flex items-center gap-2">
              <span>Tümünü dönüştür:</span>
              <Select
                aria-label="Tüm dosyalar için biçim"
                className="w-28"
                disabled={running}
                value=""
                onChange={(e) =>
                  setItems((list) =>
                    list.map((i) =>
                      i.targets.includes(e.target.value) ? { ...i, target: e.target.value, status: i.status === 'working' ? i.status : 'idle', output: undefined } : i
                    )
                  )
                }
              >
                <option value="" disabled>
                  Seçin
                </option>
                {commonTargets.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </Select>
            </label>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="text" className="h-9 px-3" onClick={() => inputRef.current?.click()} disabled={running || items.length >= MAX_FILES}>
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
        {items.map((item) => (
          <FileRow
            key={item.id}
            file={item.file}
            category={item.category}
            status={item.status}
            progress={item.progress}
            statusText={item.statusText}
            error={item.error}
            disabled={item.status === 'working'}
            doneText={item.output && <>{item.output.name} · {formatBytes(item.output.blob.size)}</>}
            onRemove={() => setItems((list) => list.filter((i) => i.id !== item.id))}
            onDownload={item.output && (() => downloadBlob(item.output!.blob, item.output!.name))}
            right={
              item.targets.length > 0 && (
                <div className="flex items-center gap-2">
                  <ArrowRight className="hidden h-4 w-4 text-fg-2 sm:block" />
                  <Select
                    aria-label={`${item.file.name} hedef biçim`}
                    className="w-24"
                    value={item.target}
                    disabled={item.status === 'working' || running}
                    onChange={(e) => update(item.id, { target: e.target.value, status: 'idle', output: undefined, error: undefined })}
                  >
                    {item.targets.map((t) => (
                      <option key={t} value={t}>
                        {t.toUpperCase()}
                      </option>
                    ))}
                  </Select>
                </div>
              )
            }
          />
        ))}
      </ul>

      <div className="flex flex-col-reverse gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
        {done.length > 1 && (
          <DownloadButton key={done.length} label="Tümünü indir (ZIP)" onClick={() => downloadAll(done.map((i) => i.output!), 'lux-convert.zip')} />
        )}
        <Button onClick={convertAll} disabled={running || !pending.length}>
          {running ? 'Dönüştürülüyor…' : pending.length ? `Dönüştür (${pending.length})` : 'Dönüştürüldü'}
        </Button>
      </div>
    </div>
  );
}
