import { pageMetadata } from '@/lib/seo';
import Cropper from '@/components/Cropper';
import { ToolExtras, ToolHero } from '@/components/ToolHero';

export const metadata = pageMetadata('/kirp', 'Görüntü Kırp', 'Görüntülerinizi istediğiniz oranda kırpın, döndürün ve çevirin. Ücretsiz ve tarayıcıda.');

export default function Page() {
  return (
    <>
      <ToolHero tool="crop" title="Görüntü kırpın" subtitle="Oran seçin, döndürün, çevirin ve istediğiniz biçimde indirin." chips={['Hazır oranlar', 'Döndür ve çevir', 'PNG, JPG, WEBP']} />
      <section className="mx-auto mt-8 max-w-5xl">
        <Cropper />
      </section>
      <ToolExtras tool="crop" />
    </>
  );
}
