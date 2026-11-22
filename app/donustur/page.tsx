import type { Metadata } from 'next';
import Converter from '@/components/Converter';
import { PageTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Dosya Dönüştür',
  description: 'Görüntü, ses, video ve belgeleri tarayıcınızda ücretsiz dönüştürün.',
  alternates: { canonical: '/donustur' },
};

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
