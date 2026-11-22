import { pageMetadata } from '@/lib/seo';
import { FAQ_GROUPS } from '@/lib/faq';
import FaqList from '@/components/FaqList';

export const metadata = pageMetadata(
  '/sss',
  'Sık sorulan sorular',
  'Lux Convert ile dosya dönüştürme, sıkıştırma, kırpma ve gizlilik hakkında sık sorulan sorular.'
);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Page() {
  return (
    <div className="pt-14 pb-4 sm:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 text-center">
        <span className="inline-flex rounded-full border border-line bg-white px-3 py-1 text-xs text-fg-2">Yardım merkezi</span>
        <h1 className="mt-4 text-[32px] font-medium tracking-tight text-fg sm:text-[40px]">Sık sorulan sorular</h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-fg-2">
          Dönüştürme, sıkıştırma, kırpma ve gizlilik hakkında merak ettikleriniz.
        </p>
      </div>
      <FaqList />
    </div>
  );
}
