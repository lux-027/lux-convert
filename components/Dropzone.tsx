'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FolderOpen, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  onFilesSelect: (files: File[]) => void;
  className?: string;
  mode: 'convert' | 'compress' | 'music' | 'document';
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
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative w-full max-w-4xl mx-auto rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center transition-all duration-500 ease-in-out overflow-hidden cursor-pointer',
        'bg-gradient-to-br from-white via-white to-purple-50/40',
        isDragActive ? 'bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/50 scale-[1.01] shadow-2xl ring-2 ring-purple-400/60' : 'hover:bg-white hover:shadow-xl',
        className
      )}
    >
      <input {...getInputProps()} />
      
      {/* Static Background */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem]">
        <div className="absolute top-0 left-0 w-full h-full bg-purple-600 opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-purple-500 opacity-18 rounded-full mix-blend-screen filter blur-xl sm:blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-indigo-500 opacity-18 rounded-full mix-blend-screen filter blur-xl sm:blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-fuchsia-500 opacity-14 rounded-full mix-blend-screen filter blur-xl sm:blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 bg-indigo-400 opacity-16 rounded-full mix-blend-screen filter blur-xl sm:blur-2xl"></div>
        
        {/* Animated Purple Wave Lines */}
        <div className="absolute inset-0 overflow-hidden rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem]">
          <div className="absolute top-[15%] left-[-25%] w-[150%] h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60 blur-sm animate-pulse-wave"></div>
          <div className="absolute top-[35%] left-[-25%] w-[150%] h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50 blur-sm animate-pulse-wave animation-delay-1000"></div>
          <div className="absolute top-[55%] left-[-25%] w-[150%] h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-55 blur-sm animate-pulse-wave animation-delay-2000"></div>
          <div className="absolute top-[75%] left-[-25%] w-[150%] h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-45 blur-sm animate-pulse-wave animation-delay-3000"></div>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
        {/* Upload Button */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-2 sm:gap-4 md:gap-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-4 md:py-6 lg:py-7 min-h-[60px] rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wider truncate">Dosyaları Seçin</span>
            <div className="flex gap-2 sm:gap-3 md:gap-4 border-l border-white/30 pl-2 sm:pl-4 md:pl-6 lg:pl-8 flex-shrink-0">
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
            </div>
          </div>
        </div>
        
        {/* Cloud Upload Options */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 w-full max-w-md mx-auto">
          <button 
            onClick={() => window.open('https://www.dropbox.com', '_blank')}
            className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 h-[36px] rounded-lg sm:rounded-xl bg-blue-600 text-white text-xs sm:text-sm md:text-base font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 active:shadow-lg w-full sm:w-auto"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.007 0C8.618 0 5.61 2.308 4.002 5.766L0 5.766 0 18.234 4.002 18.234C5.61 21.692 8.618 24 12.007 24 17.525 24 22.014 19.511 22.014 14.002 22.014 8.493 17.525 4.002 12.007 4.002L12.007 0ZM12.007 8.004C15.313 8.004 18.01 10.701 18.01 14.002 18.01 17.303 15.313 20 12.007 20 8.696 20 5.999 17.303 5.999 14.002 5.999 10.701 8.696 8.004 12.007 8.004Z"/>
            </svg>
            <span className="truncate">Dropbox'tan Seç</span>
          </button>
          <button 
            onClick={() => window.open('https://drive.google.com', '_blank')}
            className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 h-[36px] rounded-lg sm:rounded-xl bg-red-600 text-white text-xs sm:text-sm md:text-base font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 active:shadow-lg w-full sm:w-auto"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 8.57h-8.32L12 12.85 8.32 8.57H0l12 15.43L24 8.57zM12 0L0 8.57h4.94l7.06-7.98 7.06 7.98H24L12 0z"/>
            </svg>
            <span className="truncate">Drive'dan Seç</span>
          </button>
        </div>
        
        {/* Drag & Drop Text */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500 text-base sm:text-lg font-semibold uppercase tracking-wide">
            veya dosyaları buraya sürükleyin
          </p>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium">Desteklenen formatlar: {mode === 'music' ? 'MP3, WAV, OGG, FLAC' : 'PNG, JPG, JPEG, WEBP'}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}