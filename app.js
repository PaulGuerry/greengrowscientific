/* Green Grow Scientific — minimal hash router, no dependencies. */
(function () {
  'use strict';

  var DATA = window.GGS_DATA || {};
  var DOIS = window.GGS_DOIS || {};
  var BASE_TITLE = 'Green Grow Scientific';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  var app = document.getElementById('app');
  var nav = document.getElementById('nav');

  /* ---------------- 1. LANGUAGE & TRANSLATIONS ---------------- */
  
  // Detect language: localStorage > domain > default to EN
  var isFrenchDomain = window.location.hostname.indexOf('greengrowscience.fr') !== -1;
  var currentLang = localStorage.getItem('ggs_lang') || (isFrenchDomain ? 'fr' : 'en');

  function t(key) {
    return (DATA.translations && DATA.translations[currentLang] && DATA.translations[currentLang][key]) || key;
  }

  // Automatically attach DOIs from dois.js to publications in data.js
  if (DATA.publications) {
    DATA.publications.forEach(function(pub) {
      if (DOIS[pub.title] && !pub.url) {
        pub.url = DOIS[pub.title];
      }
    });
  }

  /* ---------------- 2. DOM HELPERS ---------------- */

  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'text') { node.textContent = value; return; }
        if (key.slice(0, 2) === 'on' && typeof value === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), value);
          return;
        }
        node.setAttribute(key, value === true ? '' : value);
      });
    }
    for (var i = 2; i < arguments.length; i++) add(node, arguments[i]);
    return node;
  }

  function add(parent, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) {
      child.forEach(function (c) { add(parent, c); });
      return;
    }
    if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(document.createTextNode(String(child)));
      return;
    }
    parent.appendChild(child);
  }

  function extLink(href, text) {
    return el('a', { href: href, target: '_blank', rel: 'noopener' }, text);
  }

  function field(labelText, control) {
    var id = 'f-' + Math.random().toString(36).slice(2, 8);
    control.id = id;
    return el('div', { class: 'field' },
      el('label', { for: id }, labelText),
      control
    );
  }

  function formatDate(value) {
    var match = /^(\d{4})(?:-(\d{2}))?/.exec(String(value || ''));
    if (!match) return String(value || '');
    var monthIndex = match[2] ? Number(match[2]) - 1 : null;
    if (monthIndex === null || !MONTHS[monthIndex]) return match[1];
    return MONTHS[monthIndex] + ' ' + match[1];
  }

  function getMaskedEmail(email) {
    if (!email) return null;
    var parts = email.split('@');
    var address = parts[0] + '@' + parts[1];
    return el('a', { href: 'mailto:' + address }, address);
  }

  /* ---------------- 3. VIEWS ---------------- */

  
  function renderHome() {
    document.title = BASE_TITLE;
    // Lede removed. Page will just show the nav and nothing else.
  }

  function renderResearch() {
    document.title = t('nav_research') + ' — ' + BASE_TITLE;
    var pubs = (DATA.publications || []).slice();

    if (!pubs.length) {
      add(app, el('p', { class: 'muted' }, 'Publication list coming soon.'));
      return;
    }

    pubs.sort(function (a, b) {
      return (Number(b.year) || 0) - (Number(a.year) || 0);
    });

    var years = [];
    var byYear = {};
    pubs.forEach(function (pub) {
      var year = pub.year ? String(pub.year) : 'Other';
      if (!byYear[year]) { byYear[year] = []; years.push(year); }
      byYear[year].push(pub);
    });

    var totalPubs = pubs.length;
    var currentIndex = 0;

    years.forEach(function (year) {
      add(app, el('h2', null, year));
      add(app, el('ul', null, byYear[year].map(function (pub) {
        var pubNumber = totalPubs - currentIndex;
        currentIndex++;

        var meta = [];
        if (pub.authors) meta.push(pub.authors);
        if (pub.venue) meta.push(pub.venue);

        var titlePrefix = '[' + pubNumber + '] ';
        var titleNode = pub.url 
          ? el('a', { href: pub.url, target: '_blank', rel: 'noopener' }, titlePrefix + (pub.title || '(untitled)'))
          : el('span', null, titlePrefix + (pub.title || '(untitled)'));

        return el('li', null,
          el('div', { class: 'pub-title' }, titleNode),
          meta.length ? el('div', { class: 'meta' }, meta.join(' · ')) : null
        );
      })));
    });
  }

  function renderWriting() {
    document.title = t('nav_writing') + ' — ' + BASE_TITLE;
    var items = (DATA.writing || []).slice();
    if (!items.length) {
      add(app, el('p', { class: 'muted' }, 'Nothing here yet.'));
      return;
    }
    items.sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    add(app, el('ul', null, items.map(function (item) {
      return el('li', null,
        el('div', null, item.file
          ? el('a', { href: item.file, target: '_blank', rel: 'noopener' }, item.title || item.file)
          : (item.title || 'Untitled')),
        item.date ? el('div', { class: 'meta' }, formatDate(item.date)) : null,
        item.description ? el('div', { class: 'meta' }, item.description) : null
      );
    })));
  }
  function renderResources() {
    document.title = t('nav_resources') + ' — ' + BASE_TITLE;
    var items = DATA.resources || [];
    
    if (!items.length) {
      add(app, el('p', { class: 'muted' }, 'Nothing here yet.'));
      return;
    }
    
    add(app, el('ul', null, items.map(function (item) {
      var name = t('res_' + item.key + '_name');
      var desc = t('res_' + item.key + '_desc');

      return el('li', null,
        el('div', null, item.url ? extLink(item.url, name) : name),
        desc ? el('div', { class: 'meta' }, desc) : null
      );
    })));
  }
  
  

  function renderQuote() {
    document.title = t('nav_quote') + ' — ' + BASE_TITLE;
    var email = (DATA.quote && DATA.quote.email) || 'greengrowsci@gmail.com';
    add(app, el('p', null, t('quote_text'), getMaskedEmail(email), '.'));
  }

  function renderContact() {
    document.title = t('nav_contact') + ' — ' + BASE_TITLE;
    var email = (DATA.quote && DATA.quote.email) || 'greengrowsci@gmail.com';
    add(app, el('p', null, t('contact_text'), getMaskedEmail(email)));
  }

  function renderNotFound() {
    document.title = 'Not found — ' + BASE_TITLE;
    add(app, el('p', null, 'Nothing here. ', el('a', { href: '#/' }, 'Go home'), '.'));
  }

  /* ---------------- 4. ROUTER & NAV ---------------- */

  var ROUTES = {
    '/': renderHome,
    '/research': renderResearch,
    '/writing': renderWriting,
    '/resources': renderResources,
    '/quote': renderQuote,
    '/contact': renderContact
  };

  function currentPath() {
    var hash = location.hash || '';
    if (hash.charAt(0) === '#') hash = hash.slice(1);
    if (!hash) return '/';
    return hash.replace(/\/+$/, '') || '/';
  }

  function updateNav(path) {
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      var target = a.getAttribute('href').replace(/^#/, '');
      
      if (target === path) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('active');
        a.removeAttribute('aria-current');
      }

      // Translate the nav text
      var i18nKey = a.getAttribute('data-i18n');
      if (i18nKey) a.textContent = t(i18nKey);
    });
  }

  function render() {
    var path = currentPath();
    app.textContent = '';
    (ROUTES[path] || renderNotFound)();
    updateNav(path);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- 5. LANGUAGE TOGGLE EVENTS ---------------- */

  var btnEn = document.getElementById('btn-en');
  var btnFr = document.getElementById('btn-fr');

  if (btnEn && btnFr) {
    // Highlight the active button
    if (currentLang === 'fr') {
      btnFr.style.fontWeight = 'bold';
      btnFr.style.textDecoration = 'none';
      btnEn.style.color = '#0645ad'; // reset to default link color
    } else {
      btnEn.style.fontWeight = 'bold';
      btnEn.style.textDecoration = 'none';
      btnFr.style.color = '#0645ad';
    }

    btnEn.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.setItem('ggs_lang', 'en');
      currentLang = 'en';
      window.location.reload(); // Reload is the safest way to reset everything cleanly
    });

    btnFr.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.setItem('ggs_lang', 'fr');
      currentLang = 'fr';
      window.location.reload();
    });
  }

  render();
})();
