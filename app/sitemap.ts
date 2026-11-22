import type { MetadataRoute } from 'next';

const BASE = 'https://lux-convert.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/donustur', '/sikistir', '/kirp', '/sss', '/iletisim', '/hakkimizda', '/gizlilik'].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
