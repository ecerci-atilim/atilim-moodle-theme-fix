/*
 * Settings layer.
 *
 * Every setting is mirrored onto <html> as a data-atm-* attribute and the
 * stylesheets only look at those attributes. A change made in the popup is
 * therefore applied instantly, without reloading the page.
 *
 * Runs at document_start: a synchronous copy in localStorage is read first
 * (so the dark theme does not flash white), then the real value arrives from
 * chrome.storage.sync.
 */
(function () {
  'use strict';

  const ATM = (window.__atm = window.__atm || {});

  ATM.DEFAULTS = Object.freeze({
    theme: 'light',        // light | dark | auto
    font: 'lato',          // lato | system | theme (leave the theme's font alone)
    fullWidth: true,       // lift the "limitedwidth" cap
    hideHero: true,        // hide the site-home carousel and the header photo
    hideFooter: true,      // hide the page footer
    compact: true,         // tighter rows, less whitespace
    courseList: true,      // My courses as a single column, one row per course
    allCourses: true,      // show every enrolled course in the home page list
    turkishInitials: true, // add Ç Ğ İ Ö Ş Ü to name initials bars in the English UI
    nameSort: true,        // sort participants by last name then first name (or the reverse)
    initialsAvatars: true, // initials badge instead of the default profile picture
    colorIcons: true,      // colour activity icons by purpose
    indexIcons: true,      // add icons to the course index drawer
    smartTitles: true,     // split "CODE | Name TERM | Instructor" titles
    simplifyNav: true,     // hide the theme's custom menus, add My courses
    brandText: true        // replace the logo image with text
  });

  const FONTS = ['lato', 'system', 'theme'];
  const THEMES = ['light', 'dark', 'auto'];

  ATM.STORAGE_KEY = 'settings';
  ATM.LS_KEY = 'atm_settings_v3';
  ATM.settings = Object.assign({}, ATM.DEFAULTS);

  function attrName(key) {
    return 'data-atm-' + key.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); });
  }

  // Keeps only known keys with the right type and value.
  function sanitize(obj) {
    const out = {};
    if (!obj || typeof obj !== 'object') return out;
    for (const k of Object.keys(ATM.DEFAULTS)) {
      if (!(k in obj)) continue;
      const def = ATM.DEFAULTS[k];
      if (typeof def === 'boolean') out[k] = !!obj[k];
      else if (k === 'font' && FONTS.indexOf(obj[k]) !== -1) out[k] = obj[k];
      else if (k === 'theme' && THEMES.indexOf(obj[k]) !== -1) out[k] = obj[k];
    }
    return out;
  }

  ATM.resolvedTheme = function () {
    if (ATM.settings.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return ATM.settings.theme === 'dark' ? 'dark' : 'light';
  };

  ATM.applyAttrs = function () {
    const html = document.documentElement;
    const s = ATM.settings;
    html.setAttribute('data-atm', '1');
    html.setAttribute('data-atm-theme', ATM.resolvedTheme());
    html.setAttribute('data-atm-font', s.font);
    for (const k of Object.keys(ATM.DEFAULTS)) {
      if (typeof ATM.DEFAULTS[k] === 'boolean') {
        html.setAttribute(attrName(k), s[k] ? '1' : '0');
      }
    }
    document.dispatchEvent(new CustomEvent('atm:settings', { detail: Object.assign({}, s) }));
  };

  ATM.update = function (partial) {
    Object.assign(ATM.settings, sanitize(partial));
    try { localStorage.setItem(ATM.LS_KEY, JSON.stringify(ATM.settings)); } catch (e) { /* private window etc. */ }
    ATM.applyAttrs();
  };

  // 0. Bundled Lato. Declared from JS because the extension URL scheme
  //    differs per browser (chrome-extension:// vs moz-extension://), so it
  //    cannot be hard-coded in a stylesheet. The files are listed in
  //    web_accessible_resources.
  const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
  const LATIN_EXT = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';
  const FACES = [['normal', 400, 'lato-400'], ['italic', 400, 'lato-400-italic'], ['normal', 700, 'lato-700']];
  (function injectFonts() {
    if (document.getElementById('atm-fonts')) return;
    let css = '';
    try {
      FACES.forEach(function (f) {
        [['latin-ext', LATIN_EXT], ['latin', LATIN]].forEach(function (s) {
          css += "@font-face{font-family:'Lato';font-style:" + f[0] + ';font-weight:' + f[1] +
                 ';font-display:swap;src:url(' + chrome.runtime.getURL('fonts/' + f[2] + '-' + s[0] + '.woff2') +
                 ") format('woff2');unicode-range:" + s[1] + '}';
        });
      });
    } catch (e) { return; } // no extension context (e.g. a preview)
    const style = document.createElement('style');
    style.id = 'atm-fonts';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  })();

  // 1. Synchronous: the localStorage copy (prevents a white flash).
  try {
    const cached = JSON.parse(localStorage.getItem(ATM.LS_KEY) || 'null');
    if (cached) Object.assign(ATM.settings, sanitize(cached));
  } catch (e) { /* ignore */ }
  ATM.applyAttrs();

  // 2. Asynchronous: chrome.storage.sync is the source of truth.
  ATM.ready = new Promise(function (resolve) {
    try {
      chrome.storage.sync.get(ATM.STORAGE_KEY, function (data) {
        if (!chrome.runtime.lastError && data && data[ATM.STORAGE_KEY]) {
          ATM.update(data[ATM.STORAGE_KEY]);
        }
        resolve(ATM.settings);
      });
    } catch (e) {
      resolve(ATM.settings);
    }
  });

  // 3. Changes made in the popup.
  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area === 'sync' && changes[ATM.STORAGE_KEY]) {
        ATM.update(changes[ATM.STORAGE_KEY].newValue || {});
      }
    });
  } catch (e) { /* ignore */ }

  // 4. Follow the OS theme when theme is "auto".
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (ATM.settings.theme === 'auto') ATM.applyAttrs();
    });
  } catch (e) { /* ignore */ }
})();
