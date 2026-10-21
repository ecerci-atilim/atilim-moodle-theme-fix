# UI Fix for Atılım Moodle

A Chrome extension that makes the Stream theme on moodle.atilim.edu.tr calmer,
more readable and easier to use. It covers both the student and the teacher
views. It only changes how pages look; it never sends data anywhere.

## Features

- **Light grey or dark theme**, or follow the operating system. The dark theme
  also covers forms, the Atto editor, the gradebook, the messaging drawer,
  notifications and the Turnitin submission inbox.
- **Readable teacher content in dark mode.** Announcements and descriptions
  often carry their own colours (a yellow table, navy text). The extension
  measures the contrast of every text element inside authored content and
  flips the text colour only where the dark theme caused the clash.
- **One font everywhere.** Lato (bundled, with Turkish characters), the
  system font, or the theme's own font. Icon fonts, code and maths are left
  alone.
- **Coloured activity icons by purpose**: assessment pink, content blue,
  collaboration purple, communication green, interactive content orange.
  Third-party modules such as Turnitin are put in the right group.
- **Course index drawer with icons and indentation.** Section titles are
  separated from activities; file-type icons (PDF, DOCX) are learned on the
  course page and cached.
- **Parsed course titles.** Names like `EE 203 | Digital Circuits and Systems
  2526G | Özgür Doruk` are shown as code, name, term and teacher on course
  cards, the course heading, the index drawer and the browser tab.
- **Single-column My courses.** One course per row with its image on the
  left. Images set by teachers are shown whole (never cropped, never covered
  by text); courses without an image keep Moodle's pattern.
- **Every course on the home page.** The site home list stops at 20 courses;
  the extension fetches the rest through the same web service that the My
  courses page uses.
- **Turkish letters in name filters.** With Moodle in English, the first /
  last name letter bars on the Participants page get Ç, Ğ, İ, Ö, Ş and Ü.
  Moodle only accepts letters of the current language's alphabet
  (`set_initials_preferences` in `lib/tablelib.php`), so these letters filter
  in the browser: all rows are loaded on one page and non-matching rows are
  hidden. Tables that paginate on the server (assignment grading, reports)
  are left alone. A site administrator can fix this for every table by adding
  the letters to the English `alphabet` string under *Language customisation*
  (`langconfig`).
- **Full name sorting.** The Participants table sorts by one name field, so
  people with the same surname came back in database order. The table is
  switched to a two-key sort (last name, then first name, or the reverse),
  which Moodle supports and then keeps by itself. `content/page-bridge.js`
  is injected into the page to call `core_table/dynamic.refreshTableContent`,
  since content scripts cannot reach Moodle's AMD modules.
- **Initials instead of the default photo.** Moodle's grey silhouette
  (core `u/f1`, `u/f2`, `u/f3`) is replaced everywhere with an initials badge
  that matches Moodle's own `.userinitials` (participants, profile), all in
  one theme-coloured style. The name comes from the image's alt text.
- **Less clutter**: no header photo or hero carousel, no footer, no 830px
  width cap, tighter rows, and a primary menu without the theme's custom
  dropdowns (a direct My courses link is added instead).
- **Settings popup** and a bilingual **user guide** (English and Turkish).
  Every feature can be switched on or off; settings sync with your browser
  profile and apply without reloading the page.

## Installation

### Install from a store

A store install updates itself. Listings still in review get their link here
once they are approved.

- **Firefox** (desktop and Android): Firefox Add-ons, link to follow.
- **Microsoft Edge**: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/hbcmkodmepmcccnhdjeghejemnemgngc)
- **Opera**: Opera Add-ons, link to follow.

Safari is not supported.

### Chrome, Brave, Vivaldi: manual installation

There is no Chrome Web Store version: Google charges developers a
registration fee for it, and this is a free, volunteer project. Chrome, Brave
and Vivaldi users load the extension unpacked instead. The same steps work in
every Chromium-based browser, so Edge and Opera users can also use them until
the store links are live, and developers can use them to try changes from
this repository:

1. **Download.** On this GitHub page click **Code → Download ZIP**, or use
   [this direct link](https://github.com/ecerci-atilim/atilim-moodle-theme-fix/archive/refs/heads/main.zip).
   If you use git: `git clone https://github.com/ecerci-atilim/atilim-moodle-theme-fix.git`.
2. **Extract** the ZIP somewhere permanent (not the Downloads folder you
   clean up). The browser loads the extension from this folder every time it
   starts, so do not delete or move it afterwards.
3. **Open the extensions page**: `chrome://extensions` in Chrome,
   `brave://extensions` in Brave, `vivaldi://extensions` in Vivaldi,
   `edge://extensions` in Edge, `opera://extensions` in Opera.
4. **Turn on Developer mode** (a switch in the top right corner; in Edge it is
   in the left sidebar).
5. Click **Load unpacked** and select the folder that directly contains
   `manifest.json`. A ZIP from GitHub extracts to
   `atilim-moodle-theme-fix-main/`; if the browser reports that the manifest
   is missing, you selected a folder one level too high.
6. **Pin the extension**: click the puzzle icon in the toolbar and pin
   *UI Fix for Atılım Moodle*. Its icon opens the settings.
7. **Reload** any open moodle.atilim.edu.tr tab.

The user guide opens automatically after the first install. It can be opened
again from the **User guide** link in the settings popup.

### Updating

Store installs update automatically. Unpacked extensions do not update
themselves.

- **ZIP install**: download the ZIP again, replace the contents of your
  extension folder with the new files, then press the **reload** (circular
  arrow) button on the extension's card in `chrome://extensions`.
- **git install**: run `git pull` in the folder, then press **reload**.

Settings are kept across updates. The version number is shown in the
settings popup.

### Removing

Press **Remove** on the extension's card in `chrome://extensions`, then
delete the folder.

## Project layout

```
manifest.json          Manifest V3 definition
content/settings.js    Settings model; mirrors settings onto <html data-atm-*>
content/features.js    DOM features (titles, icons, menu, dark-mode contrast)
content/main.js        Entry point; one debounced MutationObserver
content/page-bridge.js Page-world helper that reloads Moodle tables on request
styles/base.css        Colour palette (CSS custom properties), font, shared bits
styles/layout.css      Page skeleton, header strip, secondary navigation
styles/navbar.css      Top bar
styles/dashboard.css   Dashboard and My courses cards
styles/course.css      Course page, sections, activity rows, icon colours
styles/courseindex.css Course index drawer
styles/activity.css    Forum, assignment, quiz, resource, Turnitin pages
styles/forms.css       Buttons, forms, dropdowns, modals, Atto editor
styles/tables.css      Participants, gradebook, calendar tables
styles/messages.css    Messaging drawer
styles/editmode.css    Teacher edit mode
styles/dark.css        Dark palette and dark-only fixes
popup/                 Settings popup
guide/                 User guide page (English / Turkish)
background.js          Service worker; opens the guide after the first install
fonts/                 Lato (latin + latin-ext subsets, SIL Open Font License)
icons/                 Extension icon
scripts/build.py       Builds the Chrome and Firefox store packages into dist/
store/                 Store listing texts, screenshots, publishing steps
PRIVACY.md             Privacy policy (no data is collected)
```

## How it works

Every CSS rule is keyed on an attribute of `<html>` such as
`data-atm-theme="dark"` or `data-atm-compact="1"`. `content/settings.js` runs
at `document_start`, reads a synchronous copy of the settings from
`localStorage` (so the dark theme does not flash white), then the real value
from `chrome.storage.sync`, and writes the attributes. Changing a setting in
the popup therefore takes effect immediately.

Colours are defined only in `styles/base.css` and `styles/dark.css`; all other
files use `var(--atm-...)`. To change the palette, edit those two files.

Contrast fixes for authored content are stored as `data-atm-fg` marks on the
affected elements. The rules that use them are scoped to the dark theme, and
the marks are cleared and recomputed whenever the theme changes.

## Development

After editing files, press the **reload** button of the extension on
`chrome://extensions` and reload the Moodle tab. The site runs Moodle 4.5
(Bootstrap 4) with the Stream theme, a Boost child theme; the selectors are
written for that markup.

`python scripts/build.py` packs the store uploads into `dist/`: one ZIP for
the Chromium stores (Edge, Opera) and one for Firefox, whose manifest gets a
background script instead of a service worker and the `gecko` add-on ID.
Publishing steps and store texts are in [store/PUBLISHING.md](store/PUBLISHING.md).

## License

[MIT](LICENSE). The bundled Lato font is licensed separately under the SIL
Open Font License 1.1 ([fonts/OFL.txt](fonts/OFL.txt)).
