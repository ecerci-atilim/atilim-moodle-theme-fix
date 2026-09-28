/* Settings popup: reads and writes the "settings" object in
   chrome.storage.sync. Keys must match DEFAULTS in content/settings.js. */
(function () {
  'use strict';

  const DEFAULTS = {
    theme: 'light',
    font: 'lato',
    fullWidth: true,
    hideHero: true,
    hideFooter: true,
    compact: true,
    courseList: true,
    allCourses: true,
    colorIcons: true,
    indexIcons: true,
    smartTitles: true,
    simplifyNav: true,
    brandText: true
  };
  const KEY = 'settings';

  const controls = Array.from(document.querySelectorAll('[data-key]'));
  const status = document.getElementById('status');
  let current = Object.assign({}, DEFAULTS);
  let statusTimer = null;

  function render() {
    controls.forEach(function (el) {
      const k = el.dataset.key;
      if (el.type === 'checkbox') el.checked = !!current[k];
      else el.value = current[k];
    });
  }

  function flash(msg) {
    status.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { status.textContent = ''; }, 1500);
  }

  function save() {
    const obj = {};
    obj[KEY] = current;
    chrome.storage.sync.set(obj, function () {
      flash(chrome.runtime.lastError ? 'Could not save' : 'Saved');
    });
  }

  controls.forEach(function (el) {
    el.addEventListener('change', function () {
      const k = el.dataset.key;
      current[k] = el.type === 'checkbox' ? el.checked : el.value;
      save();
    });
  });

  document.getElementById('reset').addEventListener('click', function () {
    current = Object.assign({}, DEFAULTS);
    render();
    save();
  });

  try {
    document.getElementById('version').textContent = 'v' + chrome.runtime.getManifest().version;
  } catch (e) { /* ignore */ }

  chrome.storage.sync.get(KEY, function (data) {
    if (!chrome.runtime.lastError && data && data[KEY]) {
      Object.keys(DEFAULTS).forEach(function (k) {
        if (k in data[KEY]) current[k] = data[KEY][k];
      });
    }
    render();
  });
})();
