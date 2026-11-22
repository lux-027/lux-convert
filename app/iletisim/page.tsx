import { pageMetadata } from '@/lib/seo';
import ContactForm from '@/components/ContactForm';

export const metadata = pageMetadata('/iletisim', 'İletişim', 'Lux Convert ekibine öneri, hata bildirimi veya iş birliği için ulaşın.');

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl pt-14 pb-4 sm:pt-20">
      <div data-stagger className="mb-10 text-center">
        <span className="inline-flex rounded-full border border-line bg-white px-3 py-1 text-xs text-fg-2">İletişim</span>
        <h1 className="mt-4 text-[32px] font-medium tracking-tight text-fg sm:text-[40px]">Bize ulaşın</h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-fg-2">
          Öneri, hata bildirimi veya iş birliği için bize yazın. Her mesajı okuyoruz.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
