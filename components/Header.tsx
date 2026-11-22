'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CircleHelp, Crop, House, Menu, Minimize2, RefreshCw, X } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Ana sayfa', icon: House },
  { href: '/donustur', label: 'Dönüştür', icon: RefreshCw },
  { href: '/sikistir', label: 'Sıkıştır', icon: Minimize2 },
  { href: '/kirp', label: 'Kırp', icon: Crop },
  { href: '/sss', label: 'SSS', icon: CircleHelp },
];

export default function Header() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  return (
    <header className="sticky top-0 z-40 bg-ink shadow-[0_2px_10px_rgb(0_0_0/0.18)]">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] px-4 sm:px-6">
        <Logo dark />
        <nav className="hidden items-center gap-1 rounded-full bg-white/[0.07] p-1 ring-1 ring-white/10 md:flex" aria-label="Ana menü">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium transition-all',
                pathname === item.href
                  ? 'bg-white text-ink shadow-[0_1px_3px_rgb(0_0_0/0.3)]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-self-end">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-white/80 hover:bg-white/10 md:hidden"
            onClick={() => setOpenFor(open ? null : pathname)}
            aria-label="Menü"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-white/10 px-4 py-2 md:hidden" aria-label="Mobil menü">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-medium',
                pathname === item.href ? 'bg-white text-ink' : 'text-white/80'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
