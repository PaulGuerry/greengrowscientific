/* Green Grow Scientific — minimal hash router, no dependencies. */
(function () {
  'use strict';

  var DATA = window.GGS_DATA || {};
  var BASE_TITLE = 'Green Grow Scientific';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  var app = document.getElementById('app');
  var nav = document.getElementById('nav');

  /* ---------------- DOM helpers ---------------- */

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

  /* ---------------- views ---------------- */

  function renderHome() {
    document.title = BASE_TITLE;
    var lede = (DATA.home && DATA.home.lede) || '';
    if (lede) add(app, el('p', null, lede));
    add(app, el('p', { class: 'meta' },
      'Use the links above for research, writing, resources, and quotes.'));
  }

  function renderResearch() {
    document.title = 'Research — ' + BASE_TITLE;

    var pubs = (DATA.publications || []).slice();

    if (DATA.scholarUrl) {
      add(app, el('p', { class: 'meta' },
        'Full, current list on ', extLink(DATA.scholarUrl, 'Google Scholar'), '.'));
    }

    if (!pubs.length) {
      add(app, el('p', { class: 'muted' }, 'Publication list coming soon.'));
      return;
    }

    // Reverse chronological.
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

    years.forEach(function (year) {
      add(app, el('h2', null, year));
      add(app, el('ul', null, byYear[year].map(function (pub) {
        var meta = [];
        if (pub.authors) meta.push(pub.authors);
        if (pub.venue) meta.push(pub.venue);
        return el('li', null,
          el('div', { class: 'pub-title' }, pub.title || '(untitled)'),
          meta.length ? el('div', { class: 'meta' }, meta.join(' · ')) : null,
          pub.url ? el('div', { class: 'meta' }, extLink(pub.url, 'link')) : null
        );
      })));
    });
  }

  function renderWriting() {
    document.title = 'Writing — ' + BASE_TITLE;

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
          ? el('a', { href: item.file, target: '_blank', rel: 'noopener' },
              item.title || item.file)
          : (item.title || 'Untitled')),
        item.date ? el('div', { class: 'meta' }, formatDate(item.date)) : null,
        item.description ? el('div', { class: 'meta' }, item.description) : null
      );
    })));
  }

  function renderResources() {
    document.title = 'Resources — ' + BASE_TITLE;

    var items = DATA.resources || [];

    if (!items.length) {
      add(app, el('p', { class: 'muted' }, 'Nothing here yet.'));
      return;
    }

    add(app, el('ul', null, items.map(function (item) {
      return el('li', null,
        el('div', null, item.url ? extLink(item.url, item.name) : item.name),
        item.description ? el('div', { class: 'meta' }, item.description) : null
      );
    })));
  }

  function renderQuote() {
    document.title = 'Quote — ' + BASE_TITLE;

    var email = (DATA.quote && DATA.quote.email) || 'hello@greengrowscientific.com';

    add(app,
      el('p', null, 'Tell me about your project and I will come back with a quote.'),
      el('p', { class: 'meta' }, 'Or email ', el('a', { href: 'mailto:' + email }, email), '.')
    );

    var form = el('form', null,
      field('Name', el('input', { type: 'text', name: 'name', required: true, autocomplete: 'name' })),
      field('Email', el('input', { type: 'email', name: 'email', required: true, autocomplete: 'email' })),
      field('Organisation (optional)', el('input', { type: 'text', name: 'org' })),
      field('What do you need?', el('textarea', { name: 'message', rows: 6, required: true })),
      el('button', { type: 'submit' }, 'Create email')
    );

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      function value(name) {
        var input = form.elements[name];
        return input && input.value ? input.value.trim() : '';
      }

      var body = [
        'Name: ' + value('name'),
        'Email: ' + value('email'),
        'Organisation: ' + (value('org') || '-'),
        '',
        value('message')
      ].join('\n');

      window.location.href = 'mailto:' + email +
        '?subject=' + encodeURIComponent('Quote request from ' + value('name')) +
        '&body=' + encodeURIComponent(body);
    });

    add(app, form,
      el('p', { class: 'meta' },
        'This opens your email client — nothing is sent to a server.'));
  }

  function renderNotFound() {
    document.title = 'Not found — ' + BASE_TITLE;
    add(app, el('p', null, 'Nothing here. ', el('a', { href: '#/' }, 'Go home'), '.'));
  }

  /* ---------------- router ---------------- */

  var ROUTES = {
    '/': renderHome,
    '/research': renderResearch,
    '/writing': renderWriting,
    '/resources': renderResources,
    '/quote': renderQuote
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

  render();
})();