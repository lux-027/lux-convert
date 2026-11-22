import Link from 'next/link';
import { ArrowRight, Crop, FileText, Film, Image as ImageIcon, Lock, Minimize2, Music, Zap, BadgeCheck } from 'lucide-react';
import Converter from '@/components/Converter';
import { PageTitle } from '@/components/ui';

const FORMATS = [
  { icon: ImageIcon, title: 'Görüntü', items: 'JPG, PNG, WEBP, AVIF, GIF, BMP, ICO, SVG → PDF dahil' },
  { icon: Music, title: 'Ses', items: 'MP3, WAV, OGG, FLAC, M4A, AAC, OPUS, WMA' },
  { icon: Film, title: 'Video', items: 'MP4, WEBM, MOV, MKV, AVI, GIF ve videodan MP3' },
  { icon: FileText, title: 'Belge', items: 'PDF → JPG/PNG/TXT, DOCX → PDF, TXT → PDF, CSV ↔ JSON' },
];

const FEATURES = [
  { icon: Lock, title: 'Gizli', text: 'Dosyalarınız hiçbir sunucuya yüklenmez. Tüm işlemler tarayıcınızda yapılır.' },
  { icon: Zap, title: 'Hızlı', text: 'Bekleme sırası yok. Dönüştürme cihazınızın gücüyle anında başlar.' },
  { icon: BadgeCheck, title: 'Ücretsiz', text: 'Kayıt, filigran veya gizli ücret yok. Sınırsız kullanın.' },
];

const TOOLS = [
  { href: '/sikistir', icon: Minimize2, title: 'Dosya sıkıştır', text: 'Görüntü, PDF, ses ve video boyutunu küçültün.' },
  { href: '/kirp', icon: Crop, title: 'Görüntü kırp', text: 'Oran seçin, döndürün, çevirin ve kırpın.' },
];

export default function Home() {
  return (
    <>
      <PageTitle title="Her dosyayı saniyeler içinde dönüştürün" subtitle="Görüntü, ses, video ve belgeler için ücretsiz ve gizli dönüştürücü." />
      <section className="mx-auto max-w-4xl">
        <Converter />
      </section>

      <section className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex items-center gap-4 rounded-2xl border border-line p-5 transition-colors hover:bg-surface"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
              <t.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-fg">{t.title}</p>
              <p className="text-sm text-fg-2">{t.text}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-fg-2 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="text-center text-2xl font-normal text-fg">Desteklenen biçimler</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {FORMATS.map((f) => (
            <div key={f.title} className="rounded-2xl bg-surface p-5">
              <div className="flex items-center gap-2 text-fg">
                <f.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{f.title}</span>
              </div>
              <p className="mt-2 text-sm text-fg-2">{f.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-4xl gap-8 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="text-center">
            <f.icon className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 font-medium text-fg">{f.title}</p>
            <p className="mt-1 text-sm text-fg-2">{f.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
