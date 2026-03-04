'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Dropzone from '@/components/Dropzone';
import FileItem from '@/components/FileItem';
import Footer from '@/components/Footer';
import LimitToast from '@/components/LimitToast';
import { Plus, Trash2, Zap } from 'lucide-react';
import { FileFormat, FileState, AppMode } from '@/types';

// Format definitions
const allFormats: FileFormat[] = [
  // Image formats
  { name: 'PNG', extensions: ['.png'], category: 'image' },
  { name: 'JPG', extensions: ['.jpg', '.jpeg'], category: 'image' },
  { name: 'WEBP', extensions: ['.webp'], category: 'image' },
  { name: 'GIF', extensions: ['.gif'], category: 'image' },
  { name: 'BMP', extensions: ['.bmp'], category: 'image' },
  { name: 'SVG', extensions: ['.svg'], category: 'image' },
  { name: 'ICO', extensions: ['.ico'], category: 'image' },
  
  // Audio formats
  { name: 'MP3', extensions: ['.mp3'], category: 'audio' },
  { name: 'WAV', extensions: ['.wav'], category: 'audio' },
  { name: 'OGG', extensions: ['.ogg'], category: 'audio' },
  { name: 'FLAC', extensions: ['.flac'], category: 'audio' },
  { name: 'AAC', extensions: ['.aac'], category: 'audio' },
  { name: 'M4A', extensions: ['.m4a'], category: 'audio' },
  
  // Document formats
  { name: 'PDF', extensions: ['.pdf'], category: 'document' },
  { name: 'DOCX', extensions: ['.docx'], category: 'document' },
  { name: 'TXT', extensions: ['.txt'], category: 'document' },
];

export default function Home() {
  const [mode, setMode] = useState<AppMode>('convert');
  const [files, setFiles] = useState<FileState[]>([]);
  const [activeType, setActiveType] = useState<'image' | 'music' | 'document' | null>(null);
  const [globalFormat, setGlobalFormat] = useState<FileFormat | null>(null);
  const [globalQuality, setGlobalQuality] = useState(0.8);
  const [isGlobalDropdownOpen, setIsGlobalDropdownOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalActiveCategory, setGlobalActiveCategory] = useState('Görüntü');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showLimitToast, setShowLimitToast] = useState(false);
  
  const globalDropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic tab locking based on files array
  useEffect(() => {
    if (files.length === 0) {
      // No files - unlock all tabs and reset to default
      setActiveType(null);
      setMode('convert');
    } else {
      // Files exist - ensure proper locking based on first file type
      const firstFile = files[0].file;
      let newActiveType: 'image' | 'music' | 'document' | null;
      
      if (firstFile.type.startsWith('image/')) {
        newActiveType = 'image';
        setMode('convert');
      } else if (firstFile.type.startsWith('audio/')) {
        newActiveType = 'music';
        setMode('music');
      } else if (firstFile.type.startsWith('application/') || firstFile.type.startsWith('text/')) {
        newActiveType = 'document';
        setMode('document');
      } else {
        newActiveType = null;
        setMode('convert');
      }
      
      setActiveType(newActiveType);
    }
  }, [files.length]); // Only depend on files.length to prevent infinite loops

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
  };

  const handleFilesSelect = (selectedFiles: File[]) => {
    // File limit check
    const currentFileCount = files.length;
    const maxFiles = 10;
    const remainingSlots = maxFiles - currentFileCount;
    
    if (currentFileCount >= maxFiles) {
      alert('Dosya limitine ulaştınız.');
      return;
    }
    
    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    const newFiles: FileState[] = filesToAdd.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      targetFormat: null as unknown as FileFormat,
      status: 'pending' as const,
      quality: 0.8,
    }));

    setFiles([...files, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const removeAllFiles = () => {
    setFiles([]);
    setGlobalFormat(null);
    setGlobalQuality(0.8);
  };

  const updateFormat = (id: string, format: FileFormat) => {
    setFiles(files.map(f => f.id === id ? { ...f, targetFormat: format } : f));
  };

  const updateQuality = (id: string, quality: number) => {
    setFiles(files.map(f => f.id === id ? { ...f, quality } : f));
  };

  const downloadFile = (id: string) => {
    console.log('Download file:', id);
  };

  const convertAll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const applyGlobalFormat = (format: FileFormat) => {
    setGlobalFormat(format);
    setFiles(files.map(f => ({ ...f, targetFormat: format })));
  };

  const applyGlobalQuality = (quality: number) => {
    setGlobalQuality(quality);
    setFiles(files.map(f => ({ ...f, quality })));
  };

  const getGlobalCategories = () => {
    return [
      { name: 'Görüntü', active: globalActiveCategory === 'Görüntü' },
      { name: 'Ses', active: globalActiveCategory === 'Ses' },
      { name: 'Belge', active: globalActiveCategory === 'Belge' },
    ];
  };

  const hasFiles = files.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 overflow-x-hidden w-full">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute" style={{ top: '8%', left: '5%', width: '300px', height: '5px', background: 'linear-gradient(90deg, transparent, #8a2be2, transparent)', transform: 'rotate(-35deg)', boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 60px #8a2be2', filter: 'blur(10px)', animation: 'breathe 6s ease-in-out infinite' }}></div>
      </div>

      <div className="relative w-full" style={{ zIndex: 1 }}>
        <Header mode={mode} onModeChange={handleModeChange} activeType={activeType} />
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center relative w-full overflow-x-hidden" style={{ zIndex: 1 }}>
        <div className="text-center mb-8 sm:mb-16 space-y-4 sm:space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 blur-3xl opacity-20"></div>
            <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-2 sm:mb-4 px-4">
              {mode === 'convert' ? 'Görüntü Dönüştürücü' : mode === 'compress' ? 'Görüntü Sıkıştırıcı' : mode === 'music' ? 'Ses Dönüştürücü' : 'Belge Dönüştürücü'}
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed px-4">
            {mode === 'convert' 
              ? 'Görüntü dosyalarınızı istediğiniz biçime dönüştürün' 
              : mode === 'compress'
                ? 'Görüntü dosyalarınızı boyutunu kaliteden ödün vermeden düşürün'
                : mode === 'music'
                ? 'Ses dosyalarınızı hızlıca çevirin'
                : 'Belge dosyalarınızı istediğiniz biçime dönüştürün'}
          </p>
        </div>

        {!hasFiles ? (
          <div className="w-full max-w-5xl px-2 sm:px-4 md:px-6">
            {/* Upload Area */}
            <div className="relative glass-droplet-inner rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 md:p-12 lg:p-20 border border-white/30 shadow-2xl text-center overflow-hidden">
              <Dropzone onFilesSelect={handleFilesSelect} mode={mode} />
            </div>
            
            {/* Features Section */}
            <div className="relative glass-droplet-footer p-4 sm:p-6 md:p-8 border-t border-white/20 rounded-b-[1.5rem] sm:rounded-b-[2rem] mt-4 sm:mt-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 md:gap-16 text-white">
                <div className="flex items-center gap-2 sm:gap-3 group">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors flex-shrink-0">
                    <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base lg:text-lg">HIZLI</div>
                    <div className="text-xs text-white/80 hidden sm:block">Anında işlem</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 group">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors flex-shrink-0">
                    <div className="w-3 h-3 sm:w-6 sm:h-6 border-2 border-white rounded-sm"></div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base lg:text-lg">GÜVENLİ</div>
                    <div className="text-xs text-white/80 hidden sm:block">Gizlilik korumalı</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 group">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors flex-shrink-0">
                    <div className="w-3 h-3 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">ÜC</div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base lg:text-lg">ÜCRETSİZ</div>
                    <div className="text-xs text-white/80 hidden sm:block">Sınırsız kullanım</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl px-2 sm:px-4 md:px-6">
            {/* Files List */}
            <div className="relative glass-droplet rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] shadow-3xl border border-white/20 overflow-visible">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Yüklenen Dosyalar ({files.length})</h3>
                </div>
                
                {/* Files List */}
                <div className="space-y-2 sm:space-y-3 overflow-x-hidden">
                  {files.map((fileState) => (
                    <FileItem
                      key={fileState.id}
                      fileState={fileState}
                      mode={mode}
                      onRemove={removeFile}
                      onFormatChange={updateFormat}
                      onQualityChange={updateQuality}
                      onDownload={downloadFile}
                    />
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                    <label className="flex items-center gap-2 sm:gap-3 font-bold cursor-pointer transition-all hover:scale-105 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl flex-1 justify-center text-white text-sm sm:text-base"
                      style={{ 
                        backdropFilter: 'blur(25px)', 
                        backgroundColor: 'rgba(147, 51, 234, 0.85)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)', 
                        boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)', 
                        background: 'linear-gradient(170deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), rgba(147, 51, 234, 0.85)', 
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' 
                      }}>
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="truncate">DAHA FAZLA EKLE</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFilesSelect(Array.from(e.target.files))}
                      />
                    </label>
                    <button
                      onClick={removeAllFiles}
                      className="flex items-center gap-2 sm:gap-3 text-white font-bold transition-all hover:scale-105 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base"
                      style={{ backdropFilter: 'blur(25px)', backgroundColor: 'rgba(220, 38, 38, 0.85)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)', background: 'linear-gradient(170deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), rgba(220, 38, 38, 0.85)', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="truncate">TÜMÜNÜ SİL</span>
                    </button>
                  </div>
                  
                  {/* Convert Button */}
                  <button
                    onClick={convertAll}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-3 font-bold transition-all hover:scale-105 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base"
                    style={{
                      backdropFilter: 'blur(25px)',
                      backgroundColor: isProcessing ? 'rgba(148, 163, 184, 0.7)' : 'rgba(34, 197, 94, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
                      background: `linear-gradient(170deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), ${isProcessing ? 'rgba(148, 163, 184, 0.7)' : 'rgba(34, 197, 94, 0.85)'}`,
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                      opacity: isProcessing ? 0.8 : 1
                    }}
                  >
                    {isProcessing ? 'İŞLENİYOR...' : 'ŞİMDİ DÖNÜŞTÜR'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      
      {/* Limit Toast Notification */}
      <LimitToast
        message={toastMessage}
        isVisible={showLimitToast}
        onClose={() => setShowLimitToast(false)}
      />
    </div>
  );
}
