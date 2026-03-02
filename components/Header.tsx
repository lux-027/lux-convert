'use client';

import { Globe, ChevronDown, Zap, Minimize2, Image as ImageIcon, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useLanguage, Language } from '../src/hooks/useLanguage';

export type AppMode = 'convert' | 'compress' | 'music';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  activeType?: 'image' | 'music' | null;
}

export default function Header({ mode, onModeChange, activeType }: HeaderProps) {
  const { language, changeLanguage, t, isLoading } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto relative group">
        {/* Animated Background Strips for Header */}
        <div className="absolute -inset-4 z-0 overflow-hidden blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute top-[20%] left-[-10%] w-[120%] h-4 bg-primary/40 rounded-full animate-blob-horizontal" />
          <div className="absolute top-[60%] left-[-10%] w-[120%] h-3 bg-purple-400/30 rounded-full animate-blob-horizontal animation-delay-2000" />
        </div>
        
        <div className="flex items-center justify-between p-4 w-full glass-header rounded-2xl border border-white/20 relative z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
            Lux<span className="text-primary">Convert</span>
          </h1>
        </div>

        <nav className="flex items-center glass-nav p-1.5 rounded-2xl relative overflow-hidden shadow-inner border border-white/10">
          {/* Sliding background indicator */}
          <div 
            className={cn(
              "absolute top-1.5 bottom-1.5 w-[calc(33.33%-4px)] bg-white/90 rounded-xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0",
              mode === 'convert' ? "left-1" : mode === 'compress' ? "left-[33.33%]" : "left-[66.66%]"
            )}
          />
          
          <button
            onClick={() => onModeChange('convert')}
            disabled={activeType === 'music'}
            className={cn(
              "relative z-10 flex items-center gap-2.5 px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
              mode === 'convert' ? "text-primary scale-105" : activeType === 'music' ? "text-gray-600 cursor-not-allowed opacity-75" : "text-gray-900 hover:text-black opacity-90 hover:opacity-100"
            )}
          >
            <ImageIcon className="w-4 h-4" />
            Dönüştür
          </button>
          
          <button
            onClick={() => onModeChange('compress')}
            disabled={activeType === 'music'}
            className={cn(
              "relative z-10 flex items-center gap-2.5 px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
              mode === 'compress' ? "text-primary scale-105" : activeType === 'music' ? "text-gray-600 cursor-not-allowed opacity-75" : "text-gray-900 hover:text-black opacity-90 hover:opacity-100"
            )}
          >
            <Minimize2 className="w-4 h-4" />
            Sıkıştır
          </button>

          <button
            onClick={() => onModeChange('music')}
            disabled={activeType === 'image'}
            className={cn(
              "relative z-10 flex items-center gap-2.5 px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
              mode === 'music' ? "text-primary scale-105" : activeType === 'image' ? "text-gray-600 cursor-not-allowed opacity-75" : "text-gray-900 hover:text-black opacity-90 hover:opacity-100"
            )}
          >
            <Music className="w-4 h-4" />
            Müzik
          </button>
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
