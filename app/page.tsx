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
import { CompressArt, ConvertArt, CropArt, HeroIllustration } from '@/components/Illustrations';

const TOOLS = [
  {
    href: '/donustur',
    icon: RefreshCw,
    title: 'Dönüştür',
    text: 'Görüntü, ses, video ve belgeleri 40’tan fazla biçime çevirin.',
    tone: 'bg-[#e8f0fe] text-[#1a73e8]',
    art: ConvertArt,
    bg: 'from-[#e8f0fe] to-[#f3e8fd]',
    points: ['Toplu dönüştürme', 'ZIP olarak indir', 'Video → MP3 / GIF'],
  },
  {
    href: '/sikistir',
    icon: Minimize2,
    title: 'Sıkıştır',
    text: 'Görüntü, PDF, ses ve video boyutunu kaliteyi koruyarak küçültün.',
    tone: 'bg-[#e6f4ea] text-[#188038]',
    art: CompressArt,
    bg: 'from-[#e6f4ea] to-[#e8f0fe]',
    points: ['3 sıkıştırma seviyesi', 'Boyut karşılaştırması', 'Büyürse orijinal korunur'],
  },
  {
    href: '/kirp',
    icon: Crop,
    title: 'Kırp',
    text: 'Hazır oranlarla kırpın, döndürün ve çevirin.',
    tone: 'bg-[#fef7e0] text-[#e37400]',
    art: CropArt,
    bg: 'from-[#fef7e0] to-[#fce8e6]',
    points: ['1:1, 16:9, 9:16 ve daha fazlası', 'Döndür ve çevir', 'PNG, JPG, WEBP çıktı'],
  },
];

const FORMATS = [
  { icon: ImageIcon, title: 'Görüntü', items: ['JPG', 'PNG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'ICO', 'SVG'], tone: 'text-[#1a73e8]', grad: 'bg-[#e8f0fe] text-[#1a73e8]' },
  { icon: Music, title: 'Ses', items: ['MP3', 'WAV', 'OGG', 'FLAC', 'M4A', 'AAC', 'OPUS'], tone: 'text-[#d93025]', grad: 'bg-[#fce8e6] text-[#d93025]' },
  { icon: Film, title: 'Video', items: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI', 'GIF'], tone: 'text-[#e37400]', grad: 'bg-[#fef7e0] text-[#e37400]' },
  { icon: FileText, title: 'Belge', items: ['PDF', 'DOCX', 'TXT', 'HTML', 'CSV', 'JSON'], tone: 'text-[#188038]', grad: 'bg-[#e6f4ea] text-[#188038]' },
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

export default function Home() {
  return (
    <>
      <section className="grid items-center gap-12 pt-14 pb-8 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-fg-2">
            <Lock className="h-3.5 w-3.5 text-primary" />
            Dosyalarınız cihazınızdan çıkmaz
          </span>
          <h1 className="mt-5 text-4xl leading-[1.12] font-medium tracking-tight text-fg sm:text-[52px]">
            Her dosya için <span className="bg-gradient-to-r from-[#1a73e8] to-[#0b57d0] bg-clip-text text-transparent">tek bir araç</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[17px] leading-relaxed text-fg-2 lg:mx-0">
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
        <HeroIllustration className="mx-auto w-full max-w-[480px]" />
      </section>

      <section id="araclar" className="scroll-mt-24 pt-20">
        <div className="text-center">
          <h2 className="text-[28px] font-medium tracking-tight text-fg sm:text-[34px]">İhtiyacınız olan her şey</h2>
          <p className="mt-2 text-[15px] text-fg-2">Bir araç seçin ve hemen başlayın.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_12px_40px_rgb(60_64_67/0.18)]"
            >
              <div className={`relative grid h-44 place-items-center bg-gradient-to-br ${t.bg}`}>
                <t.art className="h-32 w-auto transition-transform duration-300 group-hover:scale-105" />
                <div className={`absolute top-4 left-4 grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ${t.tone.split(' ')[1]}`}>
                  <t.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xl font-medium text-fg">{t.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">{t.text}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {t.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-fg">
                      <Check className="h-4 w-4 shrink-0 text-success" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary-container text-sm font-medium text-on-primary-container transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  {t.title} aracını aç
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-24">
        <div className="text-center">
          <h2 className="text-[28px] font-medium tracking-tight text-fg sm:text-[34px]">Desteklenen biçimler</h2>
          <p className="mt-2 text-[15px] text-fg-2">Görüntüden videoya, belgeden sese kadar.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map((f) => (
            <div key={f.title} className="rounded-3xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgb(60_64_67/0.14)]">
              <div className="flex items-center gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${f.grad}`}>
                  <f.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-[17px] font-medium text-fg">{f.title}</p>
                  <p className="text-xs text-fg-2">{f.items.length} biçim</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {f.items.map((i) => (
                  <span key={i} className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-fg ring-1 ring-line">
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
          <h2 className="text-[28px] font-medium tracking-tight text-fg sm:text-[34px]">Üç adımda hazır</h2>
          <p className="mt-2 text-[15px] text-fg-2">Kurulum yok, hesap yok.</p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl border border-line p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-medium text-on-primary">{i + 1}</span>
                <s.icon className="h-5 w-5 text-fg-2" />
              </div>
              <p className="mt-5 font-medium text-fg">{s.title}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">{s.text}</p>
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
              <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl pt-24">
        <h2 className="text-center text-[28px] font-medium tracking-tight text-fg sm:text-[34px]">Sık sorulan sorular</h2>
        <div className="mt-8 divide-y divide-line rounded-3xl border border-line">
          {FAQ.map((f) => (
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
