import Link from 'next/link';
import { Lock } from 'lucide-react';
import Logo from './Logo';
import StatsCounter from './StatsCounter';

const COLUMNS = [
  {
    title: 'Araçlar',
    links: [
      { href: '/donustur', label: 'Dönüştür' },
      { href: '/sikistir', label: 'Sıkıştır' },
      { href: '/kirp', label: 'Kırp' },
    ],
  },
  {
    title: 'Lux Convert',
    links: [
      { href: '/', label: 'Ana sayfa' },
      { href: '/hakkimizda', label: 'Hakkımızda' },
      { href: '/gizlilik', label: 'Gizlilik' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1.2fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-2">
            Görüntü, ses, video ve belgeleri tarayıcınızda ücretsiz dönüştürün, sıkıştırın ve kırpın.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-fg-2 ring-1 ring-line">
            <Lock className="h-3.5 w-3.5 text-success" />
            Dosyalarınız cihazınızdan çıkmaz
          </p>
        </div>
        <StatsCounter />
        <div className="grid grid-cols-2 gap-6">
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-sm font-medium text-fg">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-fg-2 transition-colors hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-fg-2 sm:flex-row sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Lux Convert. Tüm hakları saklıdır.</span>
          <span>Tüm işlemler tarayıcınızda yapılır.</span>
        </div>
      </div>
    </footer>
  );
}
