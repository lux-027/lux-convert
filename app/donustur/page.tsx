import { pageMetadata } from '@/lib/seo';
import Converter from '@/components/Converter';
import { PageTitle } from '@/components/ui';

export const metadata = pageMetadata('/donustur', 'Dosya Dönüştür', 'Görüntü, ses, video ve belgeleri tarayıcınızda ücretsiz dönüştürün.');

export default function Page() {
  return (
    <>
      <PageTitle title="Dosya dönüştürün" subtitle="Görüntü, ses, video ve belgeleri istediğiniz biçime çevirin." />
      <section className="mx-auto max-w-4xl">
        <Converter />
      </section>
    </>
  );
}
