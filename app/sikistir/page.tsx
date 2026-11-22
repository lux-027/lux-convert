import { pageMetadata } from '@/lib/seo';
import Compressor from '@/components/Compressor';
import { ToolExtras, ToolHero } from '@/components/ToolHero';

export const metadata = pageMetadata('/sikistir', 'Dosya Sıkıştır', 'Görüntü, PDF, ses ve video dosyalarının boyutunu tarayıcınızda ücretsiz küçültün.');

export default function Page() {
  return (
    <>
      <ToolHero tool="compress" title="Dosya boyutunu küçültün" subtitle="Görüntü, PDF, ses ve video dosyalarını kaliteyi koruyarak sıkıştırın." chips={['3 seviye + özel ayar', 'Anlık hedef boyut', 'Toplu sıkıştırma']} />
      <section className="mx-auto mt-8 max-w-4xl">
        <Compressor />
      </section>
      <ToolExtras tool="compress" />
    </>
  );
}
