'use client';

import { FileFormat, formatBytes } from '@/lib/imageUtils';
import { ChevronDown, ChevronUp, Download, Loader2, Search, Trash2, FileImage, FileAudio, Minimize2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { AppMode } from './Header';

export interface FileState {
  id: string;
  file: File;
  targetFormat: FileFormat;
  status: 'pending' | 'converting' | 'completed' | 'error';
  quality: number;
  convertedBlob?: Blob;
  error?: string;
  downloaded?: boolean;
}

interface FileItemProps {
  fileState: FileState;
  mode: AppMode;
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: FileFormat) => void;
  onQualityChange: (id: string, quality: number) => void;
  onDownload: (id: string) => void;
}

export default function FileItem({
  fileState,
  mode,
  onRemove,
  onFormatChange,
  onQualityChange,
  onDownload,
}: FileItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(mode === 'music' ? 'Ses' : 'Görüntü');

  useEffect(() => {
    setActiveCategory(mode === 'music' ? 'Ses' : 'Görüntü');
  }, [mode]);

  const categories = [
    { name: 'Görüntü', active: mode !== 'music' },
    { name: 'Ses', active: mode === 'music' },
    { name: 'Belge', active: false },
    { name: 'EBook', active: false },
    { name: 'Yazı tipi', active: false },
    { name: 'Vektör', active: false },
    { name: 'CAD', active: false },
  ];

  const allFormats: { label: string; value: FileFormat; category: string }[] = [
    { label: 'PNG', value: 'image/png', category: 'Görüntü' },
    { label: 'SVG', value: 'image/svg+xml' as any, category: 'Görüntü' },
    { label: 'ICO', value: 'image/x-icon' as any, category: 'Görüntü' },
    { label: 'JPG', value: 'image/jpg' as any, category: 'Görüntü' },
    { label: 'WEBP', value: 'image/webp', category: 'Görüntü' },
    { label: 'JPEG', value: 'image/jpeg', category: 'Görüntü' },
    { label: 'DDS', value: 'image/vnd-ms.dds' as any, category: 'Görüntü' },
    { label: 'GIF', value: 'image/gif', category: 'Görüntü' },
    { label: 'CUR', value: 'image/x-icon' as any, category: 'Görüntü' },
    { label: 'BMP', value: 'image/bmp', category: 'Görüntü' },
    { label: 'HDR', value: 'image/vnd.radiance' as any, category: 'Görüntü' },
    { label: 'PSD', value: 'image/vnd.adobe.photoshop' as any, category: 'Görüntü' },
    { label: 'TIFF', value: 'image/tiff' as any, category: 'Görüntü' },
    { label: 'TGA', value: 'image/x-tga' as any, category: 'Görüntü' },
    { label: 'AVIF', value: 'image/avif', category: 'Görüntü' },
    { label: 'RGB', value: 'image/x-rgb' as any, category: 'Görüntü' },
    { label: 'MP3', value: 'audio/mpeg', category: 'Ses' },
    { label: 'WAV', value: 'audio/wav', category: 'Ses' },
    { label: 'OGG', value: 'audio/ogg', category: 'Ses' },
    { label: 'FLAC', value: 'audio/flac', category: 'Ses' },
    { label: 'AAC', value: 'audio/aac' as any, category: 'Ses' },
    { label: 'M4A', value: 'audio/x-m4a' as any, category: 'Ses' },
    { label: 'AIFF', value: 'audio/x-aiff' as any, category: 'Ses' },
  ];

  const filteredFormats = useMemo(() => {
    // Tür kilidini uygula: Sadece ilgili formatları göster
    const relevantFormats = allFormats.filter(f => {
      // Eğer müzik modundaysak ve sadece müzik dosyaları varsa
      if (mode === 'music' && fileState.file.type.startsWith('audio/')) {
        return f.category === 'Ses';
      }
      // Eğer fotoğraf modundaysak ve sadece fotoğraf dosyaları varsa
      if ((mode === 'convert' || mode === 'compress') && fileState.file.type.startsWith('image/')) {
        return f.category === 'Görüntü';
      }
      // Varsayılan: Tüm formatları göster (karışık durum için)
      return true;
    });
    
    return relevantFormats.filter(f => 
      f.category === activeCategory && 
      f.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeCategory, searchQuery, mode, fileState.file.type]);

  const currentFormatLabel = fileState.targetFormat ? fileState.targetFormat.split('/')[1]?.toUpperCase().replace('MPEG', 'MP3').replace('X-', '').replace('JPEG', 'JPG') : 'Format';
  const statusLabel = !fileState.targetFormat ? 'HAZIR DEĞİL' : '';
  const savedAmount = fileState.convertedBlob ? fileState.file.size - fileState.convertedBlob.size : 0;

  return (
    <div className={`flex flex-col p-6 border-b border-white/10 last:border-0 hover:bg-white/5 transition-all duration-300 group relative ${isDropdownOpen ? 'z-[150]' : 'z-10'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl text-purple-600 group-hover:scale-110 transition-transform shadow-xl border border-white/20">
            {mode === 'music' ? <FileAudio className="w-7 h-7" /> : <FileImage className="w-7 h-7" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-semibold text-slate-900 truncate">{fileState.file.name}</span>
            <span className="text-xs font-medium text-slate-700 uppercase tracking-wider">{formatBytes(fileState.file.size)}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {mode !== 'compress' ? (
            <div className="flex items-center gap-4">
              {!fileState.targetFormat && fileState.status === 'pending' && (
                <div className="flex items-center gap-1.5 bg-red-50/80 border border-red-200/60 px-3 py-1.5 rounded-lg">
                  <span className="text-red-600 text-[11px] font-medium">⚠ HAZIR DEĞİL</span>
                </div>
              )}
              <div className="relative">
                <button
                  disabled={fileState.status === 'converting'}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-w-[160px] justify-between"
                  style={{
                    backdropFilter: 'blur(25px)',
                    backgroundColor: isDropdownOpen ? 'rgba(147, 51, 234, 0.15)' : !fileState.targetFormat ? 'rgba(251, 146, 60, 0.12)' : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${isDropdownOpen ? 'rgba(147, 51, 234, 0.3)' : !fileState.targetFormat ? 'rgba(251, 146, 60, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${isDropdownOpen ? 'rgba(147, 51, 234, 0.15)' : !fileState.targetFormat ? 'rgba(251, 146, 60, 0.12)' : 'rgba(255, 255, 255, 0.08)'}`,
                    color: isDropdownOpen ? '#9333ea' : !fileState.targetFormat ? '#ea580c' : '#1e293b'
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={!fileState.targetFormat ? 'text-gray-600' : 'text-slate-900'}>{currentFormatLabel}</span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-full right-0 mt-3 w-screen max-w-[560px] text-white rounded-3xl overflow-visible animate-in fade-in zoom-in-95 duration-200" style={{ zIndex: 99999, backdropFilter: 'blur(25px)', backgroundColor: 'rgba(26, 26, 26, 0.85)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', background: 'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), rgba(26, 26, 26, 0.85)' }}>
                      <div className="p-5 border-b border-white/5 bg-black/20">
                        <div className="relative">
                          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            autoFocus
                            type="text"
                            placeholder="Format ara..."
                            className="w-full bg-transparent border-none py-3 pl-14 pr-5 text-sm outline-none placeholder-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex h-96">
                        <div className="w-[160px] border-r border-white/5 py-3 overflow-y-auto bg-black/40">
                          {categories.map((cat) => (
                            <button
                              key={cat.name}
                              onClick={() => setActiveCategory(cat.name)}
                              disabled={!cat.active || (mode === 'music' && cat.name === 'Görüntü') || (mode !== 'music' && cat.name === 'Ses')}
                              className={`w-full text-left px-5 py-3 text-xs font-light uppercase tracking-widest transition-all ${!cat.active ? 'text-gray-700 cursor-not-allowed' : activeCategory === cat.name ? 'text-white bg-white/10 border-l-2 border-purple-500' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto bg-black/20">
                          <div className="grid grid-cols-3 gap-3">
                            {filteredFormats.map((f) => (
                              <button
                                key={f.label}
                                onClick={() => {
                                  onFormatChange(fileState.id, f.value);
                                  setIsDropdownOpen(false);
                                }}
                                className="py-4 rounded-xl text-xs font-bold transition-all text-white"
                                style={{
                                  backdropFilter: 'blur(25px)',
                                  backgroundColor: fileState.targetFormat === f.value ? 'rgba(147, 51, 234, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                                  border: `1px solid ${fileState.targetFormat === f.value ? 'rgba(147, 51, 234, 0.8)' : 'rgba(255, 255, 255, 0.2)'}`,
                                  boxShadow: fileState.targetFormat === f.value ? '0 4px 16px rgba(147, 51, 234, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
                                  background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${fileState.targetFormat === f.value ? 'rgba(147, 51, 234, 0.6)' : 'rgba(255, 255, 255, 0.08)'}`
                                }}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Minimize2 className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-xs font-medium text-slate-700">Kalite:</span>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-500 px-3 py-1 rounded-lg">
                  <span className="text-sm font-semibold text-white">{Math.round(fileState.quality * 100)}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onQualityChange(fileState.id, Math.max(0.1, fileState.quality - 0.1))}
                  disabled={fileState.quality <= 0.1}
                  className="px-3 py-1.5 text-white rounded-lg font-medium text-[11px] transition-all disabled:cursor-not-allowed flex items-center gap-1 disabled:opacity-60"
                  style={{
                    backdropFilter: 'blur(25px)',
                    backgroundColor: fileState.quality <= 0.1 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${fileState.quality <= 0.1 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.5)'}`
                  }}
                >
                  <ChevronDown className="w-3 h-3" />
                  <span>-10%</span>
                </button>
                <button
                  onClick={() => onQualityChange(fileState.id, Math.min(1, fileState.quality + 0.1))}
                  disabled={fileState.quality >= 1}
                  className="px-3 py-1.5 text-white rounded-lg font-medium text-[11px] transition-all disabled:cursor-not-allowed flex items-center gap-1 disabled:opacity-60"
                  style={{
                    backdropFilter: 'blur(25px)',
                    backgroundColor: fileState.quality >= 1 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(16, 185, 129, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${fileState.quality >= 1 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(16, 185, 129, 0.5)'}`
                  }}
                >
                  <ChevronUp className="w-3 h-3" />
                  <span>+10%</span>
                </button>
              </div>
              <div className="flex items-center gap-2 ml-1 bg-white/15 px-3 py-1.5 rounded-lg border border-white/20">
                <FileImage className="w-3.5 h-3.5 text-purple-500" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-medium text-slate-600 uppercase tracking-wide">Tahmini Boyut</span>
                  <span className="text-xs font-semibold text-purple-600">
                    {formatBytes(Math.round(fileState.file.size * fileState.quality))}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="w-56 flex justify-end items-center gap-4">
            {fileState.status === 'pending' && (mode === 'compress' || fileState.targetFormat) && (
              <span className="text-xs font-medium text-green-400 border border-green-400/30 px-3 py-1.5 rounded-xl bg-green-400/10">HAZIR</span>
            )}
            {fileState.status === 'pending' && mode !== 'compress' && !fileState.targetFormat && (
              <span className="text-xs font-medium text-orange-500 border border-orange-500/30 px-3 py-1.5 rounded-xl bg-orange-500/10">FORMAT SEÇİN</span>
            )}
            {fileState.status === 'converting' && <Loader2 className="w-5 h-5 animate-spin text-purple-400" />}
            {fileState.status === 'completed' && (
              <button
                onClick={() => !fileState.downloaded && onDownload(fileState.id)}
                disabled={fileState.downloaded}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backdropFilter: 'blur(25px)',
                  backgroundColor: fileState.downloaded ? 'rgba(148, 163, 184, 0.3)' : 'rgba(147, 51, 234, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: fileState.downloaded ? '0 4px 16px rgba(0, 0, 0, 0.15)' : '0 8px 24px rgba(147, 51, 234, 0.3)',
                  background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${fileState.downloaded ? 'rgba(148, 163, 184, 0.3)' : 'rgba(147, 51, 234, 0.6)'}`
                }}
              >
                <Download className="w-4 h-4" /> {fileState.downloaded ? 'İNDİRİLDİ' : 'İNDİR'}
              </button>
            )}
            <button
              onClick={() => onRemove(fileState.id)}
              className="p-3 text-slate-700 hover:text-red-500 rounded-xl transition-all"
              style={{
                backdropFilter: 'blur(25px)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                background: 'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(220, 38, 38, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(220, 38, 38, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              }}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}