import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lux Convert | Ücretsiz Resim, Ses ve Belge Dönüştürücü",
  applicationName: "Lux Convert",
  description: "Dosyalarınızı saniyeler içinde kaliteden ödün vermeden dönüştürün. JPG, PNG, WEBP, AVIF, MP3 ve belge formatları desteğiyle hızlı, güvenli ve tamamen ücretsiz online çevirici.",
  keywords: "resim dönüştürücü, image converter, png to jpg, webp çevirici, mp3 dönüştürücü, belge dönüştürücü, free online converter, hızlı dosya çevirme",
  authors: [{ name: "Lux Convert" }],
  creator: "Lux Convert",
  publisher: "Lux Convert",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lux-convert.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lux Convert | Ücretsiz Resim, Ses ve Belge Dönüştürücü",
    description: "Dosyalarınızı saniyeler içinde kaliteden ödün vermeden dönüştürün. JPG, PNG, WEBP, AVIF, MP3 ve belge formatları desteğiyle hızlı, güvenli ve tamamen ücretsiz online çevirici.",
    url: "https://lux-convert.vercel.app",
    siteName: "Lux Convert",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lux Convert - Ücretsiz Resim, Ses ve Belge Dönüştürücü",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lux Convert | Ücretsiz Resim, Ses ve Belge Dönüştürücü",
    description: "Dosyalarınızı saniyeler içinde kaliteden ödün vermeden dönüştürün. JPG, PNG, WEBP, AVIF, MP3 ve belge formatları desteğiyle hızlı, güvenli ve tamamen ücretsiz online çevirici.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Lux Convert",
    statusBarStyle: "default",
  },
  other: {
    "theme-color": "#9333ea",
    "msapplication-TileColor": "#9333ea",
    "apple-mobile-web-app-title": "Lux Convert",
    "application-name": "Lux Convert",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Lux Convert",
              "url": "https://lux-convert.vercel.app/"
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
