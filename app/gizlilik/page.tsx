import Link from 'next/link';
import { BarChart3, Cookie, Globe, HardDrive, MonitorSmartphone, ShieldCheck, Trash2, type LucideIcon } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { PrivacyArt } from '@/components/Illustrations';
import { PageHero } from '@/components/ToolHero';

export const metadata = pageMetadata('/gizlilik', 'Gizlilik ve Güvenlik', 'Lux Convert dosyalarınızı sunucuya yüklemez; tüm işlemler tarayıcınızda yapılır.');

const PRINCIPLES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: MonitorSmartphone, title: 'Cihazınızda işlenir', text: 'Dönüştürme, sıkıştırma ve kırpma tamamen tarayıcınızda yapılır.' },
  { icon: HardDrive, title: 'Saklanmaz', text: 'Dosya içerikleri hiçbir yere kaydedilmez, paylaşılmaz veya analiz edilmez.' },
  { icon: Trash2, title: 'Kapatınca silinir', text: 'Sekmeyi kapattığınızda veya listeyi temizlediğinizde dosyalar bellekten silinir.' },
];

const DETAILS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Globe,
    title: 'Harici kaynaklar',
    text: 'Ses ve video işlemleri için gereken dönüştürme motoru (FFmpeg) ilk kullanımda herkese açık bir içerik dağıtım ağından (jsDelivr) indirilir. Bu sırada dosyalarınız gönderilmez.',
  },
  {
    icon: BarChart3,
    title: 'Toplam dosya sayacı',
    text: 'Alt bardaki sayaç için yalnızca başarılı işlem sayısı anonim olarak gönderilir. Dosya adı, içeriği veya kişisel bilgi gönderilmez.',
  },
  {
    icon: Cookie,
    title: 'Çerezler',
    text: 'Takip veya reklam çerezi kullanılmaz. Hesap ya da kayıt sistemi yoktur.',
  },
];

export default function Page() {
  return (
    <div className="pb-4">
      <PageHero
        badge="Gizlilik ve güvenlik"
        icon={ShieldCheck}
        title="Dosyalarınız cihazınızdan çıkmaz"
        subtitle="Lux Convert dosyalarınızı hiçbir sunucuya yüklemez. Tüm işlemler tarayıcınızın içinde gerçekleşir."
        chips={['Sunucuya yükleme yok', 'Takip çerezi yok', 'Kayıt yok']}
        art={PrivacyArt}
        bg="from-[#e6f4ea] via-[#eef6f1] to-[#e8f0fe]"
        tone="text-[#188038]"
      />

      <section className="mx-auto mt-14 max-w-5xl">
        <div className="grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-3xl border border-line bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f4ea] text-[#188038]">
                <p.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-medium text-fg">{p.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-3xl">
        <h2 className="text-center text-2xl font-medium tracking-tight text-fg sm:text-[28px]">Ayrıntılar</h2>
        <div data-stagger className="mt-8 divide-y divide-line rounded-3xl border border-line bg-white">
          {DETAILS.map((d) => (
            <div key={d.title} className="flex gap-4 p-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-fg">
                <d.icon className="h-[18px] w-[18px]" />
              </span>
              <div>
                <p className="font-medium text-fg">{d.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-2">{d.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-fg-2">
          Sorularınız için{' '}
          <Link href="/iletisim" className="font-medium text-primary hover:underline">
            iletişim sayfasını
          </Link>{' '}
          kullanabilirsiniz.
        </p>
      </section>
    </div>
  );
}
