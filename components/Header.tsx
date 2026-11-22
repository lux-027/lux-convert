'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/donustur', label: 'Dönüştür' },
  { href: '/sikistir', label: 'Sıkıştır' },
  { href: '/kirp', label: 'Kırp' },
];

export default function Header() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Ana menü">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-fg-2 hover:bg-surface-2 hover:text-fg'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link
            href="/donustur"
            className="hidden h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-on-primary transition-all hover:bg-primary-hover hover:shadow-card sm:inline-flex"
          >
            Hemen başla
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-fg-2 hover:bg-surface-2 sm:hidden"
            onClick={() => setOpenFor(open ? null : pathname)}
            aria-label="Menü"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line px-4 py-2 sm:hidden" aria-label="Mobil menü">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-full px-4 py-2.5 text-sm font-medium',
                pathname === item.href ? 'bg-primary-container text-on-primary-container' : 'text-fg'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
