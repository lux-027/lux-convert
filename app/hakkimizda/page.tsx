'use client';

import { Info, Sparkles, Rocket, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Hakkimizda() {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-white pb-20">
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full glass-header rounded-2xl border border-white/20">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
              <Info className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
              Lux<span className="text-primary">About</span>
            </h1>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-all bg-white/50 px-5 py-2.5 rounded-xl border border-white/50">
            <ArrowLeft className="w-4 h-4" />
            Geri Dön
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-6xl font-black tracking-tighter text-gray-900 drop-shadow-sm uppercase">
            Hikayemiz
          </h2>
          <p className="text-xl text-gray-600 font-bold max-w-3xl mx-auto leading-relaxed">
            LuxConvert, görsel işleme süreçlerini herkes için hızlı, güvenli ve tamamen ücretsiz hale getirmek amacıyla doğdu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="glass p-10 rounded-[2.5rem] space-y-6 text-center group hover:scale-105 transition-all duration-500">
            <div className="bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
              <Sparkles className="w-8 h-8 text-orange-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Modern Tasarım</h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              En yeni web teknolojilerini (Next.js, Tailwind CSS) kullanarak, kullanıcı deneyimini en üst seviyeye taşıyoruz.
            </p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] space-y-6 text-center group hover:scale-105 transition-all duration-500">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Rocket className="w-8 h-8 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Hız Odaklı</h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              Dosyalarınız buluta yüklenmeden doğrudan tarayıcınızda işlendiği için saniyeler içinde sonuç alırsınız.
            </p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] space-y-6 text-center group hover:scale-105 transition-all duration-500">
            <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
              <Heart className="w-8 h-8 text-red-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Kullanıcı Dostu</h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              Karmaşık ayarlar yerine sadece birkaç tıkla işinizi halletmeniz için her şeyi basitleştirdik.
            </p>
          </div>
        </div>

        <section className="mt-20 max-w-4xl w-full glass p-12 rounded-[3rem] text-center space-y-8">
          <h3 className="text-4xl font-black uppercase tracking-tighter">Vizyonumuz</h3>
          <p className="text-lg text-gray-600 font-bold leading-relaxed">
            Dijital dünyada veri gizliliğinin giderek önem kazandığı bu dönemde, LuxConvert olarak "Yerel İşlem" (Client-side processing) standartlarını savunuyoruz. Dosyalarınızın her zaman sadece size ait kalması gerektiğine inanıyoruz.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
