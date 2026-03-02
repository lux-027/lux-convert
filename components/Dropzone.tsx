'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FolderOpen, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  onFilesSelect: (files: File[]) => void;
  className?: string;
  mode: 'convert' | 'compress' | 'music';
}

export default function Dropzone({ onFilesSelect, className, mode }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFilesSelect(acceptedFiles);
      }
    },
    [onFilesSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mode === 'music' 
      ? { 'audio/*': ['.mp3', '.wav', '.ogg', '.flac'] }
      : { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
  });

  return (
    <div
      className={cn(
        'relative w-full max-w-4xl mx-auto rounded-[2.5rem] p-16 flex flex-col items-center justify-center transition-all duration-500 ease-in-out overflow-hidden',
        'bg-gradient-to-br from-white via-white to-purple-50/40',
        isDragActive ? 'bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/50 scale-[1.01] shadow-2xl ring-2 ring-purple-400/60' : 'hover:bg-white hover:shadow-xl',
        className
      )}
    >
      {/* Static Background */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-full bg-purple-600 opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-purple-500 opacity-18 rounded-full mix-blend-screen filter blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-indigo-500 opacity-18 rounded-full mix-blend-screen filter blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-fuchsia-500 opacity-14 rounded-full mix-blend-screen filter blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-10 h-10 bg-indigo-400 opacity-16 rounded-full mix-blend-screen filter blur-2xl"></div>
        
        {/* Animated Purple Wave Lines */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-[15%] left-[-25%] w-[150%] h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60 blur-sm animate-pulse-wave"></div>
          <div className="absolute top-[35%] left-[-25%] w-[150%] h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50 blur-sm animate-pulse-wave animation-delay-1000"></div>
          <div className="absolute top-[55%] left-[-25%] w-[150%] h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-55 blur-sm animate-pulse-wave animation-delay-2000"></div>
          <div className="absolute top-[75%] left-[-25%] w-[150%] h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-45 blur-sm animate-pulse-wave animation-delay-3000"></div>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Upload Button */}
        <div {...getRootProps()} className="relative group">
          <input {...getInputProps()} />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-7 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105 cursor-pointer">
            <span className="text-2xl font-black uppercase tracking-wider">Dosyaları Seçin</span>
            <div className="flex gap-4 border-l border-white/30 pl-8">
              <FolderOpen className="w-7 h-7" />
              <HardDrive className="w-7 h-7" />
            </div>
          </div>
        </div>
        
        {/* Cloud Upload Options */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open('https://www.dropbox.com', '_blank')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 active:shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.007 0C8.618 0 5.61 2.308 4.002 5.766L0 5.766 0 18.234 4.002 18.234C5.61 21.692 8.618 24 12.007 24 17.525 24 22.014 19.511 22.014 14.002 22.014 8.493 17.525 4.002 12.007 4.002L12.007 0ZM12.007 8.004C15.313 8.004 18.01 10.701 18.01 14.002 18.01 17.303 15.313 20 12.007 20 8.696 20 5.999 17.303 5.999 14.002 5.999 10.701 8.696 8.004 12.007 8.004Z"/>
            </svg>
            <span>Dropbox</span>
          </button>
          <button 
            onClick={() => window.open('https://drive.google.com', '_blank')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white text-lg font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 active:shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 8.57h-8.32L12 12.85 8.32 8.57H0l12 15.43L24 8.57zM12 0L0 8.57h4.94l7.06-7.98 7.06 7.98H24L12 0z"/>
            </svg>
            <span>Google Drive</span>
          </button>
        </div>
        
        {/* Drag & Drop Text */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500 text-lg font-semibold uppercase tracking-wide">
            veya dosyaları buraya sürükleyin
          </p>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-medium">Desteklenen formatlar: {mode === 'music' ? 'MP3, WAV, OGG, FLAC' : 'PNG, JPG, JPEG, WEBP'}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}