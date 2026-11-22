import { pageMetadata } from '@/lib/seo';
import { FAQ_GROUPS } from '@/lib/faq';
import { CircleHelp } from 'lucide-react';
import FaqList from '@/components/FaqList';
import { FaqArt } from '@/components/Illustrations';
import { PageHero } from '@/components/ToolHero';

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
    <div className="pb-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        badge="Yardım merkezi"
        icon={CircleHelp}
        title="Sık sorulan sorular"
        subtitle="Dönüştürme, sıkıştırma, kırpma ve gizlilik hakkında merak ettikleriniz."
        chips={['20+ yanıt', 'Kategorili', 'Anında arama']}
        art={FaqArt}
        bg="from-[#f3e8fd] via-[#f4f0fd] to-[#e8f0fe]"
        tone="text-[#9334e6]"
      />
      <div className="mt-10">
        <FaqList />
      </div>
    </div>
  );
}
