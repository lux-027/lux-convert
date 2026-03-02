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
            Gizlilik ve Güvenlik
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

        {/* Kapsamlı Gizlilik ve Güvenlik Politikası Section */}
        <section className="mt-20 max-w-4xl w-full">
          <div className="glass p-12 rounded-[3rem] space-y-8">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-center mb-8">Gizlilik ve Güvenlik Politikası</h3>
            
            <div className="space-y-6 text-left">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">1. Tanımlar ve Kapsam</h4>
                <p className="text-gray-600 leading-relaxed">
                  Bu Gizlilik ve Güvenlik Politikası ("Politika"), Lux Convert web sitesi ve hizmetleri ("Hizmet") 
                  üzerinden toplanan, işlenen ve korunan kişisel verilerinize ilişkin uygulamalarımızı açıklamaktadır. 
                  Hizmet'i kullanarak bu Politika'ya uymuş sayılırsınız.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">2. Toplanan Bilgiler</h4>
                <p className="text-gray-600 leading-relaxed">
                  Lux Convert olarak aşağıdaki bilgileri toplamaktayız:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı türü, işletim sistemi, ziyaret süresi</li>
                  <li><strong>Kullanım Verileri:</strong> Sayfa görüntüleme sayısı, ziyaret edilen sayfalar, tıklama desenleri</li>
                  <li><strong>Çerez Verileri:</strong> Oturum bilgileri, kullanıcı tercihleri, reklam kişiselleştirme verileri</li>
                  <li><strong>Dosya Bilgileri:</strong> Yalnızca tarayıcıda işlenen dosya formatları ve boyutları (sunucuya yüklenmez)</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">3. Çerez Kullanımı (Cookies)</h4>
                <p className="text-gray-600 leading-relaxed">
                  Web sitemiz, kullanıcı deneyimini iyileştirmek ve Hizmet'i kişiselleştirmek için çerezler kullanmaktadır. 
                  Çerezler, cihazınızda küçük metin dosyaları olarak saklanır ve web sitesi kullanımınız hakkında bilgi toplarlar.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Zorunlu Çerezler:</strong> Hizmet'in temel işlevleri için gerekli</li>
                  <li><strong>Performans Çerezleri:</strong> Site performansını izlemek ve iyileştirmek için</li>
                  <li><strong>Reklam Çerezleri:</strong> Kişiselleştirilmiş reklamlar göstermek için</li>
                  <li><strong>Analitik Çerezler:</strong> Kullanıcı davranışlarını analiz etmek için</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Tarayıcı ayarlarınızdan çerezleri reddedebilir veya silebilirsiniz. Ancak bu durumda bazı Hizmet özellikleri çalışmayabilir.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">4. Google AdSense ve DoubleClick DART Çerezleri</h4>
                <p className="text-gray-600 leading-relaxed">
                  Lux Convert, Google AdSense reklam programını kullanarak gelir elde etmektedir. 
                  Google, Hizmet'te reklamlar göstermek için DoubleClick DART çerezlerini kullanabilir:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>İlgi alanlarınıza dayalı reklamlar göstermek</li>
                  <li>Reklam performansını ölçmek ve optimize etmek</li>
                  <li>Dolandırıcılığı önlemek ve güvenliği sağlamak</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Google'ın reklam çerezleri hakkında daha fazla bilgi için 
                  <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Reklam ve Gizlilik Politikası</a> 
                  ve <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Reklam Ayarları</a> sayfalarını ziyaret edebilirsiniz.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">5. Üçüncü Taraf Hizmetler ve Reklam Verenler</h4>
                <p className="text-gray-600 leading-relaxed">
                  Hizmet'te aşağıdaki üçüncü taraf hizmetleri kullanılmaktadır:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Google AdSense:</strong> Reklam gösterimi ve gelir elde etme</li>
                  <li><strong>Google Analytics:</strong> Web sitesi trafiği analiz ve optimizasyon</li>
                  <li><strong>Cloudflare:</strong> CDN hizmetleri ve güvenlik koruması</li>
                  <li><strong>Vercel:</strong> Hosting ve altyapı hizmetleri</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Bu üçüncü taraf sağlayıcılar, kendi gizlilik politikalarına göre verilerinizi işleyebilir. 
                  Bu sağlayıcıların gizlilik politikalarını incelemenizi öneririz.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">6. Veri Güvenliği ve Korunması</h4>
                <p className="text-gray-600 leading-relaxed">
                  Lux Convert, veri güvenliğine büyük önem vermektedir:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Client-Side İşleme:</strong> Dosya dönüştürme işlemleri tamamen tarayıcıda gerçekleşir</li>
                  <li><strong>Sunucu Yükleme Yok:</strong> Dosyalarınız hiçbir zaman sunucularımıza yüklenmez</li>
                  <li><strong>SSL Şifreleme:</strong> Tüm veri transferleri HTTPS ile şifrelenir</li>
                  <li><strong>Veri Saklama:</strong> Kişisel verileriniz asla kaydedilmez veya saklanmaz</li>
                  <li><strong>Otomatik Temizlik:</strong> Oturum sonunda tüm geçici veriler silinir</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">7. Kullanıcı Hakları (KVKK)</h4>
                <p className="text-gray-600 leading-relaxed">
                  Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Bilgilendirme Hakkı:</strong> Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li><strong>Bilgi Talep Hakkı:</strong> Kişisel verileriniz hakkında bilgi talep etme</li>
                  <li><strong>Erişim Hakkı:</strong> Kişisel verilerinize erişme ve bunları öğrenme</li>
                  <li><strong>Düzeltme Hakkı:</strong> Yanlış veya eksik verilerinizi düzeltme</li>
                  <li><strong>Silme Hakkı:</strong> Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                  <li><strong>İtiraz Hakkı:</strong> Kişisel verilerinizin işlenmesine itiraz etme</li>
                  <li><strong>Çerez Kontrol Hakkı:</strong> Çerezleri reddetme veya yönetme</li>
                  <li><strong>Reklam Kişiselleştirme Hakkı:</strong> Reklam kişiselleştirmesini devre dışı bırakma</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Bu haklarınızı kullanmak için web sitemizdeki iletişim formunu kullanarak bizimle iletişime geçebilirsiniz.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">8. Veri İşleme Amaçları</h4>
                <p className="text-gray-600 leading-relaxed">
                  Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Hizmet sunumu ve dosya dönüştürme işlemlerinin gerçekleştirilmesi</li>
                  <li>Web sitesi performansının iyileştirilmesi ve kullanıcı deneyiminin kişiselleştirilmesi</li>
                  <li>Reklam gösterimi ve gelir elde etme</li>
                  <li>İstatistiksel analiz ve raporlama</li>
                  <li>Güvenlik önlemlerinin uygulanması</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">9. Uluslararası Veri Transferi</h4>
                <p className="text-gray-600 leading-relaxed">
                  Hizmet'imizde kullanılan bazı üçüncü taraf hizmetler (Google, Cloudflare vb.) 
                  Türkiye dışında sunucular kullanabilir. Bu transferler, ilgili yasal düzenlemelere uygun olarak gerçekleştirilmektedir.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">10. Çocukların Gizliliği</h4>
                <p className="text-gray-600 leading-relaxed">
                  Lux Convert, 13 yaşın altındaki çocuklardan bilerek kişisel bilgi toplamaz. 
                  Eğer çocuğunuzun kişisel bilgi sağladığını fark ederseniz, 
                  lütfen derhal bizimle iletişime geçerek bu bilgilerin silinmesini talep edin.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">11. Politika Değişiklikleri</h4>
                <p className="text-gray-600 leading-relaxed">
                  Bu Politika, yasal düzenlemeler veya Hizmet'teki değişiklikler nedeniyle güncellenebilir. 
                  Önemli değişiklikler web sitemizde duyurulacaktır. 
                  Politikamızı düzenli olarak gözden geçirmenizi öneririz.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">12. İletişim Bilgileri</h4>
                <p className="text-gray-600 leading-relaxed">
                  Bu Gizlilik ve Güvenlik Politikası hakkında sorularınız, talepleriniz veya endişeleriniz varsa:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Web sitemizdeki iletişim formunu kullanabilirsiniz</li>
                  <li>KVKK kapsamındaki taleplerinizi yazılı olarak iletebilirsiniz</li>
                  <li>Talepleriniz 30 gün içinde yanıtlanacaktır</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800">13. Yürürlük</h4>
                <p className="text-gray-600 leading-relaxed">
                  Bu Politika, 2 Mart 2026 tarihinde yürürlüğe girmiş olup, 
                  Türk mevzuatı ve uluslararası veri koruma standartlarına uygundur.
                </p>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Son Güncelleme: 2 Mart 2026</strong><br/>
                <span className="text-xs">Bu Politika 6698 Sayılı Kişisel Verilerin Korunması Kanunu ve GDPR uyumludur.</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
