# Store listing texts

Copy-paste material for the Chrome Web Store and Firefox Add-ons (AMO).
The step-by-step submission guide is in [PUBLISHING.md](PUBLISHING.md).

## Name

```
Atılım Moodle UI Fix
```

If a store rejects the name because it contains the university's name, use:

```
Moodle UI Fix for Atılım (unofficial)
```

(and change `"name"` in `manifest.json` to the same text before rebuilding;
the store name and the manifest name must match.)

## Short description

Chrome "Summary" and the manifest `description` (must be identical, max. 132
characters; this one is 107):

```
A calmer, more readable and more usable interface for moodle.atilim.edu.tr, for both students and teachers.
```

AMO "Summary" (max. 250 characters):

```
Unofficial restyle of moodle.atilim.edu.tr: grey or dark theme, readable Lato font, colour-coded activities, a tidy course index and a single-column course list. For students and teachers. Collects no data.
```

## Detailed description

Use the same text in both stores (English first, Turkish below).

```
Atılım Moodle UI Fix makes moodle.atilim.edu.tr calmer and easier to read, for students and teachers alike. It only changes how pages look: it does not read your grades, send data anywhere or change anything on the server.

WHAT IT DOES
• Light (grey) or dark theme, or follow the system setting. The dark theme also fixes white boxes, low-contrast text that teachers coloured themselves, Turnitin tables and grade reports.
• One readable font (Lato) everywhere, including announcements and forum posts.
• Activity icons coloured by purpose: assessments, content, collaboration, communication.
• A tidy course index with icons, and course titles split into code, name, term and teacher.
• My courses as a single-column list with the course image visible; the home page shows all of your courses, not only the first 20.
• Initials badges instead of the grey default profile picture.
• Participants: Turkish letters (Ç Ğ İ Ö Ş Ü) in the name filters when Moodle is in English, and people with the same last name sorted by first name.
• Wider pages, less whitespace, no stock header photo, a simpler top menu.

Every feature can be switched on or off from the toolbar icon. Changes apply immediately and sync with your browser profile. A bilingual user guide (English / Turkish) opens after installation.

PRIVACY
No data is collected or transmitted. Settings are stored in your browser. The extension runs only on moodle.atilim.edu.tr.

This is an unofficial project and is not affiliated with or endorsed by Atılım University.
Source code and issue reports: https://github.com/ecerci-atilim/atilim-moodle-theme-fix

————————————————

Atılım Moodle UI Fix, moodle.atilim.edu.tr'yi öğrenciler ve öğretim elemanları için daha sade ve okunaklı hale getirir. Yalnızca sayfaların görünümünü değiştirir: notlarınızı okumaz, hiçbir yere veri göndermez, sunucuda hiçbir şeyi değiştirmez.

NELER YAPAR
• Açık (gri) ya da koyu tema veya sistem ayarına uyma. Koyu tema; beyaz kutuları, hocaların renklendirdiği düşük kontrastlı metinleri, Turnitin tablolarını ve not raporlarını da düzeltir.
• Duyurular ve forum mesajları dahil her yerde tek, okunaklı bir yazı tipi (Lato).
• Amacına göre renklendirilmiş etkinlik ikonları: değerlendirme, içerik, iş birliği, iletişim.
• İkonlu, düzenli bir ders dizini; ders başlıkları kod, ad, dönem ve öğretim elemanı olarak ayrılır.
• Derslerim sayfası, ders görselinin göründüğü tek sütunlu bir liste; ana sayfa yalnızca ilk 20 dersi değil bütün derslerinizi gösterir.
• Gri varsayılan profil fotoğrafı yerine baş harf rozetleri.
• Katılımcılar: Moodle İngilizceyken ad filtrelerinde Türkçe harfler (Ç Ğ İ Ö Ş Ü), soyadı aynı olan kişilerin ada göre sıralanması.
• Daha geniş sayfalar, daha az boşluk, başlıktaki hazır fotoğraf yok, daha sade üst menü.

Her özellik araç çubuğundaki simgeden açılıp kapatılabilir. Değişiklikler hemen uygulanır ve tarayıcı profilinizle eşitlenir. Kurulumdan sonra iki dilli (İngilizce / Türkçe) bir kullanım kılavuzu açılır.

GİZLİLİK
Hiçbir veri toplanmaz ya da gönderilmez. Ayarlar tarayıcınızda saklanır. Eklenti yalnızca moodle.atilim.edu.tr'de çalışır.

Bu resmi olmayan bir projedir; Atılım Üniversitesi ile bağlantılı değildir ve üniversite tarafından onaylanmamıştır.
Kaynak kod ve sorun bildirimi: https://github.com/ecerci-atilim/atilim-moodle-theme-fix
```

## Category

- Chrome Web Store: **Education** (alternative: Tools)
- AMO: **Appearance** (alternative: Other)

## Links

| Field | Value |
| --- | --- |
| Homepage / website | `https://github.com/ecerci-atilim/atilim-moodle-theme-fix` |
| Support / issues | `https://github.com/ecerci-atilim/atilim-moodle-theme-fix/issues` |
| Privacy policy URL | `https://github.com/ecerci-atilim/atilim-moodle-theme-fix/blob/main/PRIVACY.md` |

## Images

| File | Use |
| --- | --- |
| `icons/icon128.png` | Store icon (128 × 128) |
| `store/screenshots/1-course-dark.png` | Screenshot: course page, dark theme, course index |
| `store/screenshots/2-course-light.png` | Screenshot: the same page, light (grey) theme |
| `store/screenshots/3-my-courses.png` | Screenshot: single-column My courses |
| `store/screenshots/4-initials.png` | Screenshot: forum with initials badges |
| `store/promo-tile-440x280.png` | Chrome "Small promo tile" (440 × 280) |

All screenshots are 640 × 400 (a size both stores accept). Names in them are
placeholders; no real student or staff names are shown.

## Chrome Web Store: Privacy practices tab

**Single purpose**

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

**Data usage**

Leave every data type unticked (the extension collects none of them), then
tick all three certifications:

- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

## AMO: extra fields

**Data collection** (asked during upload): the package already declares
`"data_collection_permissions": {"required": ["none"]}`, so the form shows
"This add-on does not collect data". Nothing else to fill in.

**Do you need to submit source code?**

```
No. The package contains the original, unminified source files; there is no build step that transforms code. scripts/build.py only zips the files and adjusts manifest.json for Firefox.
```

**Notes to reviewer**

```
This extension only restyles https://moodle.atilim.edu.tr (Moodle 4.5 with the Stream theme). Most pages require a university account, but these pages are public and show the extension working:
- https://moodle.atilim.edu.tr/course/index.php (course categories, guest access)
- https://moodle.atilim.edu.tr/login/index.php?noredirect=1
Toggle the settings from the toolbar button (e.g. Theme → Dark) to see the changes immediately.

No remote code, no analytics, no external requests. content/page-bridge.js is injected into the page (web_accessible_resources) only to call Moodle's own AMD module core_table/dynamic to refresh a table; it receives no data from the content script other than a DOM event.
Source repository: https://github.com/ecerci-atilim/atilim-moodle-theme-fix
```

**License**: AMO asks for one. Choose what you prefer; MIT is a common choice
for small open-source tools. If you pick one, also add the same `LICENSE`
file to the repository.
