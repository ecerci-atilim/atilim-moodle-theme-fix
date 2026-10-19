/*
 * Page-world bridge. Content scripts run in an isolated world and cannot
 * reach Moodle's AMD modules, so features.js injects this file as a normal
 * <script> and talks to it through DOM events.
 *
 * Event "atm:refresh-table" dispatched on (or inside) a dynamic table root:
 * re-fetches the table through core_table/dynamic.refreshTableContent, which
 * reads the root's data-table-* attributes, exactly like Moodle's own
 * sorting and filtering controls do.
 */
(function () {
  'use strict';
  if (window.__atmPageBridge) return;
  window.__atmPageBridge = true;

  function withRequire(fn) {
    if (typeof window.require === 'function') { fn(window.require); return; }
    window.addEventListener('load', function () {
      if (typeof window.require === 'function') fn(window.require);
    }, { once: true });
  }

  document.addEventListener('atm:refresh-table', function (e) {
    const root = e.target && e.target.closest && e.target.closest('[data-region="core_table/dynamic"]');
    if (!root) return;
    withRequire(function (req) {
      req(['core_table/dynamic'], function (Dynamic) {
        Dynamic.refreshTableContent(root).catch(function (err) {
          if (window.console) console.warn('[ATM] table refresh failed', err);
        });
      });
    });
  });

  document.documentElement.setAttribute('data-atm-bridge', 'ready');
})();
