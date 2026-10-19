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
    turkishInitials: true,
    nameSort: true,
    initialsAvatars: true,
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

  // Firefox lets users withhold host access (and Chrome's "site access"
  // menu can do the same); without it the content scripts never run.
  // permissions.request needs a user gesture, hence the button.
  const SITE = { origins: ['https://moodle.atilim.edu.tr/*'] };
  const access = document.getElementById('access');
  function checkAccess() {
    try {
      chrome.permissions.contains(SITE, function (ok) {
        access.hidden = !!ok || !!chrome.runtime.lastError;
      });
    } catch (e) { /* permissions API unavailable: assume granted */ }
  }
  document.getElementById('grant').addEventListener('click', function () {
    chrome.permissions.request(SITE, function (granted) {
      if (granted) {
        access.hidden = true;
        flash('Allowed, reload Moodle');
      }
    });
  });
  checkAccess();

  chrome.storage.sync.get(KEY, function (data) {
    if (!chrome.runtime.lastError && data && data[KEY]) {
      Object.keys(DEFAULTS).forEach(function (k) {
        if (k in data[KEY]) current[k] = data[KEY][k];
      });
    }
    render();
  });
})();
