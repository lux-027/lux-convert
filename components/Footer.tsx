'use client';

import Link from 'next/link';
import { formatBytes } from '@/lib/imageUtils';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [stats, setStats] = useState({ count: 0, size: 0 });

  useEffect(() => {
    // localStorage'dan mevcut istatistikleri yükle
    const loadStats = () => {
      try {
        const savedStats = localStorage.getItem('lux-convert-global-stats');
        if (savedStats) {
          const parsed = JSON.parse(savedStats);
          setStats({ count: parsed.count || 0, size: parsed.size || 0 });
        }
      } catch (error) {
        console.log('Stats yükleme hatası:', error);
      }
    };

    loadStats();

    // Listen for conversion events to update footer stats
    const handleUpdateStats = (event: any) => {
      const newStats = {
        count: stats.count + 1,
        size: stats.size + event.detail.size
      };
      
      // State'i güncelle
      setStats(newStats);
      
      // localStorage'a kaydet
      try {
        localStorage.setItem('lux-convert-global-stats', JSON.stringify(newStats));
      } catch (error) {
        console.log('Stats kaydetme hatası:', error);
      }
    };

    window.addEventListener('conversion-complete', handleUpdateStats);
    return () => window.removeEventListener('conversion-complete', handleUpdateStats);
  }, [stats.count, stats.size]);

  return (
    <footer className="relative mt-24">
      <div className="relative py-14">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="rounded-3xl border-2 border-purple-600 bg-white p-10 md:p-12">

            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">Dönüştürülen Dosya</p>
                  <div className="mt-4 flex items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">
                      {stats.count.toLocaleString()}
                    </span>
                    <span className="text-base md:text-lg font-semibold text-slate-500">
                      adet / {formatBytes(stats.size)}
                    </span>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>Yerel işlem</span>
                    <span className="text-purple-400">•</span>
                    <span>Gizlilik odaklı</span>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">Bağlantılar</p>
                      <Link href="/hakkimizda" className="block text-sm font-bold text-slate-800 hover:text-purple-700 transition-colors">Hakkımızda</Link>
                      <Link href="/guvenlik" className="block text-sm font-bold text-slate-800 hover:text-purple-700 transition-colors">Gizlilik ve Güvenlik</Link>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">Sürüm</p>
                      <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
                        <div className="font-bold text-purple-900">LuxConvert</div>
                        <div className="mt-1 text-xs text-purple-500">Hızlı • Güvenli • Ücretsiz</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-purple-200 pt-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  © 2026 LuxConvert. Yerel ve güvenli.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

