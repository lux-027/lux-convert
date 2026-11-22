import Link from 'next/link';
import { ArrowRight, Check, Crop, Lock, Minimize2, RefreshCw, Zap, type LucideIcon } from 'lucide-react';
import { CompressArt, ConvertArt, CropArt } from './Illustrations';
import { cn } from '@/lib/utils';

type ToolId = 'convert' | 'compress' | 'crop';

const TOOLS: Record<ToolId, { href: string; name: string; text: string; icon: LucideIcon; art: typeof ConvertArt; bg: string; tone: string }> = {
  convert: {
    href: '/donustur',
    name: 'Dönüştür',
    text: 'Görüntü, ses, video ve belgeleri istediğiniz biçime çevirin.',
    icon: RefreshCw,
    art: ConvertArt,
    bg: 'from-[#e8f0fe] via-[#f1f5fe] to-[#f3e8fd]',
    tone: 'text-[#1a73e8]',
  },
  compress: {
    href: '/sikistir',
    name: 'Sıkıştır',
    text: 'Görüntü, PDF, ses ve video boyutunu küçültün.',
    icon: Minimize2,
    art: CompressArt,
    bg: 'from-[#e6f4ea] via-[#eef6f6] to-[#e8f0fe]',
    tone: 'text-[#188038]',
  },
  crop: {
    href: '/kirp',
    name: 'Kırp',
    text: 'Görüntüleri oranla kırpın, döndürün ve çevirin.',
    icon: Crop,
    art: CropArt,
    bg: 'from-[#fef7e0] via-[#fef3ea] to-[#fce8e6]',
    tone: 'text-[#e37400]',
  },
};

export function ToolHero({ tool, title, subtitle, chips }: { tool: ToolId; title: string; subtitle: string; chips: string[] }) {
  const t = TOOLS[tool];
  return (
    <section className={cn('mt-6 overflow-hidden rounded-[32px] bg-gradient-to-br', t.bg)}>
      <div className="grid items-center gap-4 px-6 py-8 sm:px-10 md:grid-cols-[1fr_auto] md:py-10">
        <div className="text-center md:text-left">
          <span className={cn('inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm', t.tone)}>
            <t.icon className="h-3.5 w-3.5" />
            {t.name}
          </span>
          <h1 className="mt-4 text-3xl font-medium tracking-tight text-fg sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-fg-2 md:mx-0">{subtitle}</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-fg md:justify-start">
            {chips.map((c) => (
              <li key={c} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <t.art className="mx-auto hidden h-44 w-auto drop-shadow-sm sm:block md:h-52" />
      </div>
    </section>
  );
}

const TIPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Lock, title: 'Dosyalarınız sizde kalır', text: 'Hiçbir dosya sunucuya yüklenmez, işlem tarayıcınızda yapılır.' },
  { icon: Zap, title: 'Bekleme yok', text: 'Sıra veya yükleme süresi olmadan işlem hemen başlar.' },
  { icon: Check, title: 'Ücretsiz ve filigransız', text: 'Kayıt gerekmez, çıktılara filigran eklenmez.' },
];

export function ToolExtras({ tool }: { tool: ToolId }) {
  const others = (Object.keys(TOOLS) as ToolId[]).filter((k) => k !== tool).map((k) => TOOLS[k]);
  return (
    <div className="mx-auto mt-14 max-w-5xl space-y-12">
      <div className="grid gap-4 sm:grid-cols-3">
        {TIPS.map((tip) => (
          <div key={tip.title} className="flex gap-3 rounded-2xl border border-line bg-white p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-container text-on-primary-container">
              <tip.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[15px] font-medium text-fg">{tip.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-fg-2">{tip.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-medium text-fg">Diğer araçlar</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {others.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="group flex items-center gap-4 overflow-hidden rounded-3xl border border-line bg-white pr-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(60_64_67/0.15)]"
            >
              <div className={cn('grid h-28 w-36 shrink-0 place-items-center bg-gradient-to-br', o.bg)}>
                <o.art className="h-24 w-auto transition-transform group-hover:scale-105" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-medium text-fg">{o.name}</p>
                <p className="mt-0.5 text-sm text-fg-2">{o.text}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-fg-2 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
