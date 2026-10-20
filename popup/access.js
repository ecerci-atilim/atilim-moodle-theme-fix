/* Host access check for the settings popup.

   Firefox lets users withhold host access, and then the content scripts
   never run. When access is missing the popup shows a banner whose button
   asks for it again (permissions.request needs a user gesture).

   Only the Firefox package and the repository contain this file:
   scripts/build.py leaves it out of the Chromium package, where host
   access is granted at install and the Opera store's checker flags the
   permissions API. */
(function () {
  'use strict';

  const SITE = { origins: ['https://moodle.atilim.edu.tr/*'] };
  const access = document.getElementById('access');
  const status = document.getElementById('status');

  try {
    chrome.permissions.contains(SITE, function (ok) {
      access.hidden = !!ok || !!chrome.runtime.lastError;
    });
  } catch (e) { return; /* permissions API unavailable: assume granted */ }

  document.getElementById('grant').addEventListener('click', function () {
    chrome.permissions.request(SITE, function (granted) {
      if (granted) {
        access.hidden = true;
        status.textContent = 'Allowed, reload Moodle';
      }
    });
  });
})();
