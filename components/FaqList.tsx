'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, X } from 'lucide-react';
import { FAQ_GROUPS } from '@/lib/faq';
import { cn } from '@/lib/utils';

const norm = (s: string) => s.toLocaleLowerCase('tr-TR');

export default function FaqList() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');

  const groups = useMemo(() => {
    const q = norm(query.trim());
    return FAQ_GROUPS.filter((g) => group === 'all' || g.id === group)
      .map((g) => ({ ...g, items: g.items.filter((i) => !q || norm(i.q).includes(q) || norm(i.a).includes(q)) }))
      .filter((g) => g.items.length);
  }, [query, group]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-fg-2" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Soru ara…"
          aria-label="Soru ara"
          className="h-12 w-full rounded-full border border-line bg-white pr-11 pl-11 text-[15px] text-fg shadow-[0_1px_3px_rgb(60_64_67/0.08)] outline-none placeholder:text-fg-2 focus:border-primary focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Aramayı temizle"
            className="absolute top-1/2 right-3 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-fg-2 hover:bg-surface-2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Kategoriler">
        {[{ id: 'all', title: 'Tümü' }, ...FAQ_GROUPS].map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={group === g.id}
            onClick={() => setGroup(g.id)}
            className={cn(
              'h-8 rounded-full border px-3.5 text-[13px] font-medium transition-colors',
              group === g.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-fg-2 hover:bg-surface-2 hover:text-fg'
            )}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {groups.map((g) => (
          <section key={g.id} data-appear>
            <h2 className="mb-3 px-1 text-xs font-medium tracking-wider text-fg-2 uppercase">{g.title}</h2>
            <div className="divide-y divide-line rounded-3xl border border-line bg-white">
              {g.items.map((f) => (
                <details key={f.q} className="group px-6 py-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-fg">
                    {f.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-fg-2 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-2">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        {!groups.length && (
          <p className="rounded-3xl border border-dashed border-line bg-white px-6 py-10 text-center text-sm text-fg-2">
            “{query}” için sonuç bulunamadı.
          </p>
        )}
      </div>

      <div className="mt-14 flex flex-col items-center gap-3 rounded-3xl bg-ink px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-medium text-white">Aradığınızı bulamadınız mı?</p>
          <p className="mt-1 text-sm text-white/70">Araçları deneyin ya da bizim hakkımızda daha fazlasını okuyun.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/hakkimizda" className="inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-white/85 ring-1 ring-white/20 hover:bg-white/10">
            Hakkımızda
          </Link>
          <Link href="/donustur" className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm font-medium text-ink hover:shadow-lg">
            Dönüştür
          </Link>
        </div>
      </div>
    </div>
  );
}
