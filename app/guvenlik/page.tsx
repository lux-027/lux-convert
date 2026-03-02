'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, EyeOff, ServerOff, FileCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Guvenlik() {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-white pb-20">
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full glass-header rounded-2xl border border-white/20">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
              Lux<span className="text-primary">Security</span>
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
            Güvenlik ve Gizlilik
          </h2>
          <p className="text-xl text-gray-600 font-bold max-w-3xl mx-auto leading-relaxed">
            Dosyalarınızın güvenliği bizim bir numaralı önceliğimizdir. LuxConvert nasıl çalışır ve verilerinizi nasıl korur?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* Item 1 */}
          <div className="glass p-10 rounded-[2.5rem] space-y-6 hover:scale-[1.02] transition-all duration-500 group">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
              <ServerOff className="w-8 h-8 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Bulutsuz İşlem</h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              Diğer dönüştürücülerin aksine LuxConvert, dosyalarınızı asla bir sunucuya yüklemez. Tüm dönüştürme ve sıkıştırma işlemleri doğrudan **tarayıcınızda (client-side)** gerçekleşir.
            </p>
          </div>

          {/* Item 2 */}
          <div className="glass p-10 rounded-[2.5rem] space-y-6 hover:scale-[1.02] transition-all duration-500 group">
            <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-blue-500/5">
              <Lock className="w-8 h-8 text-blue-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Veri Gizliliği</h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              Dosyalarınız bilgisayarınızdan hiç çıkmadığı için gizliliğiniz %100 korunur. Ne biz ne de bir başkası görsellerinizi göremez veya kopyalayamaz.
            </p>
          </div>

          {/* Item 3 */}
          <div className="glass p-10 rounded-[2.5rem] space-y-6 hover:scale-[1.02] transition-all duration-500 group">
            <div className="bg-green-500/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-green-500/5">
              <FileCheck className="w-8 h-8 text-green-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Güvenli İndirme</h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              Dönüştürülen dosyalar anlık olarak bellekte (RAM) oluşturulur ve bilgisayarınıza indirilir. İşlem bittiğinde ve sayfayı kapattığınızda tüm veriler otomatik olarak temizlenir.
            </p>
          </div>

          {/* Item 4 */}
          <div className="glass p-10 rounded-[2.5rem] space-y-6 hover:scale-[1.02] transition-all duration-500 group">
            <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-purple-500/5">
              <EyeOff className="w-8 h-8 text-purple-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Kayıt Yok</h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              Sizi takip etmiyoruz. LuxConvert'i kullanmak için kayıt olmanıza, e-posta vermenize veya herhangi bir kişisel bilgi paylaşmanıza gerek yoktur.
            </p>
          </div>
        </div>

        <section className="mt-20 max-w-4xl w-full text-center space-y-10 glass p-12 rounded-[3rem]">
          <h3 className="text-4xl font-black uppercase tracking-tighter">Güvenlik Garantisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-black text-primary">0</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Yüklenen Dosya</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black text-primary">%100</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Yerel İşlem</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black text-primary">Sınırsız</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Gizlilik</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
