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
- **Less clutter**: no header photo or hero carousel, no footer, no 830px
  width cap, tighter rows, and a primary menu without the theme's custom
  dropdowns (Dashboard and My courses are added instead).
- **Settings popup.** Every feature can be switched on or off. Settings sync
  with your Chrome profile and apply without reloading the page.

## Installation

1. Download this folder (as a zip, or `git clone`).
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** in the top right corner.
4. Click **Load unpacked** and select this folder.
5. Reload moodle.atilim.edu.tr. Click the extension icon in the toolbar to
   change settings.

The same steps work in Edge, Brave and other Chromium-based browsers.

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
