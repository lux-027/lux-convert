import type { Metadata } from 'next';
import Compressor from '@/components/Compressor';
import { PageTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Dosya Sıkıştır',
  description: 'Görüntü, PDF, ses ve video dosyalarının boyutunu tarayıcınızda ücretsiz küçültün.',
  alternates: { canonical: '/sikistir' },
};

export default function Page() {
  return (
    <>
      <PageTitle title="Dosya boyutunu küçültün" subtitle="Görüntü, PDF, ses ve video dosyalarını kaliteyi koruyarak sıkıştırın." />
      <section className="mx-auto max-w-4xl">
        <Compressor />
      </section>
    </>
  );
}
