# Privacy policy

*Atılım Moodle UI Fix* is a browser extension that changes how
moodle.atilim.edu.tr looks. It is an unofficial project and is not affiliated
with Atılım University.

**Short version: the extension does not collect, store remotely, sell or share
any personal data. Nothing leaves your browser except the requests Moodle
itself would make, sent to moodle.atilim.edu.tr.**

## What the extension stores, and where

All data stays in your own browser.

| What | Where | Why |
| --- | --- | --- |
| Your settings (theme, font, on/off switches) | `chrome.storage.sync` | So the settings apply on every Moodle page. If you are signed in to your browser with sync turned on, the browser vendor syncs them between your own devices, like any other extension setting. |
| A copy of the same settings | `localStorage` of moodle.atilim.edu.tr | Read synchronously while a page loads, so the dark theme does not flash white. |
| Activity icon information per course (activity IDs, icon addresses, activity type) | `chrome.storage.local` | Shows the icons in the course index without waiting for the course page. |
| The language you picked in the user guide | `localStorage` of the guide page | Opens the guide in the same language next time. |

You can delete all of it by removing the extension.

## Network requests

The extension contacts no server of its own and no third party: no analytics,
no tracking, no advertising, no remote code. Fonts and icons are bundled with
the extension.

Some features ask Moodle for data that Moodle would also load itself, using
your existing Moodle session, and only on moodle.atilim.edu.tr:

- **All courses on the home page** asks Moodle's own web service for the list
  of your courses, because the home page shows only 20.
- **Full name sorting** and **Turkish letters in name filters** ask Moodle to
  reload the Participants table, exactly as Moodle's own sort and filter
  controls do.

The answers are used only to change the page you are looking at and are not
stored or sent anywhere else.

## Permissions

- `storage`: to save the settings described above.
- Access to `https://moodle.atilim.edu.tr/*`: to restyle Moodle pages. The
  extension runs on no other website.

## Contact

Questions and problem reports:
<https://github.com/ecerci-atilim/atilim-moodle-theme-fix/issues>

---

# Gizlilik politikası

*Atılım Moodle UI Fix*, moodle.atilim.edu.tr'nin görünümünü değiştiren bir
tarayıcı eklentisidir. Resmi değildir ve Atılım Üniversitesi ile bağlantısı
yoktur.

**Kısaca: eklenti hiçbir kişisel veriyi toplamaz, uzak bir sunucuda saklamaz,
satmaz ya da paylaşmaz. Tarayıcınızdan, Moodle'ın kendisinin de yapacağı ve
moodle.atilim.edu.tr'ye giden istekler dışında hiçbir şey çıkmaz.**

## Eklenti neyi, nerede saklar

Bütün veriler kendi tarayıcınızda kalır.

| Ne | Nerede | Neden |
| --- | --- | --- |
| Ayarlarınız (tema, yazı tipi, aç/kapat seçenekleri) | `chrome.storage.sync` | Ayarların her Moodle sayfasında uygulanması için. Tarayıcınızda eşitleme açıksa tarayıcı üreticisi bunları, diğer eklenti ayarları gibi, kendi cihazlarınız arasında eşitler. |
| Aynı ayarların bir kopyası | moodle.atilim.edu.tr'nin `localStorage` alanı | Sayfa yüklenirken hemen okunur; koyu temada beyaz yanıp sönmeyi önler. |
| Derse göre etkinlik ikonu bilgisi (etkinlik numaraları, ikon adresleri, etkinlik türü) | `chrome.storage.local` | Ders dizinindeki ikonları ders sayfasını beklemeden göstermek için. |
| Kılavuzda seçtiğiniz dil | Kılavuz sayfasının `localStorage` alanı | Kılavuzun bir dahaki sefere aynı dilde açılması için. |

Eklentiyi kaldırdığınızda bunların hepsi silinir.

## Ağ istekleri

Eklenti kendine ait bir sunucuya ya da üçüncü bir tarafa bağlanmaz: analiz,
izleme, reklam ya da uzaktan kod yoktur. Yazı tipleri ve ikonlar eklentinin
içindedir.

Bazı özellikler, mevcut Moodle oturumunuzla ve yalnızca moodle.atilim.edu.tr
üzerinde, Moodle'ın zaten yükleyeceği verileri Moodle'dan ister:

- **Ana sayfada bütün dersler**, ana sayfa yalnızca 20 ders gösterdiği için
  ders listenizi Moodle'ın kendi web servisinden ister.
- **Tam ada göre sıralama** ve **ad filtrelerinde Türkçe harfler**,
  Katılımcılar tablosunu Moodle'ın kendi sıralama ve filtre düğmelerinin
  yaptığı gibi yeniden yükletir.

Gelen yanıtlar yalnızca baktığınız sayfayı değiştirmek için kullanılır;
saklanmaz ve başka bir yere gönderilmez.

## İzinler

- `storage`: yukarıda anlatılan ayarları kaydetmek için.
- `https://moodle.atilim.edu.tr/*` erişimi: Moodle sayfalarının görünümünü
  değiştirmek için. Eklenti başka hiçbir sitede çalışmaz.

## İletişim

Sorular ve sorun bildirimleri:
<https://github.com/ecerci-atilim/atilim-moodle-theme-fix/issues>
