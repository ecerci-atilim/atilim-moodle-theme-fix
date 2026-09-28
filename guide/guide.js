/*
 * User guide page: language switch (English by default, Turkish on request)
 * and a theme that follows the extension's own setting.
 *
 * Query overrides (handy for linking and previews): ?lang=tr, ?theme=dark.
 */
(function () {
  'use strict';

  const html = document.documentElement;
  const params = new URLSearchParams(location.search);
  const LANG_KEY = 'atm_guide_lang';

  /* ---------------- language ---------------- */

  function setLang(lang) {
    if (lang !== 'tr') lang = 'en';
    html.lang = lang;
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === lang ? 'true' : 'false');
    });
    document.title = lang === 'tr'
      ? 'Atılım Moodle UI Fix – Kullanım kılavuzu'
      : 'Atılım Moodle UI Fix – User guide';
  }

  let initialLang = params.get('lang');
  if (!initialLang) {
    try { initialLang = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
  }
  setLang(initialLang || 'en');

  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      const lang = b.getAttribute('data-set-lang');
      setLang(lang);
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
    });
  });

  /* ---------------- theme ---------------- */

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let themeSetting = params.get('theme') || 'light';

  function applyTheme() {
    const dark = themeSetting === 'dark' || (themeSetting === 'auto' && media.matches);
    html.setAttribute('data-atm-theme', dark ? 'dark' : 'light');
  }
  applyTheme();
  media.addEventListener('change', applyTheme);

  const hasStorage = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync;
  if (hasStorage && !params.get('theme')) {
    chrome.storage.sync.get('settings', function (data) {
      const s = data && data.settings;
      if (s && s.theme) { themeSetting = s.theme; applyTheme(); }
    });
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area === 'sync' && changes.settings && changes.settings.newValue) {
        themeSetting = changes.settings.newValue.theme || 'light';
        applyTheme();
      }
    });
  } else if (!hasStorage && !params.get('theme')) {
    // Outside the extension there is no saved setting; follow the system.
    themeSetting = 'auto';
    applyTheme();
  }

  /* ---------------- version ---------------- */

  try {
    document.getElementById('version').textContent = 'v' + chrome.runtime.getManifest().version;
  } catch (e) { /* not running as an extension page */ }
})();
