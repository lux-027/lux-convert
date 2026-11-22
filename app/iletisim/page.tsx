import { Mail } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import ContactForm from '@/components/ContactForm';
import { ContactArt } from '@/components/Illustrations';
import { PageHero } from '@/components/ToolHero';

export const metadata = pageMetadata('/iletisim', 'İletişim', 'Lux Convert ekibine öneri, hata bildirimi veya iş birliği için ulaşın.');

export default function Page() {
  return (
    <div className="pb-4">
      <PageHero
        badge="İletişim"
        icon={Mail}
        title="Bize ulaşın"
        subtitle="Öneri, hata bildirimi veya iş birliği için bize yazın. Her mesajı okuyoruz."
        chips={['1–2 iş günü içinde yanıt', 'Türkçe destek']}
        art={ContactArt}
        bg="from-[#e8f0fe] via-[#eef3fd] to-[#e6f4ea]"
        tone="text-[#1a73e8]"
      />
      <div className="mx-auto mt-10 max-w-5xl">
        <ContactForm />
      </div>
    </div>
  );
}
