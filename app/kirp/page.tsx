import type { Metadata } from 'next';
import Cropper from '@/components/Cropper';
import { PageTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Görüntü Kırp',
  description: 'Görüntülerinizi istediğiniz oranda kırpın, döndürün ve çevirin. Ücretsiz ve tarayıcıda.',
  alternates: { canonical: '/kirp' },
};

export default function Page() {
  return (
    <>
      <PageTitle title="Görüntü kırpın" subtitle="Oran seçin, döndürün, çevirin ve istediğiniz biçimde indirin." />
      <section className="mx-auto max-w-5xl">
        <Cropper />
      </section>
    </>
  );
}
