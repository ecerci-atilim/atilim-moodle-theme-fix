# Publishing to the stores

How to put the extension on the Chrome Web Store and Firefox Add-ons (AMO)
so students can install it from a store link and receive updates
automatically. All texts to paste are in [listing.md](listing.md).

Accounts, payments and the final *Submit* clicks have to be done by the
publisher personally.

## 0. Build the packages

```bash
python scripts/build.py
```

This creates, in `dist/`:

- `atilim-moodle-ui-fix-<version>-chrome.zip`: Chrome Web Store (also
  usable for Edge Add-ons and Opera Add-ons)
- `atilim-moodle-ui-fix-<version>-firefox.zip`: Firefox Add-ons

Optional checks before uploading:

```bash
npx web-ext lint --source-dir <the unzipped firefox package>
```

In Firefox, `about:debugging` → *This Firefox* → *Load Temporary Add-on…*
→ pick `manifest.json` inside the unzipped Firefox package, then open
<https://moodle.atilim.edu.tr/course/index.php>: the page should turn grey
with the Lato font. (Temporary add-ons disappear when Firefox restarts.)

## 1. Chrome Web Store

Covers Chrome, Brave, Vivaldi, Edge and Opera users (see section 3).

1. **Developer account.** Go to the
   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole),
   sign in with the Google account that should own the listing (2-Step
   Verification must be on), accept the developer agreement and pay the
   one-time registration fee (US$5).
2. **Account tab.** Set the publisher name shown on the listing, verify the
   contact e-mail address, and answer the trader question. A free,
   non-commercial project like this one is normally a *non-trader*.
3. **New item.** Click *New item* and upload the `-chrome.zip`.
4. **Store listing tab.**
   - Description: the *Detailed description* from listing.md.
   - Category: *Education*. Language: *English*.
   - Store icon: `icons/icon128.png`.
   - Screenshots: the four files in `store/screenshots/`.
   - Small promo tile: `store/promo-tile-440x280.png`.
   - Homepage URL and Support URL: see *Links* in listing.md.
5. **Privacy practices tab.** Fill in single purpose, the two permission
   justifications, *No remote code*, leave all data types unticked, tick
   the three certifications, and paste the privacy policy URL. All texts
   are in listing.md.
6. **Distribution tab.**
   - Visibility: *Public* (anyone can find it) or *Unlisted* (only people
     with the link can install it; still updates automatically). Either way
     the store link can be shared with students.
   - Regions: all regions.
7. **Submit for review.** Reviews usually take from a few days to a couple
   of weeks. You get an e-mail when it is published.
8. **The store link** is
   `https://chromewebstore.google.com/detail/<item-id>`; the item ID is
   shown in the dashboard.

## 2. Firefox Add-ons (AMO)

1. **Account.** Go to the
   [Add-on Developer Hub](https://addons.mozilla.org/developers/) and sign in
   with a Firefox account (free). Accept the developer agreement the first
   time.
2. **Submit a New Add-on.** Choose **On this site** (a listed add-on: it gets
   a public addons.mozilla.org page, which is the store link). *On your own*
   only signs a file for self-distribution and gives no store page.
3. **Upload** the `-firefox.zip`. Compatibility: Firefox for desktop and
   Firefox for Android can both stay ticked.
4. **Source code question:** answer *No* (see listing.md).
5. **Describe the add-on.** Name, summary (the AMO one, max. 250
   characters), description, category *Appearance*, support links, privacy
   policy (AMO accepts the text itself: paste PRIVACY.md, or the URL), and a
   license. Then add the screenshots on the listing's *Edit* page
   (*Media*).
6. **Notes to reviewer:** paste the text from listing.md.
7. **Submit.** Listed add-ons are usually published within hours after an
   automatic review; a human review may follow later.
8. **The store link** is
   `https://addons.mozilla.org/firefox/addon/<slug>/`; the slug is chosen
   on the *Describe* step.

## 3. Other browsers

- **Edge:** users can install from the Chrome Web Store after clicking
  *Allow extensions from other stores* on the banner Edge shows there.
  Optionally publish to [Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/)
  too (free) with the same `-chrome.zip`.
- **Opera:** the Chrome Web Store link works; if Opera shows no install
  button, users first add *Install Chrome Extensions* from
  addons.opera.com. Publishing to [Opera Add-ons](https://addons.opera.com/developer/)
  (free, same `-chrome.zip`) is optional.
- **Brave, Vivaldi:** install straight from the Chrome Web Store.
- **Safari:** not supported.

## 4. After approval

Add the store links in two places so the README and the guide show them:

- `guide/guide.js`: the `STORE_LINKS` object (empty entries stay hidden).
- `README.md`: the *Install from a store* section.

## 5. Releasing an update

1. Raise `"version"` in `manifest.json` (stores reject an upload whose
   version is not higher than the published one).
2. `python scripts/build.py`
3. Chrome: open the item in the dashboard → *Package* → *Upload new package*
   → *Submit for review*.
4. AMO: the add-on's page in the Developer Hub → *Upload New Version*.

Users get the update automatically within a few hours of approval.

## If a review is rejected

The e-mail names the policy. Common cases for this extension:

- **Name / trademark:** use the fallback name from listing.md, rebuild with a
  higher version and upload again.
- **Permission or data questions:** reply with the justification texts in
  listing.md; the extension uses only `storage` and one host.
