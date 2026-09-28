/*
 * Giriş noktası. document_start'ta yüklenir; body hazır olunca özellikleri
 * çalıştırır ve DOM değişikliklerini tek bir debounce'lu observer ile izler
 * (Moodle ders dizinini ve etkinlik kartlarını sık sık yeniden çizer).
 */
(function () {
  'use strict';

  const ATM = window.__atm;
  if (!ATM || document.documentElement.getAttribute('data-atm-booted')) return;
  document.documentElement.setAttribute('data-atm-booted', '1');

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      ATM.runFeatures();
    });
  }

  function init() {
    ATM.runFeatures();
    ATM.ready.then(ATM.runFeatures);

    const observer = new MutationObserver(function (mutations) {
      // Kendi eklediğimiz düğümler yeni bir tur tetiklemesin.
      for (let i = 0; i < mutations.length; i++) {
        const target = mutations[i].target;
        if (target && target.nodeType === 1 && target.closest && target.closest('.atm-ct, .atm-ci-icon, .atm-brand')) continue;
        schedule();
        return;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('atm:settings', schedule);

    // Ayar değişikliğinde sekme başlığını yeniden kur.
    document.addEventListener('atm:settings', function () {
      if (!ATM.settings.smartTitles) return;
      document.documentElement.removeAttribute('data-atm-title-done');
      schedule();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
