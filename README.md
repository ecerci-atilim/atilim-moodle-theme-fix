# Atılım Moodle UI Fix

moodle.atilim.edu.tr üzerindeki Stream temasını daha sade, okunaklı ve kullanışlı
hale getiren Chrome eklentisi. Öğrenci ve eğitmen görünümlerinin ikisini de
düzeltir; hiçbir veriyi dışarı göndermez, yalnızca sayfanın görünümünü değiştirir.

## Neler yapıyor

- **Ders adlarını ayrıştırır.** `EE 203 | Digital Circuits and Systems 2526G | Özgür Doruk`
  kalıbı kod, ad, dönem ve eğitmen olarak ayrı satırlara bölünür. Ders kartlarında,
  ders başlığında, sol dizin başlığında ve sekme başlığında çalışır.
- **İkonları renklendirir.** Etkinlik ikonları amacına göre renk alır: ödev/sınav
  pembe, kaynak mavi, forum mor, iletişim yeşil, etkileşimli içerik turuncu.
  Turnitin gibi üçüncü parti modüller de doğru gruba girer.
- **Sol dizine ikon ve girinti ekler.** Bölüm başlıkları ile etkinlikler ayrılır,
  dosya türü ikonları (PDF, DOCX) ders sayfasından öğrenilip önbelleğe alınır.
- **Başlık görselini ve carousel'i gizler**, altbilgiyi kaldırır, 830px genişlik
  sınırını açar, satırları sıklaştırır.
- **Üst menüyü sadeleştirir.** Tema menüleri (Instructor, Student, FAQ, ...) gizlenir;
  Panel ve Derslerim linkleri eklenir.
- **Açık gri ve koyu tema.** Sistem temasına da uyabilir.
- **Ayar penceresi.** Her özellik tek tek açılıp kapanır; ayarlar Chrome hesabınla
  eşitlenir ve sayfa yenilenmeden uygulanır.

## Kurulum

1. Bu klasörü bilgisayarına indir (zip olarak ya da `git clone`).
2. Chrome'da `chrome://extensions` adresini aç.
3. Sağ üstten **Geliştirici modu**'nu aç.
4. **Paketlenmemiş öğe yükle** düğmesine bas ve bu klasörü seç.
5. moodle.atilim.edu.tr'yi yenile. Araç çubuğundaki eklenti ikonuna tıklayarak
   ayarları değiştirebilirsin.

Edge ve Brave'de de aynı adımlar geçerlidir.

## Dosya yapısı

```
manifest.json          Manifest V3 tanımı
content/settings.js    Ayar modeli; ayarları <html data-atm-*> özniteliklerine yazar
content/features.js    DOM'a dokunan özellikler (başlık ayrıştırma, ikonlar, menü)
content/main.js        Giriş noktası; debounce'lu MutationObserver
styles/base.css        Renk paleti (CSS değişkenleri), yazı tipi, ortak parçalar
styles/layout.css      Sayfa iskeleti, başlık şeridi, ikincil menü
styles/navbar.css      Üst çubuk
styles/dashboard.css   Panel ve Derslerim kartları
styles/course.css      Ders sayfası, bölümler, etkinlik satırları, ikon renkleri
styles/courseindex.css Sol dizin çekmecesi
styles/activity.css    Forum, ödev, sınav, kaynak sayfaları
styles/forms.css       Düğmeler, formlar, açılır menüler, modal pencereler
styles/tables.css      Katılımcılar, not defteri, takvim tabloları
styles/messages.css    Mesaj çekmecesi
styles/editmode.css    Eğitmen düzenleme modu
styles/dark.css        Koyu palet ve koyu tema düzeltmeleri
popup/                 Ayar penceresi
fonts/                 Lato (latin + latin-ext, Türkçe karakterler dahil)
icons/                 Eklenti ikonu
```

## Nasıl çalışıyor

Bütün CSS kuralları `html[data-atm-...]` özniteliklerine bağlıdır. `settings.js`
sayfa yüklenirken (document_start) önce localStorage'daki kopyayı, sonra
`chrome.storage.sync` değerini okuyup bu öznitelikleri yazar; böylece koyu temada
beyaz flaş olmaz ve popup'taki bir değişiklik anında uygulanır.

Renkler yalnızca `styles/base.css` ve `styles/dark.css` içinde tanımlıdır; diğer
dosyalar `var(--atm-...)` kullanır. Paleti değiştirmek için bu iki dosya yeterlidir.

## Geliştirme

Dosyaları düzenledikten sonra `chrome://extensions` sayfasında eklentinin
**yenile** düğmesine basıp Moodle sekmesini yenilemek yeterlidir. Site Moodle 4.4
(Bootstrap 4) üzerinde Stream teması kullanır; seçiciler buna göre yazılmıştır.
