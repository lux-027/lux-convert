'use client';

import Link from 'next/link';
import { formatBytes } from '@/lib/imageUtils';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [stats, setStats] = useState({ count: 0, size: 0 });

  useEffect(() => {
    // Listen for conversion events to update footer stats
    const handleUpdateStats = (event: any) => {
      setStats(prev => ({
        count: prev.count + 1,
        size: prev.size + event.detail.size
      }));
    };

    window.addEventListener('conversion-complete', handleUpdateStats);
    return () => window.removeEventListener('conversion-complete', handleUpdateStats);
  }, []);

  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-slate-50"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/10"></div>
      <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-600/10 blur-3xl"></div>

      <div className="relative py-14">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-slate-400/25 bg-white/30 backdrop-blur-2xl shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-purple-600/10"></div>
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl"></div>
            <div className="pointer-events-none absolute inset-0 rounded-[2.75rem] ring-1 ring-white/35"></div>
            <div className="pointer-events-none absolute inset-0 rounded-[2.75rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_0_60px_rgba(148,163,184,0.18),inset_0_-30px_70px_rgba(15,23,42,0.10)]"></div>
            <div className="pointer-events-none absolute -inset-1 rounded-[3rem] bg-gradient-to-br from-slate-400/15 via-transparent to-slate-700/10 blur-xl"></div>

            <div className="relative p-10 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">Dönüştürülmüş Dosyalar</p>
                  <div className="mt-4 flex items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">
                      {stats.count.toLocaleString()}
                    </span>
                    <span className="text-base md:text-lg font-semibold text-slate-500">
                      / {formatBytes(stats.size)}
                    </span>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/45 px-4 py-2 text-xs font-bold text-slate-700 backdrop-blur-md shadow-[0_12px_30px_-22px_rgba(0,0,0,0.25)]">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>Yerel işlem</span>
                    <span className="text-slate-400">•</span>
                    <span>Gizlilik odaklı</span>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">Bağlantılar</p>
                      <Link href="/hakkimizda" className="block text-sm font-bold text-slate-800 hover:text-purple-700 transition-colors">Hakkımızda</Link>
                      <Link href="/guvenlik" className="block text-sm font-bold text-slate-800 hover:text-purple-700 transition-colors">Güvenlik</Link>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">Sürüm</p>
                      <div className="rounded-2xl border border-white/70 bg-white/45 p-4 text-sm text-slate-800 backdrop-blur-md shadow-[0_12px_30px_-22px_rgba(0,0,0,0.25)]">
                        <div className="font-bold text-slate-900">LuxConvert</div>
                        <div className="mt-1 text-xs text-slate-500">Hızlı • Güvenli • Ücretsiz</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/60 pt-6">
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

