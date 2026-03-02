
'use client';

import { formatBytes } from '@/lib/imageUtils';
import { Download, X } from 'lucide-react';
import Image from 'next/image';
import { useObjectUrl } from '@/hooks/useObjectUrl';

interface ImagePreviewProps {
  originalFile: File | null;
  convertedBlob: Blob | null;
  onDownload: () => void;
  onClear: () => void;
}

export default function ImagePreview({
  originalFile,
  convertedBlob,
  onDownload,
  onClear,
}: ImagePreviewProps) {
  const originalUrl = useObjectUrl(originalFile);
  const convertedUrl = useObjectUrl(convertedBlob);

  if (!originalFile || !convertedBlob) return null;

  const originalSize = formatBytes(originalFile.size);
  const convertedSize = formatBytes(convertedBlob.size);
  const sizeDiff = convertedBlob.size - originalFile.size;
  const sizeDiffPercent = ((sizeDiff / originalFile.size) * 100).toFixed(1);
  const isReduction = sizeDiff < 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Preview</h2>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Original */}
        <div className="space-y-3">
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
            {originalUrl && (
              <Image
                src={originalUrl}
                alt="Original"
                fill
                className="object-contain"
                unoptimized
              />
            )}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              Original
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 px-1">
            <span>{originalFile.type.split('/')[1].toUpperCase()}</span>
            <span className="font-mono">{originalSize}</span>
          </div>
        </div>

        {/* Converted */}
        <div className="space-y-3">
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-blue-200 dark:border-blue-900/50">
            {convertedUrl && (
              <Image
                src={convertedUrl}
                alt="Converted"
                fill
                className="object-contain"
                unoptimized
              />
            )}
            <div className="absolute top-2 left-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
              Converted
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 px-1">
            <span>{convertedBlob.type.split('/')[1].toUpperCase()}</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  isReduction
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {isReduction ? '' : '+'}
                {sizeDiffPercent}%
              </span>
              <span className="font-mono font-medium text-gray-900 dark:text-gray-100">
                {convertedSize}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onDownload}
          className="
            flex items-center gap-2 px-8 py-3 rounded-full 
            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
            text-white font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105
            transition-all duration-300 transform active:scale-95
          "
        >
          <Download className="w-5 h-5" />
          Download Converted Image
        </button>
      </div>
    </div>
  );
}
