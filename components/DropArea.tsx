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
  compact,
}: {
  onFiles: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  hint: string;
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
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border-2 border-dashed text-center transition-colors',
        compact ? 'px-6 py-10' : 'px-6 py-16 sm:py-24',
        isDragActive ? 'border-primary bg-primary-container/50' : 'border-line bg-surface hover:border-fg-2/40'
      )}
    >
      <input {...getInputProps({ accept })} />
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary-container text-on-primary-container">
        <Upload className="h-6 w-6" />
      </div>
      <p className="text-lg text-fg">{isDragActive ? 'Bırakın, hemen ekleyelim' : 'Dosyaları buraya sürükleyip bırakın'}</p>
      <p className="mt-1 mb-5 text-sm text-fg-2">veya</p>
      <Button onClick={open}>{multiple ? 'Dosya seçin' : 'Görüntü seçin'}</Button>
      <p className="mt-5 max-w-md text-xs text-fg-2">{hint}</p>
    </div>
  );
}
