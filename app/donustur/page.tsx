import { pageMetadata } from '@/lib/seo';
import Converter from '@/components/Converter';
import { ToolExtras, ToolHero } from '@/components/ToolHero';

export const metadata = pageMetadata('/donustur', 'Dosya Dönüştür', 'Görüntü, ses, video ve belgeleri tarayıcınızda ücretsiz dönüştürün.');

export default function Page() {
  return (
    <>
      <ToolHero tool="convert" title="Dosya dönüştürün" subtitle="Görüntü, ses, video ve belgeleri birkaç tıkla istediğiniz biçime çevirin." chips={['40+ biçim', 'Toplu dönüştürme', 'ZIP indirme']} />
      <section className="mx-auto mt-8 max-w-4xl">
        <Converter />
      </section>
      <ToolExtras tool="convert" />
    </>
  );
}
