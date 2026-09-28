/*
 * Entry point. Loaded at document_start; once the body exists it runs the
 * features and watches the DOM with a single debounced observer (Moodle
 * re-renders the course index and activity cards frequently).
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
      // Nodes we inserted ourselves must not trigger another round.
      for (let i = 0; i < mutations.length; i++) {
        const target = mutations[i].target;
        if (target && target.nodeType === 1 && target.closest && target.closest('.atm-ct, .atm-ci-icon, .atm-brand')) continue;
        schedule();
        return;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('atm:settings', function () {
      // Rebuild the tab title when smart titles are (re)enabled.
      if (ATM.settings.smartTitles) document.documentElement.removeAttribute('data-atm-title-done');
      schedule();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
