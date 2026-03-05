'use client';

import { Globe, ChevronDown, Zap, Minimize2, Image as ImageIcon, Music, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { AppMode } from '@/types';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  activeType?: 'image' | 'music' | 'document' | null;
}

export default function Header({ mode, onModeChange, activeType }: HeaderProps) {
  // const { language, changeLanguage, t, isLoading } = useLanguage();
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const changeLanguage = (lang: 'tr' | 'en') => {
    console.log('Dil değişti:', lang.toUpperCase());
    setLanguage(lang);
    try {
      localStorage.setItem('lux-convert-language', lang);
    } catch (error) {
      console.log('LocalStorage hatası:', error);
    }
  };

  useEffect(() => {
    if (!isLangOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!langMenuRef.current) return;
      if (!langMenuRef.current.contains(target)) setIsLangOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLangOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isLangOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(target)) setIsMobileMenuOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Get current mode display name
  const getCurrentModeName = () => {
    switch (mode) {
      case 'convert': return 'Görüntü';
      case 'compress': return 'Sıkıştır';
      case 'music': return 'Ses';
      case 'document': return 'Belge';
      default: return 'Görüntü';
    }
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto relative group">
        {/* Animated Background Strips for Header */}
        <div className="absolute -inset-4 z-0 overflow-hidden blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute top-[20%] left-[-10%] w-[120%] h-4 bg-primary/40 rounded-full animate-blob-horizontal" />
          <div className="absolute top-[60%] left-[-10%] w-[120%] h-3 bg-purple-400/30 rounded-full animate-blob-horizontal animation-delay-2000" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between p-4 w-full glass-header rounded-2xl border border-white/20 relative z-10 gap-4 md:gap-0">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group cursor-pointer self-center md:self-auto mb-4 md:mb-0">
            <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
              Lux<span className="text-primary">Convert</span>
            </h1>
          </div>

          {/* Navigation Section */}
          {/* Mobile Dropdown */}
          <div className="md:hidden flex flex-col w-full ml-auto" ref={mobileMenuRef}>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-gray-400 font-medium">Belge türü seçiniz:</span>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white border-none rounded-xl px-4 py-2 font-medium shadow-sm"
              >
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                  {getCurrentModeName()}
                </span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 relative">
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      onModeChange('convert');
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={activeType === 'music' || activeType === 'document'}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all border-b border-white/10",
                      mode === 'convert' ? "text-white bg-white/10" : (activeType === 'music' || activeType === 'document') && mode !== 'compress' ? "text-gray-500 cursor-not-allowed opacity-75" : "text-white hover:bg-white/10"
                    )}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Görüntü
                  </button>
                  <button
                    onClick={() => {
                      onModeChange('compress');
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all border-b border-white/10",
                      mode === 'compress' ? "text-white bg-white/10" : "text-white hover:bg-white/10"
                    )}
                  >
                    <Minimize2 className="w-4 h-4" />
                    Sıkıştır
                  </button>
                  <button
                    onClick={() => {
                      onModeChange('music');
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={activeType === 'image' || activeType === 'document'}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all border-b border-white/10",
                      mode === 'music' ? "text-white bg-white/10" : (activeType === 'image' || activeType === 'document') && mode !== 'compress' ? "text-gray-500 cursor-not-allowed opacity-75" : "text-white hover:bg-white/10"
                    )}
                  >
                    <Music className="w-4 h-4" />
                    Ses
                  </button>
                  <button
                    onClick={() => {
                      onModeChange('document');
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={activeType === 'image' || activeType === 'music'}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all",
                      mode === 'document' ? "text-white bg-white/10" : (activeType === 'image' || activeType === 'music') && mode !== 'compress' ? "text-gray-500 cursor-not-allowed opacity-75" : "text-white hover:bg-white/10"
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    Belge
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap justify-center items-center gap-2 md:gap-6 glass-nav px-4 md:px-8 py-1.5 md:py-1.5 rounded-2xl shadow-inner border border-white/10 w-full md:w-auto max-w-full overflow-x-hidden">
          <div className="relative">
            {/* Sliding background indicator */}
            <div 
              className={cn(
                "absolute inset-0 bg-white/90 rounded-xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0",
                mode === 'convert' ? "opacity-100" : "opacity-0"
              )}
            />
            <button
              onClick={() => onModeChange('convert')}
              disabled={activeType === 'music' || activeType === 'document'}
              className={cn(
                "relative z-10 flex items-center gap-1.5 md:gap-2.5 px-2 md:px-5 py-1.5 md:py-2.5 text-xs md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
                mode === 'convert' ? "text-primary scale-105" : (activeType === 'music' || activeType === 'document') && mode !== 'compress' ? "text-gray-600 cursor-not-allowed opacity-75" : "text-gray-900 hover:text-black opacity-90 hover:opacity-100"
              )}
            >
              <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Görüntü</span>
              <span className="sm:hidden">Gör</span>
            </button>
          </div>
          
          <div className="relative">
            <div 
              className={cn(
                "absolute inset-0 bg-white/90 rounded-xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0",
                mode === 'compress' ? "opacity-100" : "opacity-0"
              )}
            />
            <button
              onClick={() => onModeChange('compress')}
              className={cn(
                "relative z-10 flex items-center gap-1.5 md:gap-2.5 px-2 md:px-5 py-1.5 md:py-2.5 text-xs md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
                mode === 'compress' ? "text-primary scale-105" : "text-gray-900 hover:text-black opacity-90 hover:opacity-100"
              )}
            >
              <Minimize2 className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Sıkıştır</span>
              <span className="sm:hidden">Sık</span>
            </button>
          </div>

          <div className="relative">
            <div 
              className={cn(
                "absolute inset-0 bg-white/90 rounded-xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0",
                mode === 'music' ? "opacity-100" : "opacity-0"
              )}
            />
            <button
              onClick={() => onModeChange('music')}
              disabled={activeType === 'image' || activeType === 'document'}
              className={cn(
                "relative z-10 flex items-center gap-1.5 md:gap-2.5 px-2 md:px-5 py-1.5 md:py-2.5 text-xs md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
                mode === 'music' ? "text-primary scale-105" : (activeType === 'image' || activeType === 'document') && mode !== 'compress' ? "text-gray-600 cursor-not-allowed opacity-75" : "text-gray-900 hover:text-black opacity-90 hover:opacity-100"
              )}
            >
              <Music className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Ses</span>
              <span className="sm:hidden">Ses</span>
            </button>
          </div>

          <div className="relative">
            <div 
              className={cn(
                "absolute inset-0 bg-white/90 rounded-xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0",
                mode === 'document' ? "opacity-100" : "opacity-0"
              )}
            />
            <button
              onClick={() => onModeChange('document')}
              disabled={activeType === 'image' || activeType === 'music'}
              className={cn(
                "relative z-10 flex items-center gap-1.5 md:gap-2.5 px-2 md:px-5 py-1.5 md:py-2.5 text-xs md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
                mode === 'document' ? "text-primary scale-105" : (activeType === 'image' || activeType === 'music') && mode !== 'compress' ? "text-gray-600 cursor-not-allowed opacity-75" : "text-gray-900 hover:text-black opacity-90 hover:opacity-100"
              )}
            >
              <FileText className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Belge</span>
              <span className="sm:hidden">Bel</span>
            </button>
          </div>
        </nav>

        <div className="hidden md:flex items-center justify-end w-32" ref={langMenuRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen((v) => !v)}
              className="group relative inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/35 px-3 py-2 text-xs font-black text-gray-900 backdrop-blur-md transition-all hover:bg-white/50 active:scale-[0.98]"
            >
              <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 blur-md transition-opacity group-hover:opacity-100"></span>
              <Globe className="w-4 h-4 opacity-80" />
              <span>{language === 'tr' ? 'TR' : 'EN'}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-white/30 bg-white/60 backdrop-blur-2xl shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)]">
                <button
                  type="button"
                  onClick={() => {
                    console.log('Türkçe butonuna tıklandı');
                    changeLanguage('tr');
                    setIsLangOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-xs font-black text-gray-900 transition-colors hover:bg-purple-600/10"
                >
                  Türkçe
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('English butonuna tıklandı');
                    changeLanguage('en');
                    setIsLangOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-xs font-black text-gray-900 transition-colors hover:bg-indigo-600/10"
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </header>
);
}
