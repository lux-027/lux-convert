import Link from 'next/link';
import { LogoMark } from './Logo';

const LINKS = [
  { href: '/donustur', label: 'Dönüştür' },
  { href: '/sikistir', label: 'Sıkıştır' },
  { href: '/kirp', label: 'Kırp' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/gizlilik', label: 'Gizlilik' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-fg-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <LogoMark size={20} />
          <span>© {new Date().getFullYear()} Lux Convert</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Alt menü">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
