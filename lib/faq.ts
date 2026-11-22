export type FaqItem = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'genel',
    title: 'Genel',
    items: [
      {
        q: 'Lux Convert nedir?',
        a: 'Görüntü, ses, video ve belge dosyalarını tarayıcınızda dönüştürmenizi, sıkıştırmanızı ve kırpmanızı sağlayan ücretsiz bir web aracıdır.',
      },
      { q: 'Ücretli mi?', a: 'Hayır. Tüm araçlar ücretsizdir; kayıt, filigran veya gizli ücret yoktur.' },
      { q: 'Üye olmam gerekiyor mu?', a: 'Hayır. Sayfayı açıp dosyanızı bırakmanız yeterli.' },
      {
        q: 'Hangi tarayıcılarda çalışır?',
        a: 'Chrome, Edge, Opera, Firefox ve Safari’nin güncel sürümlerinde çalışır. Büyük videolar için masaüstü tarayıcı önerilir.',
      },
      {
        q: 'Telefonda kullanabilir miyim?',
        a: 'Evet. Site mobil uyumludur. Çok büyük dosyalarda telefonun belleği yetmeyebilir; bu durumda bilgisayar kullanın.',
      },
    ],
  },
  {
    id: 'guvenlik',
    title: 'Gizlilik ve güvenlik',
    items: [
      {
        q: 'Dosyalarım bir sunucuya yükleniyor mu?',
        a: 'Hayır. Dönüştürme, sıkıştırma ve kırpma işlemlerinin tamamı tarayıcınızda yapılır. Dosyalarınız cihazınızdan çıkmaz.',
      },
      {
        q: 'Dosyalarım saklanıyor mu?',
        a: 'Hayır. Dosyalar yalnızca açık sekmenin belleğinde tutulur; sayfayı kapattığınızda veya listeyi temizlediğinizde silinir.',
      },
      {
        q: 'İnternet bağlantısı gerekli mi?',
        a: 'Sayfanın ve dönüştürme motorunun ilk yüklenmesi için gereklidir. Sonrasında işlemler cihazınızda yapılır.',
      },
    ],
  },
  {
    id: 'donustur',
    title: 'Dönüştürme',
    items: [
      {
        q: 'Hangi biçimler destekleniyor?',
        a: 'Görüntü: JPG, PNG, WEBP, AVIF, GIF, BMP, ICO. Ses: MP3, WAV, OGG, M4A, FLAC, AAC. Video: MP4, WEBM, MOV. Belge: PDF, DOCX, TXT ve daha fazlası.',
      },
      { q: 'Aynı anda kaç dosya dönüştürebilirim?', a: 'Birden fazla dosyayı birlikte ekleyebilir, sonuçları tek tek ya da tek bir ZIP olarak indirebilirsiniz.' },
      {
        q: 'Ses ve video dönüştürme neden ilk seferde biraz bekliyor?',
        a: 'İlk kullanımda dönüştürme motoru bir kez indirilir ve tarayıcıda önbelleğe alınır. Sonraki işlemler hemen başlar.',
      },
      {
        q: 'Videoyu MP3’e çeviremiyorum, neden?',
        a: 'Videoda ses kanalı yoksa MP3 oluşturulamaz. Bu durumda site bir uyarı gösterir.',
      },
      { q: 'Bir dosya boyutu sınırı var mı?', a: 'Sabit bir sınır yoktur; sınır cihazınızın belleğidir.' },
    ],
  },
  {
    id: 'sikistir',
    title: 'Sıkıştırma',
    items: [
      {
        q: 'Hafif, Önerilen ve Güçlü arasındaki fark nedir?',
        a: 'Hafif kaliteyi en çok korur, Güçlü en küçük boyutu verir. Önerilen ikisi arasında dengelidir. Satırlarda her seviye için tahmini boyut görünür.',
      },
      {
        q: '“Ayarla” ne işe yarar?',
        a: 'Hedef boyutu orijinalin %5’i ile %100’ü arasında kendiniz seçersiniz. Çıktı genellikle hedefin biraz altında kalır.',
      },
      {
        q: 'Sıkıştırılmış dosya neden bazen küçülmüyor?',
        a: 'Dosya zaten iyi sıkıştırılmışsa yeni çıktı daha büyük olabilir. Bu durumda orijinal dosya korunur.',
      },
      {
        q: 'PDF sıkıştırınca metni seçemiyorum, neden?',
        a: 'PDF sıkıştırma sayfaları görüntüye çevirir. Bu nedenle çıktıdaki metin seçilemez hale gelebilir.',
      },
    ],
  },
  {
    id: 'kirp',
    title: 'Kırpma',
    items: [
      { q: 'Hangi görüntüleri kırpabilirim?', a: 'JPG, PNG, WEBP, GIF ve BMP gibi tarayıcının açabildiği tüm görüntüleri kırpabilirsiniz.' },
      {
        q: 'Belirli bir oranda kırpabilir miyim?',
        a: 'Evet. Serbest kırpmanın yanında 1:1, 4:3, 16:9 gibi hazır oranlar vardır. Görüntüyü döndürüp çevirebilirsiniz.',
      },
      { q: 'Şeffaf PNG’ler korunuyor mu?', a: 'Evet. PNG veya WEBP olarak kaydederseniz şeffaflık korunur.' },
    ],
  },
];

export const HOME_FAQ: FaqItem[] = [
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[2].items[4],
  FAQ_GROUPS[0].items[3],
  FAQ_GROUPS[2].items[2],
];
