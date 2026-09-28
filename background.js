/*
 * Service worker. Its only job: open the user guide once, right after the
 * extension is first installed (not on updates or browser restarts).
 */
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('guide/guide.html') });
  }
});
