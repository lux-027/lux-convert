import Link from 'next/link';
import { ArrowRight, Crop, Gauge, Heart, Info, Lock, Mail, Minimize2, RefreshCw, Sparkles, type LucideIcon } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { AboutArt } from '@/components/Illustrations';
import { PageHero } from '@/components/ToolHero';
import { CONTACT_EMAIL, mailto } from '@/lib/contact';

export const metadata = pageMetadata('/hakkimizda', 'Hakkımızda', 'Lux Convert, dosyalarınızı tarayıcınızda güvenle dönüştüren ücretsiz bir araçtır.');

const VALUES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Lock, title: 'Önce gizlilik', text: 'Dosyalarınız hiçbir sunucuya yüklenmez. Tüm işlem tarayıcınızda yapılır.' },
  { icon: Gauge, title: 'Hız', text: 'Yükleme ve bekleme sırası yok. İşlem cihazınızın gücüyle anında başlar.' },
  { icon: Sparkles, title: 'Sadelik', text: 'Gereksiz adım, reklam kalabalığı veya kayıt zorunluluğu yok.' },
  { icon: Heart, title: 'Ücretsiz', text: 'Tüm araçlar ücretsizdir; çıktılara filigran eklenmez.' },
];

const TOOLS: { href: string; icon: LucideIcon; title: string; text: string; tone: string }[] = [
  { href: '/donustur', icon: RefreshCw, title: 'Dönüştür', text: 'Görüntü, ses, video ve belgeleri onlarca biçim arasında çevirin.', tone: 'bg-[#e8f0fe] text-[#1a73e8]' },
  { href: '/sikistir', icon: Minimize2, title: 'Sıkıştır', text: 'Görüntü, PDF, ses ve video boyutunu hedef boyuta göre küçültün.', tone: 'bg-[#e6f4ea] text-[#188038]' },
  { href: '/kirp', icon: Crop, title: 'Kırp', text: 'Görüntüleri oranla kırpın, döndürün ve çevirin.', tone: 'bg-[#fef7e0] text-[#e37400]' },
];

export default function Page() {
  return (
    <div className="pb-4">
      <PageHero
        badge="Hakkımızda"
        icon={Info}
        title="Dosyalarınız için sade ve güvenli bir araç"
        subtitle="Lux Convert, görüntü, ses, video ve belgeleri tarayıcınızda dönüştürmek için geliştirilmiş ücretsiz bir web aracıdır."
        chips={['Sunucuya yükleme yok', 'Kayıt gerekmez', 'Filigransız']}
        art={AboutArt}
        bg="from-[#e8f0fe] via-[#f4f1fb] to-[#fce8e6]"
        tone="text-[#1a73e8]"
      />

      <section className="mx-auto mt-16 max-w-5xl">
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-fg sm:text-[28px]">Neden Lux Convert?</h2>
          </div>
          <div className="space-y-4 text-[15px] leading-7 text-fg-2">
            <p>
              Çoğu çevrimiçi dönüştürücü dosyalarınızı kendi sunucularına yükler, sırada bekletir ve bir süre saklar. Biz farklı bir yol seçtik:
              <span className="font-medium text-fg"> tüm işlemleri doğrudan tarayıcınızda yapıyoruz.</span>
            </p>
            <p>Böylece dosyalarınız cihazınızdan çıkmaz, internet hızınız işlem süresini etkilemez ve kimse dosyalarınızı göremez.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-5xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-3xl border border-line bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">
                <v.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-medium text-fg">{v.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-center text-2xl font-medium tracking-tight text-fg sm:text-[28px]">Neler yapabilirsiniz?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="group rounded-3xl border border-line bg-white p-6 transition-shadow hover:shadow-card">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${t.tone}`}>
                <t.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-medium text-fg">{t.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{t.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Aracı aç
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <div className="flex flex-col items-center gap-4 rounded-[32px] bg-ink px-6 py-10 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
          <div>
            <p className="text-lg font-medium text-white">Bir öneriniz mi var?</p>
            <p className="mt-1 text-sm text-white/70">
              <a href={mailto()} className="hover:underline">{CONTACT_EMAIL}</a> adresine yazın; her mesajı okuyoruz.
            </p>
          </div>
          <Link href="/iletisim" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-ink hover:shadow-lg">
            <Mail className="h-4 w-4" />
            İletişime geç
          </Link>
        </div>
      </section>
    </div>
  );
}
