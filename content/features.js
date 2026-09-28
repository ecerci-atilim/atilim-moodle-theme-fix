/*
 * DOM'a dokunan özellikler. Her özellik idempotent: aynı sayfada defalarca
 * çağrılabilir, işaretlediği öğeleri ikinci kez ellemez. main.js bunları
 * hem yüklemede hem her DOM değişikliğinde (debounce ile) çalıştırır.
 */
(function () {
  'use strict';

  const ATM = window.__atm;
  const F = (ATM.features = {});

  /* ------------------------------------------------------------------ */
  /* Yardımcılar                                                         */
  /* ------------------------------------------------------------------ */

  function on(key) { return !!ATM.settings[key]; }

  function isTurkish() { return document.body && document.body.classList.contains('lang-tr'); }

  function t(tr, en) { return isTurkish() ? tr : en; }

  // Ders id'si: body sınıfı "course-1225" en güvenilir kaynak. course-1 site.
  ATM.courseId = function () {
    const m = document.body && document.body.className.match(/\bcourse-(\d+)\b/);
    if (!m || m[1] === '1') return null;
    return m[1];
  };

  // Tema adı ve revizyonu: stylesheet URL'sinden (content script M.cfg'yi göremez).
  let themeInfo = null;
  function getThemeInfo() {
    if (themeInfo) return themeInfo;
    const link = document.querySelector('link[rel="stylesheet"][href*="/theme/styles.php/"]');
    const m = link && link.href.match(/\/theme\/styles\.php\/(\w+)\/(\d+)/);
    themeInfo = m ? { theme: m[1], rev: m[2] } : { theme: 'stream', rev: '-1' };
    return themeInfo;
  }

  // Modül adı -> Moodle "purpose" (Boost bu bilgiyle ikonları renklendirir).
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
  /* 1. Navbar: logo yerine metin                                        */
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
  /* 2. Navbar: tema menülerini işaretle, Derslerim linki ekle           */
  /* ------------------------------------------------------------------ */

  const KEEP_NAV = [/^\/?$/, /^\/my\/?$/, /^\/my\/courses\.php/, /^\/calendar\//, /^\/course\/index\.php/];

  F.simplifyNav = function () {
    const nav = document.querySelector('.primary-navigation .moremenu ul.navbar-nav, .primary-navigation ul.navbar-nav');
    if (!nav) return;

    nav.querySelectorAll('li.nav-item:not([data-atm-nav])').forEach(function (li) {
      li.setAttribute('data-atm-nav', '1');
      const a = li.querySelector('a.nav-link');
      if (!a) return;
      if (li.classList.contains('dropdownmoremenu')) return; // "More" taşma menüsü
      let path;
      try { path = new URL(a.getAttribute('href') || '#', location.origin); } catch (e) { return; }
      const samePage = a.getAttribute('href') === '#' || path.origin !== location.origin;
      const keep = !samePage && KEEP_NAV.some(function (re) { return re.test(path.pathname); });
      if (!keep) li.classList.add('atm-nav-extra');
    });

    // Taşma menüsündeki kopyalar da işaretlensin.
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
      const items = [
        { href: '/my/', label: t('Panel', 'Dashboard'), test: /^\/my\/?$/ },
        { href: '/my/courses.php', label: t('Derslerim', 'My courses'), test: /^\/my\/courses\.php/ }
      ];
      let anchor = home;
      items.forEach(function (it) {
        const li = document.createElement('li');
        li.className = 'nav-item atm-nav-added';
        li.setAttribute('data-atm-added', '1');
        li.setAttribute('role', 'none');
        const a = document.createElement('a');
        a.className = 'nav-link' + (it.test.test(location.pathname) ? ' active' : '');
        a.setAttribute('role', 'menuitem');
        a.href = it.href;
        a.textContent = it.label;
        li.appendChild(a);
        if (anchor && anchor.nextSibling) anchor.parentNode.insertBefore(li, anchor.nextSibling);
        else nav.appendChild(li);
        anchor = li;
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /* 3. Ders başlıklarını ayrıştır: "KOD | Ad DÖNEM | Eğitmen"           */
  /* ------------------------------------------------------------------ */

  const TERM_RE = /\s*\b(\d{2}-?\d{2}\s?[A-ZİÜÖŞÇĞ])\b\s*$/; // 2526G, 2627F, 24-25Y

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
      if (!/\d/.test(last) && words.length >= 2 && words.length <= 4 && last.length <= 40) {
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

  // Orijinal metni saklayıp yanına zengin sürümü ekler; CSS hangisinin
  // görüneceğine karar verir (ayar kapatılınca orijinal geri gelir).
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

    // a) Derslerim / panel kartları
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

    // b) Liste görünümü ve "son erişilen dersler" gibi diğer listeler
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

    // c) Ders sayfası başlığı (h1)
    if (document.body.classList.contains('path-course-view')) {
      const h1 = document.querySelector('#page-header .page-header-headings h1:not([data-atm-rich])');
      if (h1 && ATM.parseCourseTitle(h1.textContent)) enrich(h1, ATM.parseCourseTitle(h1.textContent));
    }

    // d) Breadcrumb'daki ders linki: kısa biçim
    document.querySelectorAll('.breadcrumb a[href*="/course/view.php?id=' + cid + '"]:not([data-atm-rich])').forEach(function (a) {
      const i = ATM.parseCourseTitle(a.textContent);
      if (i) enrich(a, i, { inline: true, short: true });
      else a.setAttribute('data-atm-rich', '0');
    });

    // e) Sol dizin başlığı: zengin biçim + derse link
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

    // f) Sekme başlığı: "Grader report | EE209 | Laboratory | ... | Anasayfa" -> "Grader report · EE209"
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
  /* 4. Ders dizinine (sol panel) ikon ekle                              */
  /* ------------------------------------------------------------------ */

  let iconCache = null;      // chrome.storage.local'dan: { cmid: {src, purpose} }
  let iconCacheCourse = null;
  let iconCacheDirty = false;

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
          iconCacheDirty = true; // yeni gelen cache ile eksik ikonları tamamla
        }
      });
    } catch (e) { /* yoksay */ }
  }

  let saveTimer = null;
  function saveIconCache(cid, map) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        const obj = {};
        obj['atm_icons_' + cid] = map;
        chrome.storage.local.set(obj);
      } catch (e) { /* yoksay */ }
    }, 800);
  }

  F.indexIcons = function () {
    const cid = ATM.courseId();
    if (!cid) return;
    loadIconCache(cid);

    const live = liveIconMap();
    if (Object.keys(live).length) {
      // Ders sayfasındayız: dosya türü ikonları (pdf, docx) buradan öğrenilir.
      const merged = Object.assign({}, iconCache || {}, live);
      if (JSON.stringify(merged) !== JSON.stringify(iconCache)) {
        iconCache = merged;
        saveIconCache(cid, merged);
      }
    }

    const items = document.querySelectorAll('.courseindex-item[data-for="cm"]');
    items.forEach(function (li) {
      const existing = li.querySelector('.atm-ci-icon');
      const cmid = li.getAttribute('data-id');
      const link = li.querySelector('a.courseindex-link');
      if (!link) return;
      const m = (link.getAttribute('href') || '').match(/\/mod\/([a-z0-9_]+)\//);
      const modname = m ? m[1] : null;
      const data = live[cmid] || (iconCache && iconCache[cmid]) || null;
      const src = data ? data.src : (modname ? modIconUrl(modname) : null);
      const purpose = (data && data.purpose) || (modname && PURPOSE[modname]) || 'other';
      if (!src) return;

      if (existing) {
        // Cache sonradan geldiyse daha iyi ikonla değiştir.
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
  /* 5. Etkinlik satırlarını amacına göre işaretle (CSS :has yedeği)     */
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
  /* Çalıştırma sırası                                                   */
  /* ------------------------------------------------------------------ */

  ATM.runFeatures = function () {
    if (!document.body) return;
    const steps = [
      ['brandText', F.brandText],
      ['simplifyNav', F.simplifyNav],
      ['smartTitles', F.smartTitles],
      ['indexIcons', F.indexIcons],
      [null, F.tagActivities]
    ];
    steps.forEach(function (step) {
      if (step[0] && !on(step[0])) return;
      try { step[1](); } catch (e) { console.warn('[ATM] ' + (step[0] || 'feature') + ':', e); }
    });
  };
})();
