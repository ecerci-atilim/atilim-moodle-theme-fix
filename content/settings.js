/*
 * Ayar katmanı.
 *
 * Bütün özellikler <html> üzerindeki data-atm-* özniteliklerine yazılır;
 * CSS dosyaları yalnızca bu özniteliklere bakar. Böylece popup'tan yapılan
 * bir değişiklik sayfa yenilenmeden, anında uygulanır.
 *
 * document_start'ta çalışır: önce localStorage'daki kopya senkron okunur
 * (koyu temada beyaz flaş olmasın diye), sonra chrome.storage.sync'ten
 * gerçek değer gelir.
 */
(function () {
  'use strict';

  const ATM = (window.__atm = window.__atm || {});

  ATM.DEFAULTS = Object.freeze({
    theme: 'light',        // light | dark | auto
    font: 'lato',          // lato | system
    fullWidth: true,       // limitedwidth kısıtını kaldır
    hideHero: true,        // başlık arka plan görselini ve carousel'i gizle
    hideFooter: true,      // sayfa altbilgisini gizle
    compact: true,         // daha sık satırlar, daha az boşluk
    colorIcons: true,      // etkinlik ikonlarını amacına göre renklendir
    indexIcons: true,      // soldaki ders dizinine ikon ekle
    smartTitles: true,     // "KOD | Ad DÖNEM | Eğitmen" başlıklarını ayrıştır
    simplifyNav: true,     // üst menüdeki tema linklerini gizle, Derslerim ekle
    brandText: true        // logoyu metinle değiştir
  });

  ATM.STORAGE_KEY = 'settings';
  ATM.LS_KEY = 'atm_settings_v3';
  ATM.settings = Object.assign({}, ATM.DEFAULTS);

  function attrName(key) {
    return 'data-atm-' + key.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); });
  }

  function sanitize(obj) {
    const out = {};
    if (!obj || typeof obj !== 'object') return out;
    for (const k of Object.keys(ATM.DEFAULTS)) {
      if (!(k in obj)) continue;
      const def = ATM.DEFAULTS[k];
      if (typeof def === 'boolean') out[k] = !!obj[k];
      else if (typeof obj[k] === 'string') out[k] = obj[k];
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
    html.setAttribute('data-atm-font', s.font === 'system' ? 'system' : 'lato');
    for (const k of Object.keys(ATM.DEFAULTS)) {
      if (typeof ATM.DEFAULTS[k] === 'boolean') {
        html.setAttribute(attrName(k), s[k] ? '1' : '0');
      }
    }
    document.dispatchEvent(new CustomEvent('atm:settings', { detail: Object.assign({}, s) }));
  };

  ATM.update = function (partial) {
    Object.assign(ATM.settings, sanitize(partial));
    try { localStorage.setItem(ATM.LS_KEY, JSON.stringify(ATM.settings)); } catch (e) { /* özel pencere vb. */ }
    ATM.applyAttrs();
  };

  // 1. Senkron: localStorage kopyası (flaş önleme).
  try {
    const cached = JSON.parse(localStorage.getItem(ATM.LS_KEY) || 'null');
    if (cached) Object.assign(ATM.settings, sanitize(cached));
  } catch (e) { /* yoksay */ }
  ATM.applyAttrs();

  // 2. Asenkron: gerçek kaynak chrome.storage.sync.
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

  // 3. Popup'tan gelen değişiklikler.
  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area === 'sync' && changes[ATM.STORAGE_KEY]) {
        ATM.update(changes[ATM.STORAGE_KEY].newValue || {});
      }
    });
  } catch (e) { /* yoksay */ }

  // 4. Sistem teması değişirse (theme: auto).
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (ATM.settings.theme === 'auto') ATM.applyAttrs();
    });
  } catch (e) { /* yoksay */ }
})();
