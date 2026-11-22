'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Crop, House, Menu, Minimize2, RefreshCw, X } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Ana sayfa', icon: House },
  { href: '/donustur', label: 'Dönüştür', icon: RefreshCw },
  { href: '/sikistir', label: 'Sıkıştır', icon: Minimize2 },
  { href: '/kirp', label: 'Kırp', icon: Crop },
];

export default function Header() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 shadow-[0_1px_6px_rgb(60_64_67/0.08)] backdrop-blur">
      <div className="mx-auto grid h-[68px] max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 rounded-full bg-surface-2 p-1 md:flex" aria-label="Ana menü">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium transition-all',
                pathname === item.href
                  ? 'bg-white text-primary shadow-[0_1px_3px_rgb(60_64_67/0.2)]'
                  : 'text-fg hover:bg-white/70'
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
            className="grid h-10 w-10 place-items-center rounded-full text-fg-2 hover:bg-surface-2 md:hidden"
            onClick={() => setOpenFor(open ? null : pathname)}
            aria-label="Menü"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line px-4 py-2 md:hidden" aria-label="Mobil menü">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-medium',
                pathname === item.href ? 'bg-primary-container text-on-primary-container' : 'text-fg'
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
