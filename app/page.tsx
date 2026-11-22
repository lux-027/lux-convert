import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Crop,
  Download,
  FileText,
  Film,
  Image as ImageIcon,
  Lock,
  Minimize2,
  Music,
  RefreshCw,
  Upload,
  Zap,
} from 'lucide-react';

const TOOLS = [
  {
    href: '/donustur',
    icon: RefreshCw,
    title: 'Dönüştür',
    text: 'Görüntü, ses, video ve belgeleri 40’tan fazla biçime çevirin.',
    tone: 'bg-[#e8f0fe] text-[#1a73e8]',
  },
  {
    href: '/sikistir',
    icon: Minimize2,
    title: 'Sıkıştır',
    text: 'Görüntü, PDF, ses ve video boyutunu kaliteyi koruyarak küçültün.',
    tone: 'bg-[#e6f4ea] text-[#188038]',
  },
  {
    href: '/kirp',
    icon: Crop,
    title: 'Kırp',
    text: 'Hazır oranlarla kırpın, döndürün ve çevirin.',
    tone: 'bg-[#fef7e0] text-[#e37400]',
  },
];

const FORMATS = [
  { icon: ImageIcon, title: 'Görüntü', items: ['JPG', 'PNG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'ICO', 'SVG'], tone: 'text-[#1a73e8]' },
  { icon: Music, title: 'Ses', items: ['MP3', 'WAV', 'OGG', 'FLAC', 'M4A', 'AAC', 'OPUS'], tone: 'text-[#d93025]' },
  { icon: Film, title: 'Video', items: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI', 'GIF'], tone: 'text-[#e37400]' },
  { icon: FileText, title: 'Belge', items: ['PDF', 'DOCX', 'TXT', 'HTML', 'CSV', 'JSON'], tone: 'text-[#188038]' },
];

const POPULAR = ['PNG → JPG', 'JPG → PDF', 'WEBP → PNG', 'MP4 → MP3', 'MOV → MP4', 'WAV → MP3', 'PDF → JPG', 'DOCX → PDF', 'Video → GIF', 'CSV → JSON'];

const STEPS = [
  { icon: Upload, title: 'Dosyanızı seçin', text: 'Sürükleyip bırakın ya da cihazınızdan seçin. Aynı anda 25 dosyaya kadar.' },
  { icon: RefreshCw, title: 'Biçimi belirleyin', text: 'Her dosya için hedef biçimi seçin veya hepsine tek seferde uygulayın.' },
  { icon: Download, title: 'İndirin', text: 'Dosyaları tek tek ya da tek bir ZIP olarak anında indirin.' },
];

const FEATURES = [
  { icon: Lock, title: 'Gizli ve güvenli', text: 'Dosyalarınız hiçbir sunucuya yüklenmez. Tüm işlem tarayıcınızda yapılır.' },
  { icon: Zap, title: 'Hızlı', text: 'Yükleme ve bekleme sırası yok. İşlem cihazınızın gücüyle anında başlar.' },
  { icon: BadgeCheck, title: 'Tamamen ücretsiz', text: 'Kayıt, filigran veya gizli ücret yok. İstediğiniz kadar kullanın.' },
];

const FAQ = [
  {
    q: 'Dosyalarım bir sunucuya yükleniyor mu?',
    a: 'Hayır. Dönüştürme, sıkıştırma ve kırpma işlemlerinin tamamı tarayıcınızda yapılır. Dosyalarınız cihazınızdan çıkmaz.',
  },
  {
    q: 'Bir dosya boyutu sınırı var mı?',
    a: 'Sabit bir sınır yoktur; sınır cihazınızın belleğidir. Çok büyük videolar için masaüstü tarayıcı önerilir.',
  },
  {
    q: 'Hangi tarayıcılarda çalışır?',
    a: 'Chrome, Edge, Opera, Firefox ve Safari’nin güncel sürümlerinde çalışır.',
  },
  {
    q: 'Ses ve video dönüştürme neden ilk seferde biraz bekliyor?',
    a: 'İlk kullanımda dönüştürme motoru bir kez indirilir ve tarayıcıda önbelleğe alınır. Sonraki işlemler hemen başlar.',
  },
];

function HeroVisual() {
  const rows = [
    { name: 'tatil-fotografi.png', to: 'WEBP', size: '2,4 MB → 380 KB', icon: ImageIcon, tone: 'bg-[#e8f0fe] text-[#1a73e8]' },
    { name: 'sunum-kaydi.mov', to: 'MP4', size: '48 MB → 12 MB', icon: Film, tone: 'bg-[#fef7e0] text-[#e37400]' },
    { name: 'podcast-bolum-3.wav', to: 'MP3', size: '62 MB → 6,1 MB', icon: Music, tone: 'bg-[#fce8e6] text-[#d93025]' },
    { name: 'sozlesme.docx', to: 'PDF', size: '86 KB → 112 KB', icon: FileText, tone: 'bg-[#e6f4ea] text-[#188038]' },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-[#e8f0fe] via-white to-[#e6f4ea] blur-2xl" />
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_8px_32px_rgb(60_64_67/0.12)]">
        <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 text-xs text-fg-2">
          <span>4 dosya</span>
          <span className="inline-flex items-center gap-1 text-success">
            <Check className="h-3.5 w-3.5" /> Tamamlandı
          </span>
        </div>
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center gap-3 px-4 py-3">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${r.tone}`}>
                <r.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-fg">{r.name}</p>
                <p className="text-xs text-fg-2">{r.size}</p>
              </div>
              <span className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-fg-2">{r.to}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-container text-on-primary-container">
                <Download className="h-4 w-4" />
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end border-t border-line px-4 py-3">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-on-primary">
            <Download className="h-3.5 w-3.5" /> Tümünü indir (ZIP)
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="grid items-center gap-12 pt-14 pb-8 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-fg-2">
            <Lock className="h-3.5 w-3.5 text-primary" />
            Dosyalarınız cihazınızdan çıkmaz
          </span>
          <h1 className="mt-5 text-4xl leading-[1.15] font-normal tracking-tight text-fg sm:text-5xl">
            Her dosya için <span className="bg-gradient-to-r from-[#1a73e8] to-[#0b57d0] bg-clip-text text-transparent">tek bir araç</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-fg-2 lg:mx-0">
            Görüntü, ses, video ve belgelerinizi saniyeler içinde dönüştürün, sıkıştırın ve kırpın. Ücretsiz, kayıtsız ve tamamen gizli.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/donustur"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary transition-all hover:bg-primary-hover hover:shadow-card"
            >
              Dosya dönüştür
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#araclar"
              className="inline-flex h-10 items-center rounded-full border border-line px-6 text-sm font-medium text-primary transition-colors hover:bg-primary-container/60"
            >
              Tüm araçlar
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-fg-2 lg:justify-start">
            {['Kayıt gerekmez', 'Filigran yok', '40+ biçim'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success" />
                {t}
              </span>
            ))}
          </div>
        </div>
        <HeroVisual />
      </section>

      <section id="araclar" className="scroll-mt-24 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-normal tracking-tight text-fg sm:text-3xl">İhtiyacınız olan her şey</h2>
          <p className="mt-2 text-sm text-fg-2">Bir araç seçin ve hemen başlayın.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex flex-col rounded-3xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_4px_24px_rgb(60_64_67/0.15)]"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${t.tone}`}>
                <t.icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-lg font-medium text-fg">{t.title}</p>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-fg-2">{t.text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Aç
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-normal tracking-tight text-fg sm:text-3xl">Desteklenen biçimler</h2>
          <p className="mt-2 text-sm text-fg-2">Görüntüden videoya, belgeden sese kadar.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map((f) => (
            <div key={f.title} className="rounded-3xl bg-surface p-6">
              <div className="flex items-center gap-2">
                <f.icon className={`h-5 w-5 ${f.tone}`} />
                <span className="font-medium text-fg">{f.title}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {f.items.map((i) => (
                  <span key={i} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-fg-2 ring-1 ring-line">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {POPULAR.map((p) => (
            <Link
              key={p}
              href="/donustur"
              className="rounded-full border border-line px-3.5 py-1.5 text-sm text-fg-2 transition-colors hover:border-primary hover:text-primary"
            >
              {p}
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-normal tracking-tight text-fg sm:text-3xl">Üç adımda hazır</h2>
          <p className="mt-2 text-sm text-fg-2">Kurulum yok, hesap yok.</p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl border border-line p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-medium text-on-primary">{i + 1}</span>
                <s.icon className="h-5 w-5 text-fg-2" />
              </div>
              <p className="mt-5 font-medium text-fg">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pt-24">
        <div className="grid gap-10 rounded-[32px] bg-surface px-6 py-12 sm:px-12 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-primary ring-1 ring-line">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-medium text-fg">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-2">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl pt-24">
        <h2 className="text-center text-2xl font-normal tracking-tight text-fg sm:text-3xl">Sık sorulan sorular</h2>
        <div className="mt-8 divide-y divide-line rounded-3xl border border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-6 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-fg">
                {f.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-fg-2 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="pt-24">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1a73e8] to-[#0b57d0] px-6 py-14 text-center text-white">
          <h2 className="text-2xl font-normal tracking-tight sm:text-3xl">Dosyanızı şimdi dönüştürün</h2>
          <p className="mt-2 text-sm text-white/80">Ücretsiz, hızlı ve gizli. Kayıt gerekmez.</p>
          <Link
            href="/donustur"
            className="mt-7 inline-flex h-10 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-[#0b57d0] transition-shadow hover:shadow-lg"
          >
            Hemen başla
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
