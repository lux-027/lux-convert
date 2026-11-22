import { pageMetadata } from '@/lib/seo';
import Prose from '@/components/Prose';

export const metadata = pageMetadata('/gizlilik', 'Gizlilik ve Güvenlik', 'Lux Convert dosyalarınızı sunucuya yüklemez; tüm işlemler tarayıcınızda yapılır.');

export default function Page() {
  return (
    <Prose title="Gizlilik ve Güvenlik">
      <p>
        Gizliliğiniz bizim için önemlidir. Lux Convert, dosyalarınızı <strong>hiçbir sunucuya yüklemez</strong>. Dönüştürme, sıkıştırma ve kırpma
        işlemlerinin tamamı cihazınızda, tarayıcınızın içinde gerçekleşir.
      </p>
      <h2>Dosyalarınız</h2>
      <ul>
        <li>Seçtiğiniz dosyalar yalnızca tarayıcınızın belleğinde işlenir.</li>
        <li>Sayfayı kapattığınızda dosyalar ve sonuçlar bellekten silinir.</li>
        <li>Dosya içerikleri hiçbir şekilde kaydedilmez, paylaşılmaz veya analiz edilmez.</li>
      </ul>
      <h2>Harici kaynaklar</h2>
      <p>
        Ses ve video işlemleri için gereken dönüştürme motoru (FFmpeg) ilk kullanımda herkese açık bir içerik dağıtım ağından (jsDelivr) indirilir.
        Bu indirme sırasında dosyalarınız gönderilmez.
      </p>
      <h2>Çerezler</h2>
      <p>Lux Convert yalnızca tema tercihinizi (açık/koyu) tarayıcınızda saklar. Takip veya reklam çerezi kullanılmaz.</p>
    </Prose>
  );
}
