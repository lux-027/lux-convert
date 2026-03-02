
'use client';

import { ImageFormat } from '@/lib/imageUtils';

interface ControlsProps {
  format: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
  quality: number;
  onQualityChange: (quality: number) => void;
}

export default function Controls({
  format,
  onFormatChange,
  quality,
  onQualityChange,
}: ControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-md">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Output Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['image/png', 'image/jpeg', 'image/webp'] as const).map((f) => (
              <button
                key={f}
                onClick={() => onFormatChange(f)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    format === f
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {f.split('/')[1].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quality
            </label>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => onQualityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Higher quality means larger file size.
          </p>
        </div>
      </div>
    </div>
  );
}
