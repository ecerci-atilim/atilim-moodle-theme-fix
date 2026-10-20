# Publishing to the stores

How to put the extension on Firefox Add-ons (AMO), Microsoft Edge Add-ons and
Opera Add-ons so students can install it from a store link and receive
updates automatically. All three are free. All texts to paste are in
[listing.md](listing.md).

There is no Chrome Web Store listing, by choice: it charges a developer
registration fee, and this is a free, volunteer project. Chrome, Brave and
Vivaldi users install the extension manually, as described in the README and
the user guide.

Accounts and the final *Submit* clicks have to be done by the publisher
personally.

## 0. Build the packages

```bash
python scripts/build.py
```

This creates, in `dist/`:

- `atilim-moodle-ui-fix-<version>-chromium.zip`: Edge Add-ons and Opera
  Add-ons
- `atilim-moodle-ui-fix-<version>-firefox.zip`: Firefox Add-ons

Optional checks before uploading:

```bash
npx web-ext lint --source-dir <the unzipped firefox package>
```

In Firefox, `about:debugging` → *This Firefox* → *Load Temporary Add-on…*
→ pick `manifest.json` inside the unzipped Firefox package, then open
<https://moodle.atilim.edu.tr/course/index.php>: the page should turn grey
with the Lato font. (Temporary add-ons disappear when Firefox restarts.)

## 1. Firefox Add-ons (AMO)

Firefox for desktop and Android.

1. **Account.** Go to the
   [Add-on Developer Hub](https://addons.mozilla.org/developers/) and sign in
   with a Mozilla account (free). Accept the developer agreement the first
   time.
2. **Submit a New Add-on.** Choose **On this site** (a listed add-on: it gets
   a public addons.mozilla.org page, which is the store link). *On your own*
   only signs a file for self-distribution and gives no store page.
3. **Upload** the `-firefox.zip`. Compatibility: Firefox for desktop and
   Firefox for Android can both stay ticked.
4. **Source code question:** answer *No* (see listing.md).
5. **Describe the add-on.** Name, summary (max. 250 characters),
   description, category *Appearance*, support links, privacy policy (AMO
   accepts the text itself: paste PRIVACY.md, or the URL) and the license (MIT).
   Add the screenshots afterwards on the listing's *Edit* page (*Media*).
6. **Notes to reviewer:** paste the text from listing.md.
7. **Submit.** Listed add-ons are usually published within hours after an
   automatic review; a human review may follow later.
8. **The store link** is
   `https://addons.mozilla.org/firefox/addon/<slug>/`; the slug is chosen
   on the *Describe* step.

## 2. Microsoft Edge Add-ons

Microsoft Edge only (Edge Add-ons cannot be installed in other browsers).

1. **Account.** Sign in to
   [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/public/login)
   with a personal Microsoft account (Outlook/Hotmail/Live) or a GitHub
   account; university work/school accounts are not accepted. Fill in the
   *Edge Developer Account Registration* form: country, account type
   **Individual**, publisher display name (shown on the listing), contact
   info; accept the agreement and *Finish*. There is no registration fee.
   Individual accounts are verified quickly.
2. **Create new extension** and upload the `-chromium.zip`. Name and short
   description come from the package.
3. **Availability:** visibility **Public** (searchable) or **Hidden** (only
   people with the link can find it; still updates automatically). Markets:
   all.
4. **Properties:** category (see listing.md), website and support URL
   (*Links* in listing.md). Leave *Mature content* unticked.
5. **Privacy:** single purpose, the two permission justifications, *No
   remote code*, no data types ticked, all certifications ticked, privacy
   policy URL. All texts are in listing.md.
6. **Store listings → English → Edit details:**
   - Description: the detailed description from listing.md.
   - Extension logo: `store/logo-300x300.png`.
   - Small promotional tile: `store/promo-tile-440x280.png`.
   - Screenshots: the four files in `store/screenshots/` (640 × 480).
   - Search terms: from listing.md.
7. **Publish**, paste the reviewer notes into *Notes for certification*,
   **Publish** again. Certification takes up to seven business days.
8. **The store link** is shown on the extension's *Overview* page in Partner
   Center (`https://microsoftedge.microsoft.com/addons/detail/<id>`).

## 3. Opera Add-ons

Opera only. Opera reviews every submission by hand, and its queue is known to
be slow (weeks are common), so submit it early and do not wait for it.

1. **Account.** Sign in at
   [addons.opera.com/developer](https://addons.opera.com/developer/) with an
   Opera account (free) and accept the publishing terms.
2. **Upload** the `-chromium.zip` as a new extension. If the uploader rejects
   the Manifest V3 package, skip Opera for now: Opera users can use the
   manual installation like Chrome users.
3. **Listing:** summary and description from listing.md, category
   *Appearance*, at most **three** screenshots (Opera refuses the submission
   with more; use 1, 2 and 3), homepage and support URL, privacy policy URL. If an icon is asked for, use
   `store/icon-64x64.png` or `icons/icon128.png`.
   **License:** give MIT
   (`https://github.com/ecerci-atilim/atilim-moodle-theme-fix/blob/main/LICENSE`);
   without one, Opera publishes the extension under CC BY-NC-ND 4.0.
4. **Notes for the moderator:** paste the reviewer notes from listing.md (they
   state that the code is not minified and where the source is).
5. **Submit for moderation.** The store link is
   `https://addons.opera.com/extensions/details/<slug>/`.

## 4. Chrome, Brave, Vivaldi

No store. Users download the ZIP from GitHub and load it unpacked; the README
and the user guide walk them through it (about a minute). The extension
then does not update itself, so tell students to repeat the download when a
new version is announced.

## 5. After approval

Add the store links in two places so the README and the guide show them:

- `guide/guide.js`: the `STORE_LINKS` object (empty entries stay hidden).
- `README.md`: the *Install from a store* section.

## 6. Releasing an update

1. Raise `"version"` in `manifest.json` (stores reject an upload whose
   version is not higher than the published one).
2. `python scripts/build.py`
3. AMO: the add-on's page in the Developer Hub → *Upload New Version*.
4. Edge: the extension in Partner Center → *Packages* → upload the new
   `-chromium.zip` → *Publish*.
5. Opera: the extension's page in the developer dashboard → upload a new
   version.

Users get the update automatically after approval.

## If a review is rejected

The e-mail names the policy. Common cases for this extension:

- **Permission or data questions:** reply with the justification texts in
  listing.md; the extension uses only `storage` and one host.
- **Name or trademark:** the name already uses the "… for X" form; if a
  reviewer still objects, add "(unofficial)" to `"name"` in
  `manifest.json`, raise the version, rebuild and upload again.
