'use client';

import { useState, type ReactNode } from 'react';
import { CheckCircle2, Download, FileText, Film, Image as ImageIcon, Music, AlertCircle, X } from 'lucide-react';
import type { Category } from '@/lib/formats';
import { formatBytes } from '@/lib/files';
import { Button, IconButton } from './ui';
import { cn } from '@/lib/utils';

export type Status = 'idle' | 'working' | 'done' | 'error';

const ICONS: Record<Category, typeof ImageIcon> = { image: ImageIcon, audio: Music, video: Film, document: FileText };
const TINTS: Record<Category, string> = {
  image: 'bg-[#e8f0fe] text-[#1a73e8]',
  audio: 'bg-[#fce8e6] text-[#d93025]',
  video: 'bg-[#fef7e0] text-[#e37400]',
  document: 'bg-[#e6f4ea] text-[#188038]',
};

const thumbs = new WeakMap<File, string>();

function thumbUrl(file: File) {
  let url = thumbs.get(file);
  if (!url) {
    url = URL.createObjectURL(file);
    thumbs.set(file, url);
  }
  return url;
}

function Thumb({ file, category }: { file: File; category: Category | null }) {
  const [broken, setBroken] = useState(false);
  const Icon = category ? ICONS[category] : FileText;
  if (category === 'image' && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbUrl(file)}
        alt=""
        onError={() => setBroken(true)}
        className="h-10 w-10 shrink-0 rounded-xl bg-surface-2 object-cover ring-1 ring-line"
      />
    );
  }
  return (
    <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', category ? TINTS[category] : 'bg-surface-2 text-fg-2')}>
      <Icon className="h-5 w-5" />
    </div>
  );
}

export default function FileRow({
  file,
  category,
  status,
  progress,
  statusText,
  doneText,
  idleText,
  error,
  right,
  onRemove,
  onDownload,
  disabled,
}: {
  file: File;
  category: Category | null;
  status: Status;
  progress?: number;
  statusText?: string;
  doneText?: ReactNode;
  idleText?: ReactNode;
  error?: string;
  right?: ReactNode;
  onRemove: () => void;
  onDownload?: () => void;
  disabled?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:gap-4">
      <Thumb file={file} category={category} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg" title={file.name}>
          {file.name}
        </p>
        {status === 'working' ? (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className={cn('h-full rounded-full bg-primary transition-[width] duration-300', !progress && 'w-1/3 animate-pulse')}
                style={progress ? { width: `${Math.round(progress * 100)}%` } : undefined}
              />
            </div>
            <span className="shrink-0 text-xs text-fg-2">{progress ? `%${Math.round(progress * 100)}` : statusText || 'İşleniyor…'}</span>
          </div>
        ) : status === 'done' ? (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {doneText}
          </p>
        ) : status === 'error' ? (
          <p className="mt-0.5 flex items-start gap-1 text-xs text-error">
            <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">{error}</span>
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-fg-2">{idleText ?? formatBytes(file.size)}</p>
        )}
      </div>
      {right}
      {status === 'done' && onDownload && (
        <Button variant="tonal" className="h-9 px-4" onClick={onDownload}>
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">İndir</span>
        </Button>
      )}
      <IconButton onClick={onRemove} disabled={disabled} aria-label="Kaldır" title="Kaldır">
        <X className="h-4 w-4" />
      </IconButton>
    </li>
  );
}
