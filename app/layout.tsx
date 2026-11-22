import type { Metadata, Viewport } from 'next';
import { Google_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import './globals.css';

const googleSans = Google_Sans({
  variable: '--font-google-sans',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const description =
  'Görüntü, ses, video ve belge dosyalarınızı tarayıcınızda ücretsiz dönüştürün, sıkıştırın ve kırpın. Dosyalarınız cihazınızdan hiç çıkmaz.';

export const metadata: Metadata = {
  metadataBase: new URL('https://lux-convert.vercel.app'),
  title: {
    default: 'Lux Convert | Ücretsiz Online Dosya Dönüştürücü',
    template: '%s | Lux Convert',
  },
  description,
  applicationName: 'Lux Convert',
  keywords: [
    'dosya dönüştürücü',
    'resim dönüştürücü',
    'png to jpg',
    'webp dönüştür',
    'mp3 dönüştürücü',
    'video dönüştürücü',
    'pdf dönüştür',
    'pdf sıkıştır',
    'resim sıkıştır',
    'resim kırp',
    'online converter',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Lux Convert | Ücretsiz Online Dosya Dönüştürücü',
    description,
    url: 'https://lux-convert.vercel.app',
    siteName: 'Lux Convert',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Lux Convert', description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={googleSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('motion');setTimeout(function(){d.classList.add('motion-ready')},3000)}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Lux Convert',
              url: 'https://lux-convert.vercel.app/',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
            }),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-clip">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
