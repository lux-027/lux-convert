'use client';

import { formatBytes } from '@/lib/imageUtils';
import { ChevronDown, ChevronUp, Download, Loader2, Search, Trash2, FileImage, FileAudio, Minimize2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { FileState, FileItemProps, AppMode, FileFormat } from '@/types';

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
  const [activeCategory, setActiveCategory] = useState('Görüntü');

  useEffect(() => {
    const fileType = fileState.file.type;
    if (fileType.startsWith('image/')) {
      setActiveCategory('Görüntü');
    } else if (fileType.startsWith('audio/')) {
      setActiveCategory('Ses');
    } else if (fileType.startsWith('application/') || fileType.startsWith('text/')) {
      setActiveCategory('Belge');
    } else {
      setActiveCategory('Görüntü'); // Default
    }
  }, [fileState.file.type]);

  const getFileCategories = () => {
    const fileType = fileState.file.type;
    const parentMode = mode; // Access the parent mode from props
    
    // If parent is in compress mode, allow all categories
    if (parentMode === 'compress') {
      return [
        { name: 'Görüntü', active: true },
        { name: 'Ses', active: true },
        { name: 'Belge', active: true },
      ];
    }
    
    if (fileType.startsWith('image/')) {
      return [
        { name: 'Görüntü', active: true },
        { name: 'Ses', active: false },
        { name: 'Belge', active: false },
      ];
    } else if (fileType.startsWith('audio/')) {
      return [
        { name: 'Görüntü', active: false },
        { name: 'Ses', active: true },
        { name: 'Belge', active: false },
      ];
    } else if (fileType.startsWith('application/') || fileType.startsWith('text/')) {
      return [
        { name: 'Görüntü', active: false },
        { name: 'Ses', active: false },
        { name: 'Belge', active: true },
      ];
    } else {
      // Mixed or unknown types - allow all
      return [
        { name: 'Görüntü', active: true },
        { name: 'Ses', active: true },
        { name: 'Belge', active: true },
      ];
    }
  };

  const categories = getFileCategories();

  const allFormats: FileFormat[] = [
    // Görüntü Formatları
    { name: 'PNG', extensions: ['.png'], category: 'image' },
    { name: 'JPG', extensions: ['.jpg', '.jpeg'], category: 'image' },
    { name: 'WEBP', extensions: ['.webp'], category: 'image' },
    { name: 'GIF', extensions: ['.gif'], category: 'image' },
    { name: 'BMP', extensions: ['.bmp'], category: 'image' },
    { name: 'SVG', extensions: ['.svg'], category: 'image' },
    { name: 'ICO', extensions: ['.ico'], category: 'image' },
    
    // Ses Formatları
    { name: 'MP3', extensions: ['.mp3'], category: 'audio' },
    { name: 'WAV', extensions: ['.wav'], category: 'audio' },
    { name: 'OGG', extensions: ['.ogg'], category: 'audio' },
    { name: 'FLAC', extensions: ['.flac'], category: 'audio' },
    { name: 'AAC', extensions: ['.aac'], category: 'audio' },
    { name: 'M4A', extensions: ['.m4a'], category: 'audio' },
    
    // Belge Formatları
    { name: 'PDF', extensions: ['.pdf'], category: 'document' },
    { name: 'DOCX', extensions: ['.docx'], category: 'document' },
    { name: 'TXT', extensions: ['.txt'], category: 'document' },
  ];

  const filteredFormats = useMemo(() => {
    const categoryMap: { [key: string]: 'image' | 'audio' | 'document' } = {
      'Görüntü': 'image',
      'Ses': 'audio', 
      'Belge': 'document'
    };
    
    return allFormats.filter(f => 
      f.category === categoryMap[activeCategory] && 
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeCategory, searchQuery]);

  const currentFormatLabel = fileState.targetFormat ? fileState.targetFormat.name : 'Format';
  const statusLabel = !fileState.targetFormat ? 'HAZIR DEĞİL' : '';
  const savedAmount = fileState.convertedBlob ? fileState.file.size - fileState.convertedBlob.size : 0;

  return (
    <div className={`flex flex-col p-3 sm:p-4 md:p-6 border-b border-white/10 last:border-0 hover:bg-white/5 transition-all duration-300 group relative overflow-visible ${isDropdownOpen ? 'z-[150]' : 'z-10'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1 min-w-0">
          <div className="p-2 sm:p-3 md:p-4 bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl text-purple-600 group-hover:scale-110 transition-transform shadow-xl border border-white/20 flex-shrink-0">
            {mode === 'music' ? <FileAudio className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> : <FileImage className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 truncate">{fileState.file.name}</span>
            <span className="text-xs sm:text-xs font-medium text-slate-700 uppercase tracking-wider">{formatBytes(fileState.file.size)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
          {mode !== 'compress' ? (
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {!fileState.targetFormat && fileState.status === 'pending' && (
                <div className="flex items-center gap-1.5 bg-red-50/80 border border-red-200/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <span className="text-red-600 text-[10px] sm:text-[11px] font-medium truncate">⚠ HAZIR DEĞİL</span>
                </div>
              )}
              <div className="relative">
                <button
                  disabled={fileState.status === 'converting'}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-medium transition-all min-w-[120px] sm:min-w-[160px] justify-between"
                  style={{
                    backdropFilter: 'blur(25px)',
                    backgroundColor: isDropdownOpen ? 'rgba(147, 51, 234, 0.15)' : !fileState.targetFormat ? 'rgba(251, 146, 60, 0.12)' : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${isDropdownOpen ? 'rgba(147, 51, 234, 0.3)' : !fileState.targetFormat ? 'rgba(251, 146, 60, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${isDropdownOpen ? 'rgba(147, 51, 234, 0.15)' : !fileState.targetFormat ? 'rgba(251, 146, 60, 0.12)' : 'rgba(255, 255, 255, 0.08)'}`,
                    color: isDropdownOpen ? '#9333ea' : !fileState.targetFormat ? '#ea580c' : '#1e293b'
                  }}
                >
                  <span className="flex items-center gap-1 sm:gap-1.5 truncate">
                    <span className={!fileState.targetFormat ? 'text-gray-600' : 'text-slate-900 truncate'}>{currentFormatLabel}</span>
                  </span>
                  <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 sm:mt-3 w-[90vw] sm:w-[80vw] max-w-[400px] md:max-w-[560px] text-white rounded-2xl sm:rounded-3xl overflow-visible animate-in fade-in zoom-in-95 duration-200 z-[9999]" style={{ backdropFilter: 'blur(25px)', backgroundColor: 'rgba(26, 26, 26, 0.85)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', background: 'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), rgba(26, 26, 26, 0.85)' }}>
                      <div className="p-3 sm:p-4 md:p-5 border-b border-white/5 bg-black/20">
                        <div className="relative">
                          <Search className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Format ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 sm:pl-12 md:pl-14 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row h-[300px] sm:h-[400px]">
                        <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/10">
                          {categories.map((cat) => (
                            <button
                              key={cat.name}
                              onClick={() => {
                                setActiveCategory(cat.name);
                                setSearchQuery('');
                              }}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left font-medium transition-all text-xs sm:text-sm ${
                                cat.active 
                                  ? 'bg-purple-100/20 text-purple-300' 
                                  : 'text-gray-400 hover:bg-white/5'
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>

                        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/20">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {filteredFormats.map((f) => (
                              <button
                                key={f.name}
                                onClick={() => {
                                  onFormatChange(fileState.id, f);
                                  setIsDropdownOpen(false);
                                }}
                                className="py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold transition-all text-white"
                                style={{
                                  backdropFilter: 'blur(25px)',
                                  backgroundColor: fileState.targetFormat?.name === f.name ? 'rgba(147, 51, 234, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                                  border: `1px solid ${fileState.targetFormat?.name === f.name ? 'rgba(147, 51, 234, 0.8)' : 'rgba(255, 255, 255, 0.2)'}`,
                                  boxShadow: fileState.targetFormat?.name === f.name ? '0 4px 16px rgba(147, 51, 234, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
                                  background: `linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), ${fileState.targetFormat?.name === f.name ? 'rgba(147, 51, 234, 0.6)' : 'rgba(255, 255, 255, 0.08)'}`
                                }}
                              >
                                <span className="truncate">{f.name}</span>
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