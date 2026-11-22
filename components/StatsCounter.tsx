'use client';

import { useEffect, useRef, useState } from 'react';
import { STATS_EVENT } from '@/lib/stats';

const POLL_MS = 10_000;
const fmt = new Intl.NumberFormat('tr-TR');

function nextMilestone(n: number) {
  const step = n < 50_000 ? 5_000 : n < 200_000 ? 25_000 : 100_000;
  return Math.ceil((n + 1) / step) * step;
}

export default function StatsCounter() {
  const [target, setTarget] = useState<number | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  const [bump, setBump] = useState(0);
  const shownRef = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch('/api/stats', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d: { total: number }) => alive && setTarget((t) => Math.max(t ?? 0, d.total)))
        .catch(() => {});
    load();
    const id = setInterval(load, POLL_MS);
    const onStats = (e: Event) => setTarget((t) => Math.max(t ?? 0, (e as CustomEvent<number>).detail));
    window.addEventListener(STATS_EVENT, onStats);
    return () => {
      alive = false;
      clearInterval(id);
      window.removeEventListener(STATS_EVENT, onStats);
    };
  }, []);

  useEffect(() => {
    if (target == null) return;
    const from = shownRef.current ?? Math.max(0, target - 120);
    if (from === target) return;
    const start = performance.now();
    const dur = shownRef.current == null ? 1400 : 800;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      shownRef.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setBump((b) => b + 1);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const value = shown ?? 0;
  const goal = nextMilestone(target ?? 0);
  const ratio = target == null ? 0 : Math.min(1, value / goal);
  const R = 52;
  const arc = Math.PI * R;

  return (
    <div className="flex items-center gap-5 rounded-3xl border border-line bg-white p-5 shadow-[0_2px_12px_rgb(60_64_67/0.06)]">
      <div className="relative h-[72px] w-[128px] shrink-0">
        <svg viewBox="0 0 128 72" className="h-full w-full" aria-hidden="true">
          <path d={`M12 64a${R} ${R} 0 0 1 104 0`} fill="none" stroke="#e8f0fe" strokeWidth="10" strokeLinecap="round" />
          <path
            d={`M12 64a${R} ${R} 0 0 1 104 0`}
            fill="none"
            stroke="url(#stats-g)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={arc}
            strokeDashoffset={arc * (1 - ratio)}
            style={{ transition: 'stroke-dashoffset 800ms ease-out' }}
          />
          <defs>
            <linearGradient id="stats-g" x1="0" x2="1">
              <stop stopColor="#8ab4f8" />
              <stop offset="1" stopColor="#1a73e8" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-x-0 bottom-0 text-center text-xs font-medium text-fg-2">%{Math.round(ratio * 100)}</span>
      </div>
      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-container px-2 py-0.5 text-[11px] font-medium text-success">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Canlı
        </span>
        <p className="mt-1.5 text-sm text-fg-2">Toplam dönüştürülen dosya</p>
        <p
          key={bump}
          className="text-3xl font-medium tracking-tight text-fg tabular-nums motion-safe:animate-[stats-pop_400ms_ease-out]"
          aria-live="polite"
        >
          {shown == null ? <span className="inline-block h-8 w-36 animate-pulse rounded-lg bg-surface-2 align-middle" /> : fmt.format(value)}
        </p>
        <p className="mt-0.5 text-xs text-fg-2">Sonraki hedef: {fmt.format(goal)} dosya</p>
      </div>
    </div>
  );
}
