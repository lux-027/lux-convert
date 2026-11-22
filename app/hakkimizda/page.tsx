import { pageMetadata } from '@/lib/seo';
import Prose from '@/components/Prose';
import { CONTACT_EMAIL, mailto } from '@/lib/contact';

export const metadata = pageMetadata('/hakkimizda', 'Hakkımızda', 'Lux Convert, dosyalarınızı tarayıcınızda güvenle dönüştüren ücretsiz bir araçtır.');

export default function Page() {
  return (
    <Prose title="Hakkımızda">
      <p>
        <strong>Lux Convert</strong>, görüntü, ses, video ve belge dosyalarını hızlı ve güvenli şekilde dönüştürmek için geliştirilmiş ücretsiz bir
        web aracıdır.
      </p>
      <p>
        Çoğu çevrimiçi dönüştürücü dosyalarınızı kendi sunucularına yükler. Lux Convert ise tüm işlemleri doğrudan tarayıcınızda yapar. Dosyalarınız
        cihazınızdan çıkmaz, bekleme sırası olmaz ve internet hızınız işlem süresini etkilemez.
      </p>
      <h2>Neler yapabilirsiniz?</h2>
      <ul>
        <li>Görüntüleri JPG, PNG, WEBP, GIF, BMP, ICO ve PDF biçimleri arasında dönüştürmek</li>
        <li>Ses ve video dosyalarını MP3, WAV, MP4, WEBM, MOV gibi biçimlere çevirmek</li>
        <li>PDF, DOCX, TXT, CSV ve JSON belgelerini dönüştürmek</li>
        <li>Görüntü, PDF, ses ve video dosyalarını sıkıştırmak</li>
        <li>Görüntüleri kırpmak, döndürmek ve çevirmek</li>
      </ul>
      <h2>İletişim</h2>
      <p>
        Öneri ve geri bildirimleriniz için <a href={mailto()} className="text-primary hover:underline">{CONTACT_EMAIL}</a> adresine yazabilir ya da{' '}
        <a href="/iletisim" className="text-primary hover:underline">iletişim sayfasını</a> kullanabilirsiniz.
      </p>
    </Prose>
  );
}
