'use client';

import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from './ui';
import { cn } from '@/lib/utils';

export default function DropArea({
  onFiles,
  accept,
  multiple = true,
  hint,
  formats,
  compact,
}: {
  onFiles: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  hint: string;
  formats?: string[];
  compact?: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (files) => files.length && onFiles(files),
    multiple,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps({ onClick: open })}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed bg-white text-center shadow-[0_1px_3px_rgb(60_64_67/0.08)] transition-all',
        compact ? 'px-6 py-10' : 'px-6 py-14 sm:py-20',
        isDragActive ? 'scale-[1.01] border-primary bg-primary-container/40' : 'border-[#c6d4ea] hover:border-primary/60 hover:bg-[#fafcff]'
      )}
    >
      <input {...getInputProps({ accept })} />
      <div
        className={cn(
          'mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#6ea8fe] to-[#1a73e8] text-white shadow-[inset_0_-4px_0_rgb(0_0_0/0.18),inset_0_2px_0_rgb(255_255_255/0.35),0_10px_24px_rgb(26_115_232/0.35)] transition-transform',
          isDragActive ? '-translate-y-1 scale-110' : 'group-hover:-translate-y-0.5'
        )}
      >
        <Upload className="h-7 w-7 drop-shadow" />
      </div>
      <p className="text-xl font-medium text-fg">{isDragActive ? 'Bırakın, hemen ekleyelim' : 'Dosyaları buraya sürükleyip bırakın'}</p>
      <p className="mt-1 mb-5 text-sm text-fg-2">veya bilgisayarınızdan seçin</p>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
        className="h-11 px-7"
      >
        {multiple ? 'Dosya seçin' : 'Görüntü seçin'}
      </Button>
      {formats && (
        <div className="mt-6 flex max-w-lg flex-wrap justify-center gap-1.5">
          {formats.map((f) => (
            <span key={f} className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-fg-2 ring-1 ring-line">
              {f}
            </span>
          ))}
        </div>
      )}
      <p className="mt-4 max-w-md text-xs text-fg-2">{hint}</p>
    </div>
  );
}
