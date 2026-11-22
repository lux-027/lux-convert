import type { Metadata } from 'next';

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Lux Convert`, description, url: path, siteName: 'Lux Convert', locale: 'tr_TR', type: 'website' },
  };
}
