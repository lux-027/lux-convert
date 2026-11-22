import Link from 'next/link';
import { CircleHelp, Crop, House, Info, Lock, Mail, Minimize2, RefreshCw, Shield } from 'lucide-react';
import { CONTACT_EMAIL, mailto } from '@/lib/contact';
import Logo from './Logo';
import StatsCounter from './StatsCounter';

const COLUMNS = [
  {
    title: 'Araçlar',
    links: [
      { href: '/donustur', label: 'Dönüştür', icon: RefreshCw },
      { href: '/sikistir', label: 'Sıkıştır', icon: Minimize2 },
      { href: '/kirp', label: 'Kırp', icon: Crop },
    ],
  },
  {
    title: 'Lux Convert',
    links: [
      { href: '/', label: 'Ana sayfa', icon: House },
      { href: '/sss', label: 'SSS', icon: CircleHelp },
      { href: '/iletisim', label: 'İletişim', icon: Mail },
      { href: '/hakkimizda', label: 'Hakkımızda', icon: Info },
      { href: '/gizlilik', label: 'Gizlilik', icon: Shield },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1.2fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Görüntü, ses, video ve belgeleri tarayıcınızda ücretsiz dönüştürün, sıkıştırın ve kırpın.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 text-xs text-white/75 ring-1 ring-white/10">
            <Lock className="h-3.5 w-3.5 text-[#81c995]" />
            Dosyalarınız cihazınızdan çıkmaz
          </p>
          <a href={mailto()} className="mt-4 flex w-fit items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
            <Mail className="h-4 w-4 text-white/45" />
            {CONTACT_EMAIL}
          </a>
        </div>
        <StatsCounter />
        <div className="grid grid-cols-2 gap-6">
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-sm font-medium text-white">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                      <l.icon className="h-4 w-4 text-white/45 transition-colors group-hover:text-white" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-white/55 sm:flex-row sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Lux Convert. Tüm hakları saklıdır.</span>
          <span>Tüm işlemler tarayıcınızda yapılır.</span>
        </div>
      </div>
    </footer>
  );
}
