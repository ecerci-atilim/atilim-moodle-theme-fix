# Store listing texts

Copy-paste material for Firefox Add-ons (AMO), Microsoft Edge Add-ons and
Opera Add-ons. The step-by-step submission guide is in
[PUBLISHING.md](PUBLISHING.md).

There is deliberately no Chrome Web Store listing: this is a free, volunteer
project and the Chrome Web Store charges a developer registration fee. Chrome,
Brave and Vivaldi users install the extension manually (see the README).

## Name

```
UI Fix for Atılım Moodle
```

The "… for X" form follows Opera's naming rule for extensions that are not
made by the organisation they name. The name comes from `manifest.json`; the
stores read it from the package.

## Short description

The manifest `description`. Edge shows it as the short description and takes
it from the package (max. 132 characters; this one is 107):

```
A calmer, more readable and more usable interface for moodle.atilim.edu.tr, for both students and teachers.
```

AMO "Summary" (max. 250 characters) and Opera "Summary":

```
Unofficial restyle of moodle.atilim.edu.tr: grey or dark theme, readable Lato font, colour-coded activities, a tidy course index and a single-column course list. For students and teachers. Collects no data.
```

## Detailed description

Use the same text in every store (English first, Turkish below). About 3,700
characters, within Edge's 250–10,000 limit.

```
UI Fix for Atılım Moodle makes moodle.atilim.edu.tr calmer and easier to read, for students and teachers alike. It only changes how pages look: it does not read your grades, send data anywhere or change anything on the server.

WHAT IT DOES
• Light (grey) or dark theme, or follow the system setting. The dark theme also fixes white boxes, low-contrast text that teachers coloured themselves, Turnitin tables and grade reports.
• One readable font (Lato) everywhere, including announcements and forum posts.
• Activity icons coloured by purpose: assessments, content, collaboration, communication.
• A tidy course index with icons, and course titles split into code, name, term and teacher.
• My courses as a single-column list with the course image visible; the home page shows all of your courses, not only the first 20.
• Initials badges instead of the grey default profile picture.
• Participants: Turkish letters (Ç Ğ İ Ö Ş Ü) in the name filters when Moodle is in English, and people with the same last name sorted by first name.
• Wider pages, less whitespace, no stock header photo, a simpler top menu.

HOW TO USE
After installing, open any page on moodle.atilim.edu.tr: the new look applies at once. Click the extension's toolbar icon to open the settings, where every feature can be switched on or off. Changes apply immediately, without reloading, and sync with your browser profile. A bilingual user guide (English / Turkish) opens after installation.

PRIVACY
No data is collected or transmitted. Settings are stored in your browser. The extension runs only on moodle.atilim.edu.tr.

This is an unofficial project and is not affiliated with or endorsed by Atılım University.
Source code and issue reports: https://github.com/ecerci-atilim/atilim-moodle-theme-fix

————————————————

UI Fix for Atılım Moodle, moodle.atilim.edu.tr'yi öğrenciler ve öğretim elemanları için daha sade ve okunaklı hale getirir. Yalnızca sayfaların görünümünü değiştirir: notlarınızı okumaz, hiçbir yere veri göndermez, sunucuda hiçbir şeyi değiştirmez.

NELER YAPAR
• Açık (gri) ya da koyu tema veya sistem ayarına uyma. Koyu tema; beyaz kutuları, hocaların renklendirdiği düşük kontrastlı metinleri, Turnitin tablolarını ve not raporlarını da düzeltir.
• Duyurular ve forum mesajları dahil her yerde tek, okunaklı bir yazı tipi (Lato).
• Amacına göre renklendirilmiş etkinlik ikonları: değerlendirme, içerik, iş birliği, iletişim.
• İkonlu, düzenli bir ders dizini; ders başlıkları kod, ad, dönem ve öğretim elemanı olarak ayrılır.
• Derslerim sayfası, ders görselinin göründüğü tek sütunlu bir liste; ana sayfa yalnızca ilk 20 dersi değil bütün derslerinizi gösterir.
• Gri varsayılan profil fotoğrafı yerine baş harf rozetleri.
• Katılımcılar: Moodle İngilizceyken ad filtrelerinde Türkçe harfler (Ç Ğ İ Ö Ş Ü), soyadı aynı olan kişilerin ada göre sıralanması.
• Daha geniş sayfalar, daha az boşluk, başlıktaki hazır fotoğraf yok, daha sade üst menü.

NASIL KULLANILIR
Kurduktan sonra moodle.atilim.edu.tr'de herhangi bir sayfayı açın; yeni görünüm hemen uygulanır. Ayarlar için araç çubuğundaki eklenti simgesine tıklayın; her özellik oradan açılıp kapatılabilir. Değişiklikler sayfa yenilemeden hemen uygulanır ve tarayıcı profilinizle eşitlenir. Kurulumdan sonra iki dilli (İngilizce / Türkçe) bir kullanım kılavuzu açılır.

GİZLİLİK
Hiçbir veri toplanmaz ya da gönderilmez. Ayarlar tarayıcınızda saklanır. Eklenti yalnızca moodle.atilim.edu.tr'de çalışır.

Bu resmi olmayan bir projedir; Atılım Üniversitesi ile bağlantılı değildir ve üniversite tarafından onaylanmamıştır.
Kaynak kod ve sorun bildirimi: https://github.com/ecerci-atilim/atilim-moodle-theme-fix
```

## Category

- AMO: **Appearance** (alternative: Other)
- Edge: **Productivity** (or **Education** if the list offers it)
- Opera: **Productivity** (or the closest match the form offers)

## Links

| Field | Value |
| --- | --- |
| Homepage / website | `https://github.com/ecerci-atilim/atilim-moodle-theme-fix` |
| Support / issues | `https://github.com/ecerci-atilim/atilim-moodle-theme-fix/issues` |
| Privacy policy URL | `https://github.com/ecerci-atilim/atilim-moodle-theme-fix/blob/main/PRIVACY.md` |

## Images

| File | Use |
| --- | --- |
| `store/logo-300x300.png` | Edge "Extension logo" (300 × 300) |
| `icons/icon128.png` | Icon where a store asks for 128 × 128 |
| `store/screenshots/1-course-dark.png` | Screenshot: course page, dark theme, course index |
| `store/screenshots/2-course-light.png` | Screenshot: the same page, light (grey) theme |
| `store/screenshots/3-my-courses.png` | Screenshot: single-column My courses |
| `store/screenshots/4-initials.png` | Screenshot: forum with initials badges |
| `store/promo-tile-440x280.png` | Edge "Small promotional tile" (440 × 280) |

The screenshots are 640 × 480: the size Edge requires, within Opera's
800 × 600 limit, and accepted by AMO. Names in them are placeholders; no real
student or staff names are shown.

## Edge: Privacy page

**Single purpose description**

```
Restyles the Moodle site of Atılım University (moodle.atilim.edu.tr) so it is easier to read and use: colour themes, font, layout and small usability fixes on that one site.
```

**Permission justification: storage**

```
Saves the user's display settings (theme, font and the on/off switches in the popup) so they apply on every Moodle page, and caches activity icon information so the course index can show icons. Nothing is sent anywhere.
```

**Permission justification: host permission (https://moodle.atilim.edu.tr/\*)**

```
The extension's only job is to restyle moodle.atilim.edu.tr, so its content scripts and stylesheets must run on that site. It requests access to no other website.
```

**Are you using remote code?**

```
No, I am not using remote code.
```

(All JavaScript, CSS and fonts are inside the package. The extension loads
nothing from the internet.)

**Data usage**: leave every data type unticked (the extension collects none
of them) and tick all the certification boxes.

**Privacy policy URL**: see *Links* above.

## Edge: search terms

Up to 7 terms, 30 characters each, 21 words in total:

```
Moodle
Atılım
Moodle dark mode
dark theme
university
readability
course list
```

## Notes for reviewers

Paste into AMO "Notes to reviewer", Edge "Notes for certification" and the
Opera submission notes:

```
This extension only restyles https://moodle.atilim.edu.tr (Moodle 4.5 with the Stream theme). Most pages require a university account, but these pages are public and show the extension working:
- https://moodle.atilim.edu.tr/course/index.php (course categories, guest access)
- https://moodle.atilim.edu.tr/login/index.php?noredirect=1
Toggle the settings from the toolbar button (e.g. Theme → Dark) to see the changes immediately.

No remote code, no analytics, no external requests. The code is not minified or obfuscated. content/page-bridge.js is injected into the page (web_accessible_resources) only to call Moodle's own AMD module core_table/dynamic to refresh a table; it receives no data from the content script other than a DOM event. Lato is bundled under the SIL Open Font License (fonts/OFL.txt).
Source repository: https://github.com/ecerci-atilim/atilim-moodle-theme-fix
```

## AMO: extra fields

**Data collection** (asked during upload): the package already declares
`"data_collection_permissions": {"required": ["none"]}`, so the form shows
"This add-on does not collect data". Nothing else to fill in.

**Do you need to submit source code?**

```
No. The package contains the original, unminified source files; there is no build step that transforms code. scripts/build.py only zips the files and adjusts manifest.json for Firefox.
```

**License**: AMO asks for one. Choose what you prefer; MIT is a common choice
for small open-source tools. If you pick one, also add the same `LICENSE`
file to the repository.
