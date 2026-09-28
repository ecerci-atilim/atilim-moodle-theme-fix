# Atılım Moodle UI Fix

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
- **Less clutter**: no header photo or hero carousel, no footer, no 830px
  width cap, tighter rows, and a primary menu without the theme's custom
  dropdowns (a direct My courses link is added instead).
- **Settings popup** and a bilingual **user guide** (English and Turkish).
  Every feature can be switched on or off; settings sync with your browser
  profile and apply without reloading the page.

## Installation

The extension is not on the Chrome Web Store yet, so it is loaded as an
unpacked extension. This works in Chrome, Edge, Brave, Opera and other
Chromium-based browsers; Firefox and Safari are not supported.

1. **Download.** On this GitHub page click **Code → Download ZIP**, or use
   [this direct link](https://github.com/ecerci-atilim/atilim-moodle-theme-fix/archive/refs/heads/main.zip).
   If you use git: `git clone https://github.com/ecerci-atilim/atilim-moodle-theme-fix.git`.
2. **Extract** the ZIP somewhere permanent (not the Downloads folder you
   clean up). The browser loads the extension from this folder every time it
   starts, so do not delete or move it afterwards.
3. **Open the extensions page**: `chrome://extensions` in Chrome,
   `edge://extensions` in Edge, `brave://extensions` in Brave.
4. **Turn on Developer mode** (a switch in the top right corner; in Edge it is
   in the left sidebar).
5. Click **Load unpacked** and select the folder that directly contains
   `manifest.json`. A ZIP from GitHub extracts to
   `atilim-moodle-theme-fix-main/`; if the browser reports that the manifest
   is missing, you selected a folder one level too high.
6. **Pin the extension**: click the puzzle icon in the toolbar and pin
   *Atılım Moodle UI Fix*. Its icon opens the settings.
7. **Reload** any open moodle.atilim.edu.tr tab.

The user guide opens automatically after the first install. It can be opened
again from the **User guide** link in the settings popup.

### Updating

Unpacked extensions do not update themselves.

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
fonts/                 Lato (latin + latin-ext subsets)
icons/                 Extension icon
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
`chrome://extensions` and reload the Moodle tab. The site runs Moodle 4.4
(Bootstrap 4) with the Stream theme, a Boost child theme; the selectors are
written for that markup.
