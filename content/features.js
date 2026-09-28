/*
 * Features that touch the DOM. Every feature is idempotent: it can run many
 * times on the same page and never re-processes an element it already
 * marked. main.js runs them on load and after every (debounced) DOM change.
 */
(function () {
  'use strict';

  const ATM = window.__atm;
  const F = (ATM.features = {});

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  function on(key) { return !!ATM.settings[key]; }

  function isTurkish() { return document.body && document.body.classList.contains('lang-tr'); }

  function t(tr, en) { return isTurkish() ? tr : en; }

  // Course id: the body class "course-1225" is the most reliable source.
  // course-1 is the site itself, not a course.
  ATM.courseId = function () {
    const m = document.body && document.body.className.match(/\bcourse-(\d+)\b/);
    if (!m || m[1] === '1') return null;
    return m[1];
  };

  // Theme name and revision, read from the stylesheet URL (a content script
  // cannot see the page's M.cfg object).
  let themeInfo = null;
  function getThemeInfo() {
    if (themeInfo) return themeInfo;
    const link = document.querySelector('link[rel="stylesheet"][href*="/theme/styles.php/"]');
    const m = link && link.href.match(/\/theme\/styles\.php\/(\w+)\/(\d+)/);
    themeInfo = m ? { theme: m[1], rev: m[2] } : { theme: 'stream', rev: '-1' };
    return themeInfo;
  }

  // Module name -> Moodle "purpose" group (Boost colours icons by purpose).
  // Also used to fix third-party modules that Stream files under "other".
  const PURPOSE = {
    assign: 'assessment', quiz: 'assessment', workshop: 'assessment', turnitintooltwo: 'assessment',
    lesson: 'interactivecontent', h5pactivity: 'interactivecontent', scorm: 'interactivecontent', hvp: 'interactivecontent',
    resource: 'content', url: 'content', page: 'content', book: 'content', folder: 'content', imscp: 'content', label: 'content',
    forum: 'collaboration', wiki: 'collaboration', glossary: 'collaboration', data: 'collaboration',
    chat: 'communication', choice: 'communication', feedback: 'communication', survey: 'communication',
    bigbluebuttonbn: 'communication', zoom: 'communication', questionnaire: 'communication',
    attendance: 'administration', checklist: 'administration', certificate: 'administration', customcert: 'administration',
    lti: 'other'
  };
  const PURPOSES = ['assessment', 'content', 'collaboration', 'communication', 'administration', 'interactivecontent', 'interface', 'other'];

  function modnameOf(li) {
    const cls = [].slice.call(li.classList).find(function (x) { return x.indexOf('modtype_') === 0; });
    return cls ? cls.slice(8) : '';
  }

  function purposeOf(container) {
    return PURPOSES.find(function (p) { return container.classList.contains(p); }) || null;
  }

  function modIconUrl(modname) {
    const ti = getThemeInfo();
    return location.origin + '/theme/image.php/' + ti.theme + '/' + modname + '/' + ti.rev + '/monologo?filtericon=1';
  }

  /* ------------------------------------------------------------------ */
  /* 1. Navbar: text instead of the logo image                           */
  /* ------------------------------------------------------------------ */

  F.brandText = function () {
    const brand = document.querySelector('a.navbar-brand');
    if (!brand || brand.querySelector('.atm-brand')) return;
    const span = document.createElement('span');
    span.className = 'atm-brand';
    span.textContent = t('Atılım Üniversitesi', 'Atılım University');
    brand.appendChild(span);
  };

  /* ------------------------------------------------------------------ */
  /* 2. Navbar: flag the theme's custom menus, add a My courses link     */
  /* ------------------------------------------------------------------ */

  // Primary menu links that stay visible; everything else (the theme's
  // dropdown-only menus such as Instructor, Student, FAQ) is flagged and
  // hidden by navbar.css.
  const KEEP_NAV = [/^\/?$/, /^\/my\/?$/, /^\/my\/courses\.php/, /^\/calendar\//, /^\/course\/index\.php/];

  F.simplifyNav = function () {
    const nav = document.querySelector('.primary-navigation .moremenu ul.navbar-nav, .primary-navigation ul.navbar-nav');
    if (!nav) return;
    let changed = false;

    nav.querySelectorAll('li.nav-item:not([data-atm-nav])').forEach(function (li) {
      li.setAttribute('data-atm-nav', '1');
      const a = li.querySelector('a.nav-link');
      if (!a) return;
      if (li.classList.contains('dropdownmoremenu')) return; // the "More" overflow menu itself
      let path;
      try { path = new URL(a.getAttribute('href') || '#', location.origin); } catch (e) { return; }
      const samePage = a.getAttribute('href') === '#' || path.origin !== location.origin;
      const keep = !samePage && KEEP_NAV.some(function (re) { return re.test(path.pathname); });
      if (!keep) { li.classList.add('atm-nav-extra'); changed = true; }
    });

    // Copies that Moodle already moved into the "More" dropdown.
    nav.querySelectorAll('.dropdownmoremenu .dropdown-item:not([data-atm-nav])').forEach(function (a) {
      a.setAttribute('data-atm-nav', '1');
      const href = a.getAttribute('href') || '#';
      let path;
      try { path = new URL(href, location.origin); } catch (e) { return; }
      const keep = href !== '#' && KEEP_NAV.some(function (re) { return re.test(path.pathname); });
      if (!keep) a.classList.add('atm-nav-extra');
    });

    if (!nav.querySelector('[data-atm-added]')) {
      const home = nav.querySelector('li.nav-item');
      // Only "My courses": on this site /my/ (Dashboard) redirects there anyway.
      const items = [
        { href: '/my/courses.php', label: t('Derslerim', 'My courses'), test: /^\/my\/courses\.php/ }
      ];
      let anchor = home;
      items.forEach(function (it) {
        const li = document.createElement('li');
        li.className = 'nav-item atm-nav-added';
        li.setAttribute('data-atm-added', '1');
        li.setAttribute('role', 'none');
        const a = document.createElement('a');
        const current = it.test.test(location.pathname);
        a.className = 'nav-link' + (current ? ' active' : '');
        if (current) a.setAttribute('aria-current', 'page');
        a.setAttribute('role', 'menuitem');
        a.href = it.href;
        a.textContent = it.label;
        li.appendChild(a);
        if (anchor && anchor.nextSibling) anchor.parentNode.insertBefore(li, anchor.nextSibling);
        else nav.appendChild(li);
        anchor = li;
      });
      changed = true;
    }

    // With the My courses menu item removed by the site admin, Moodle marks
    // "Home" as the current page on /my/courses.php. When our own link is the
    // current one, flag the others so navbar.css drops their highlight (the
    // DOM is left alone, so switching the setting off restores Moodle's state).
    if (nav.querySelector('.atm-nav-added .nav-link.active')) {
      nav.querySelectorAll('li.nav-item:not(.atm-nav-added) > .nav-link.active:not([data-atm-not-current])').forEach(function (a) {
        a.setAttribute('data-atm-not-current', '1');
      });
    }

    // Moodle's "more menu" measured the bar before our edits; a resize event
    // makes it re-run its overflow logic so "More" does not wrap to a new row.
    if (changed) window.dispatchEvent(new Event('resize'));
  };

  /* ------------------------------------------------------------------ */
  /* 3. Parse course titles: "CODE | Name TERM | Instructor"             */
  /* ------------------------------------------------------------------ */

  const TERM_RE = /\s*\b(\d{2}-?\d{2}\s?[A-ZİÜÖŞÇĞ])\b\s*$/; // 2526G, 2627F, 24-25Y

  // Words that mark a department or unit name, never a person's name.
  const NOT_A_PERSON = /(mühendisli|bölüm|fakülte|enstitü|okulu|merkez|engineering|department|faculty|school|laborator|portal|project|program)/i;

  ATM.parseCourseTitle = function (raw) {
    const text = String(raw || '').replace(/\s+/g, ' ').trim();
    const parts = text.split('|').map(function (p) { return p.trim(); }).filter(Boolean);
    if (parts.length < 2) return null;
    const code = parts[0];
    let term = null;
    let rest = parts.slice(1).map(function (p) {
      const m = p.match(TERM_RE);
      if (m) { term = m[1]; return p.slice(0, m.index).trim(); }
      return p;
    }).filter(Boolean);
    let instructor = null;
    if (rest.length >= 2) {
      const last = rest[rest.length - 1];
      const words = last.split(' ');
      if (!/\d/.test(last) && !NOT_A_PERSON.test(last) && words.length >= 2 && words.length <= 4 && last.length <= 40) {
        instructor = last;
        rest = rest.slice(0, -1);
      }
    }
    return { code: code, name: rest.join(' · '), term: term, instructor: instructor, full: text };
  };

  function richTitle(info, opts) {
    opts = opts || {};
    const root = document.createElement('span');
    root.className = 'atm-ct' + (opts.inline ? ' atm-ct-inline' : '');
    root.title = info.full;
    const code = document.createElement('span');
    code.className = 'atm-ct-code';
    code.textContent = info.code;
    root.appendChild(code);
    if (info.name) {
      const name = document.createElement('span');
      name.className = 'atm-ct-name';
      name.textContent = info.name;
      root.appendChild(name);
    }
    if (!opts.short && (info.term || info.instructor)) {
      const meta = document.createElement('span');
      meta.className = 'atm-ct-meta';
      if (info.term) {
        const term = document.createElement('span');
        term.className = 'atm-ct-term';
        term.textContent = info.term;
        meta.appendChild(term);
      }
      if (info.instructor) {
        const inst = document.createElement('span');
        inst.className = 'atm-ct-inst';
        inst.textContent = info.instructor;
        meta.appendChild(inst);
      }
      root.appendChild(meta);
    }
    return root;
  }

  // Keeps the original text in a hidden wrapper and appends the parsed
  // version next to it; CSS decides which one is visible, so switching the
  // setting off brings the original back without a reload.
  function enrich(el, info, opts) {
    if (!el || el.getAttribute('data-atm-rich')) return;
    el.setAttribute('data-atm-rich', '1');
    const orig = document.createElement('span');
    orig.className = 'atm-ct-orig';
    while (el.firstChild) orig.appendChild(el.firstChild);
    el.appendChild(orig);
    el.appendChild(richTitle(info, opts));
  }

  let courseInfoCache = null;
  ATM.currentCourseInfo = function () {
    if (courseInfoCache) return courseInfoCache;
    const cid = ATM.courseId();
    if (!cid) return null;
    let raw = null;
    const crumb = document.querySelector('.breadcrumb a[href*="/course/view.php?id=' + cid + '"]');
    if (crumb) raw = crumb.getAttribute('title') || crumb.textContent;
    if (!raw && document.body.classList.contains('path-course-view')) {
      const h1 = document.querySelector('#page-header .page-header-headings h1');
      if (h1) raw = h1.textContent;
    }
    if (!raw) {
      const heading = document.querySelector('[data-region="fixed-drawer"] .courseindexheading, #theme_boost-drawers-courseindex .courseindexheading');
      if (heading) raw = heading.textContent;
    }
    const info = raw ? ATM.parseCourseTitle(raw) : null;
    if (info) courseInfoCache = info;
    return info;
  };

  F.smartTitles = function () {
    if (!document.body) return;

    // a) Course cards on Dashboard / My courses. Moodle shortens long names
    //    ("Özgür ..."), so parse the full name from the title attribute.
    document.querySelectorAll('.course-card .coursename .multiline:not([data-atm-rich])').forEach(function (ml) {
      const visible = ml.querySelector('[aria-hidden="true"]') || ml;
      const sr = ml.querySelector('.sr-only');
      const full = ml.getAttribute('title') || (sr && sr.textContent) || visible.textContent;
      const info = ATM.parseCourseTitle(full);
      if (!info) { ml.setAttribute('data-atm-rich', '0'); return; }
      enrich(visible, info);
      ml.setAttribute('data-atm-rich', '1');
      const card = ml.closest('.course-card');
      if (card) card.classList.add('atm-rich-card');
    });

    // b) List view and other course lists
    document.querySelectorAll('.course-listitem .coursename .multiline:not([data-atm-rich]), [data-region="recentlyaccessedcourses-view"] .coursename:not([data-atm-rich])').forEach(function (el) {
      const visible = el.querySelector('[aria-hidden="true"]') || el;
      const info = ATM.parseCourseTitle(visible.textContent);
      if (!info) { el.setAttribute('data-atm-rich', '0'); return; }
      enrich(visible, info, { inline: true });
      el.setAttribute('data-atm-rich', '1');
    });

    const cid = ATM.courseId();
    if (!cid) return;
    const info = ATM.currentCourseInfo();
    if (!info) return;

    // c) Course page heading (h1)
    if (document.body.classList.contains('path-course-view')) {
      const h1 = document.querySelector('#page-header .page-header-headings h1:not([data-atm-rich])');
      if (h1 && ATM.parseCourseTitle(h1.textContent)) enrich(h1, ATM.parseCourseTitle(h1.textContent));
    }

    // d) Course link in the breadcrumb: short form
    document.querySelectorAll('.breadcrumb a[href*="/course/view.php?id=' + cid + '"]:not([data-atm-rich])').forEach(function (a) {
      const i = ATM.parseCourseTitle(a.textContent);
      if (i) enrich(a, i, { inline: true, short: true });
      else a.setAttribute('data-atm-rich', '0');
    });

    // e) Course index drawer heading: parsed title that links to the course
    const heading = document.querySelector('#theme_boost-drawers-courseindex .courseindexheading:not([data-atm-rich])');
    if (heading) {
      const i = ATM.parseCourseTitle(heading.textContent);
      heading.setAttribute('data-atm-rich', '1');
      const link = document.createElement('a');
      link.className = 'atm-index-title';
      link.href = '/course/view.php?id=' + cid;
      link.title = (i && i.full) || heading.textContent.trim();
      if (i) {
        link.appendChild(richTitle(i, { short: true }));
      } else {
        link.textContent = heading.textContent.trim();
      }
      const orig = document.createElement('span');
      orig.className = 'atm-ct-orig';
      while (heading.firstChild) orig.appendChild(heading.firstChild);
      heading.appendChild(orig);
      heading.appendChild(link);
    }

    // f) Tab title: "Grader report | EE209 | Laboratory | ... | Anasayfa"
    //    becomes "Grader report · EE209 · Laboratory".
    if (!document.documentElement.getAttribute('data-atm-title-done')) {
      document.documentElement.setAttribute('data-atm-title-done', '1');
      let title = document.title.replace(/\s*\|\s*Anasayfa\s*$/i, '').replace(/^Course:\s*/i, '');
      const full = info.full;
      if (full && title.indexOf(full) !== -1) {
        title = title.replace(full, info.code + (info.name ? ' · ' + info.name : ''));
      } else {
        title = title.replace(/\s*\|\s*/g, ' · ');
      }
      document.title = title;
    }
  };

  /* ------------------------------------------------------------------ */
  /* 4. Icons in the course index drawer                                 */
  /* ------------------------------------------------------------------ */

  let iconCache = null;      // from chrome.storage.local: { cmid: {src, purpose} }
  let iconCacheCourse = null;
  let iconCacheDirty = false;

  // Icons as rendered on the course page itself; this is the only place
  // where file-type icons (pdf, docx) are visible, so they are cached.
  function liveIconMap() {
    const map = {};
    document.querySelectorAll('li.activity[data-id]').forEach(function (li) {
      const container = li.querySelector('.activityiconcontainer');
      const img = container && container.querySelector('img.activityicon');
      if (!img) return;
      const modname = modnameOf(li);
      let purpose = purposeOf(container);
      if ((!purpose || purpose === 'other') && PURPOSE[modname]) purpose = PURPOSE[modname];
      map[li.getAttribute('data-id')] = { src: img.getAttribute('src'), purpose: purpose || 'other' };
    });
    return map;
  }

  function loadIconCache(cid) {
    if (iconCacheCourse === cid) return;
    iconCacheCourse = cid;
    iconCache = {};
    try {
      chrome.storage.local.get('atm_icons_' + cid, function (data) {
        if (!chrome.runtime.lastError && data && data['atm_icons_' + cid]) {
          iconCache = data['atm_icons_' + cid];
          iconCacheDirty = true; // upgrade generic icons once the cache arrives
        }
      });
    } catch (e) { /* extension context gone (e.g. after an update) */ }
  }

  let saveTimer = null;
  function saveIconCache(cid, map) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        const obj = {};
        obj['atm_icons_' + cid] = map;
        chrome.storage.local.set(obj);
      } catch (e) { /* ignore */ }
    }, 800);
  }

  F.indexIcons = function () {
    const cid = ATM.courseId();
    if (!cid) return;
    loadIconCache(cid);

    const live = liveIconMap();
    if (Object.keys(live).length) {
      const merged = Object.assign({}, iconCache || {}, live);
      if (JSON.stringify(merged) !== JSON.stringify(iconCache)) {
        iconCache = merged;
        saveIconCache(cid, merged);
      }
    }

    document.querySelectorAll('.courseindex-item[data-for="cm"]').forEach(function (li) {
      const existing = li.querySelector('.atm-ci-icon');
      const cmid = li.getAttribute('data-id');
      const link = li.querySelector('a.courseindex-link');
      if (!link) return;
      const m = (link.getAttribute('href') || '').match(/\/mod\/([a-z0-9_]+)\//);
      const modname = m ? m[1] : null;
      const data = live[cmid] || (iconCache && iconCache[cmid]) || null;
      // Without cached data fall back to the module's generic icon.
      const src = data ? data.src : (modname ? modIconUrl(modname) : null);
      const purpose = (data && data.purpose) || (modname && PURPOSE[modname]) || 'other';
      if (!src) return;

      if (existing) {
        const img = existing.querySelector('img');
        if (iconCacheDirty && img && img.getAttribute('src') !== src) {
          img.setAttribute('src', src);
          PURPOSES.forEach(function (p) { existing.classList.remove(p); });
          existing.classList.add(purpose);
          li.setAttribute('data-atm-purpose', purpose);
        }
        return;
      }

      const wrap = document.createElement('span');
      wrap.className = 'atm-ci-icon activityiconcontainer ' + purpose;
      const img = document.createElement('img');
      img.className = 'activityicon';
      img.alt = '';
      img.setAttribute('src', src);
      wrap.appendChild(img);
      li.insertBefore(wrap, link);
      li.setAttribute('data-atm-purpose', purpose);
      if (modname) li.setAttribute('data-atm-mod', modname);
    });
    iconCacheDirty = false;
  };

  /* ------------------------------------------------------------------ */
  /* 5. Tag activity rows with their purpose (drives the coloured edge)  */
  /* ------------------------------------------------------------------ */

  F.tagActivities = function () {
    document.querySelectorAll('li.activity:not([data-atm-purpose])').forEach(function (li) {
      const c = li.querySelector('.activityiconcontainer');
      const modname = modnameOf(li);
      let purpose = c ? purposeOf(c) : null;
      if ((!purpose || purpose === 'other') && PURPOSE[modname]) purpose = PURPOSE[modname];
      purpose = purpose || 'other';
      li.setAttribute('data-atm-purpose', purpose);
      if (c && purposeOf(c) !== purpose) {
        PURPOSES.forEach(function (p) { c.classList.remove(p); });
        c.classList.add(purpose);
      }
    });
  };

  /* ------------------------------------------------------------------ */
  /* 6. Hide activity header boxes that only hold screen-reader text     */
  /* ------------------------------------------------------------------ */

  F.emptyHeaders = function () {
    document.querySelectorAll('.activity-header').forEach(function (h) {
      const visible = [].some.call(h.children, function (c) {
        if (c.classList.contains('sr-only')) return false;
        return c.textContent.trim() !== '' || !!c.querySelector('img, button, input, a, iframe, video');
      });
      if (visible) h.removeAttribute('data-atm-empty');
      else if (!h.hasAttribute('data-atm-empty')) h.setAttribute('data-atm-empty', '1');
    });
  };

  /* ------------------------------------------------------------------ */
  /* 7. Dark theme: fix contrast inside teacher-authored HTML            */
  /* ------------------------------------------------------------------ */

  // Teachers paint their own colours (a yellow table, navy text). On a dark
  // page two things break: our light text lands on their light background,
  // and their dark text lands on our dark background. For every text element
  // inside authored content we compute the contrast and flip the text colour
  // only when the clash is caused by the theme:
  //   author background + theme text   -> data-atm-fg="dark"
  //   theme background  + author text  -> data-atm-fg="light"
  // Author text on an author background is left exactly as written.
  // The marks are inert in light mode (dark.css scopes them to dark).

  const CONTENT_SELECTOR = [
    '.no-overflow', '.summarytext', '.activity-altcontent', '.activity-description',
    '.post-content-container', '.text_to_html', '.course-description-item',
    '.box.generalbox', '.block .content', '[data-region="post-content"]',
    '.editor_atto_content', '.contentwithoutlink', '.book_content', '.que .content'
  ].join(',');

  let checked = new WeakSet();
  let checkedTheme = null;

  function parseColor(c) {
    const m = c && c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }

  function luminance(c) {
    function ch(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
  }

  function contrast(a, b) {
    const l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  // Nearest ancestor-or-self with an opaque background.
  function backgroundOf(el) {
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) {
      const c = parseColor(getComputedStyle(x).backgroundColor);
      if (c && c.a > 0.5) return { color: c, el: x };
    }
    return { color: { r: 21, g: 23, b: 28, a: 1 }, el: document.documentElement };
  }

  // True when the author set a text colour on el or on an ancestor that is
  // still inside the content container.
  function authorColored(el, container) {
    for (let x = el; x && x !== container.parentElement; x = x.parentElement) {
      if ((x.style && x.style.color) || (x.tagName === 'FONT' && x.getAttribute('color'))) return true;
      if (x === container) break;
    }
    return false;
  }

  function hasOwnText(el) {
    for (let n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.textContent.trim()) return true;
    }
    return false;
  }

  // Marks computed under one theme are meaningless under another, so a theme
  // change clears them and everything is measured again.
  function resetDarkContent() {
    document.querySelectorAll('[data-atm-fg]').forEach(function (el) { el.removeAttribute('data-atm-fg'); });
    document.querySelectorAll('[data-atm-content]').forEach(function (el) { el.removeAttribute('data-atm-content'); });
    checked = new WeakSet();
  }

  F.darkContent = function () {
    const theme = ATM.resolvedTheme();
    if (theme !== checkedTheme) {
      if (checkedTheme !== null) resetDarkContent();
      checkedTheme = theme;
    }
    if (theme !== 'dark') return;
    // Colour transitions would make getComputedStyle report a value halfway
    // between the old and the new theme; switch them off while measuring.
    const html = document.documentElement;
    html.setAttribute('data-atm-measuring', '1');
    try {
      measureContent();
    } finally {
      html.removeAttribute('data-atm-measuring');
    }
  };

  function measureContent() {
    document.querySelectorAll(CONTENT_SELECTOR).forEach(function (container) {
      if (container.closest('[data-atm-content]') && !container.hasAttribute('data-atm-content')) return; // nested
      container.setAttribute('data-atm-content', '1');
      const nodes = [container].concat([].slice.call(container.querySelectorAll('*')));
      nodes.forEach(function (el) {
        if (checked.has(el)) return;
        checked.add(el);
        if (!hasOwnText(el)) return;
        const cs = getComputedStyle(el);
        const fg = parseColor(cs.color);
        if (!fg) return;
        const bg = backgroundOf(el);
        if (contrast(fg, bg.color) >= 3) return;
        const authorBg = bg.el !== container && container.contains(bg.el);
        const authorFg = authorColored(el, container);
        if (authorBg && !authorFg) el.setAttribute('data-atm-fg', 'dark');
        else if (!authorBg && authorFg) el.setAttribute('data-atm-fg', 'light');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. Home page: list every enrolled course, not only the first 20     */
  /* ------------------------------------------------------------------ */

  // The site home "My courses" list stops at the site's front page limit
  // (20) and only links to My courses. When it is truncated, fetch the full
  // enrolled list through the same web service the My courses page uses and
  // append the missing entries with the theme's own markup. Courses the user
  // removed from view on My courses stay hidden, as they do there.

  function sesskey() {
    const input = document.querySelector('input[name="sesskey"]');
    if (input && input.value) return input.value;
    const a = document.querySelector('a[href*="sesskey="]');
    const m = a && a.getAttribute('href').match(/sesskey=([A-Za-z0-9]+)/);
    return m ? m[1] : null;
  }

  function plainText(html) {
    // Course names come back HTML-formatted; DOMParser never runs scripts.
    return new DOMParser().parseFromString(String(html || ''), 'text/html').body.textContent.trim();
  }

  F.allCourses = function () {
    if (!document.body || document.body.id !== 'page-site-index') return;
    const list = document.getElementById('frontpage-course-list');
    const more = list && list.querySelector('.paging-morelink');
    if (!more || list.hasAttribute('data-atm-all')) return;
    const key = sesskey();
    if (!key) return;
    list.setAttribute('data-atm-all', 'loading');

    const body = JSON.stringify([{
      index: 0,
      methodname: 'core_course_get_enrolled_courses_by_timeline_classification',
      args: { offset: 0, limit: 0, classification: 'all', sort: 'fullname', customfieldname: '', customfieldvalue: '' }
    }]);
    fetch('/lib/ajax/service.php?sesskey=' + encodeURIComponent(key) +
          '&info=core_course_get_enrolled_courses_by_timeline_classification', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: body
    }).then(function (r) { return r.json(); }).then(function (res) {
      const courses = res && res[0] && !res[0].error && res[0].data && res[0].data.courses;
      if (!courses) throw new Error('unexpected response');
      const shown = {};
      list.querySelectorAll('.coursebox[data-courseid]').forEach(function (b) { shown[b.getAttribute('data-courseid')] = true; });
      let n = list.querySelectorAll('.coursebox').length;
      const last = list.querySelector('.coursebox.last');
      courses.forEach(function (c) {
        if (shown[String(c.id)]) return;
        n++;
        const box = document.createElement('div');
        box.className = 'coursebox clearfix ' + (n % 2 ? 'odd' : 'even');
        box.setAttribute('data-courseid', String(c.id));
        box.setAttribute('data-type', '1');
        box.setAttribute('data-atm-added-course', '1');
        const info = document.createElement('div');
        info.className = 'info';
        const h3 = document.createElement('h3');
        h3.className = 'coursename';
        const a = document.createElement('a');
        a.className = 'aalink';
        a.href = c.viewurl || ('/course/view.php?id=' + c.id);
        a.textContent = plainText(c.fullname);
        h3.appendChild(a);
        info.appendChild(h3);
        box.appendChild(info);
        more.parentNode.insertBefore(box, more);
      });
      if (last) last.classList.remove('last');
      const boxes = list.querySelectorAll('.coursebox');
      if (boxes.length) boxes[boxes.length - 1].classList.add('last');
      list.setAttribute('data-atm-all', 'done');
    }).catch(function (e) {
      list.setAttribute('data-atm-all', 'failed');
      console.warn('[ATM] allCourses:', e);
    });
  };

  /* ------------------------------------------------------------------ */
  /* Run order                                                           */
  /* ------------------------------------------------------------------ */

  ATM.runFeatures = function () {
    if (!document.body) return;
    const steps = [
      ['brandText', F.brandText],
      ['simplifyNav', F.simplifyNav],
      ['smartTitles', F.smartTitles],
      ['indexIcons', F.indexIcons],
      ['allCourses', F.allCourses],
      [null, F.tagActivities],
      [null, F.emptyHeaders],
      [null, F.darkContent]
    ];
    steps.forEach(function (step) {
      if (step[0] && !on(step[0])) return;
      try { step[1](); } catch (e) { console.warn('[ATM] ' + (step[0] || 'feature') + ':', e); }
    });
  };
})();
