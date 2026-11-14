/* Shared behaviour: theme, direction, public navbar, footer, back-to-top */
(function () {
  var root = document.documentElement;
  function get(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function applyTheme(t) { root.setAttribute('data-theme', t); set('theme', t); }
  function applyDir(d) { root.setAttribute('dir', d); set('dir', d); }
  applyTheme(get('theme', 'light'));
  applyDir(get('dir', 'ltr'));

  window.PoojaApp = {
    toggleTheme: function () { applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); },
    toggleDir: function () { applyDir(root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl'); }
  };

  var page = document.body.getAttribute('data-page') || '';
  var homePages = ['home1', 'home2'];
  function cls(p) { return page === p ? ' active' : ''; }

  var logo = '<a class="brand" href="index.html" aria-label="Shubh Pooja home"><img class="brand-logo logo-light" src="assets/images/logo.png" alt="Shubh Pooja" width="174" height="46"><img class="brand-logo logo-dark" src="assets/images/logo-dark.png" alt="" aria-hidden="true" width="174" height="46"></a>';
  var SV = {"moon": "<path d=\"M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z\"/>", "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/>", "swap": "<path d=\"M7 7h13\"/><path d=\"M16 3l4 4-4 4\"/><path d=\"M17 17H4\"/><path d=\"M8 13l-4 4 4 4\"/>", "pin": "<path d=\"M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/>", "phone": "<path d=\"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z\"/>", "mail": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"M22 7l-10 6L2 7\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>", "facebook": "<path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\"/>", "instagram": "<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"1\"/>", "youtube": "<path d=\"M22.5 6.5a3 3 0 0 0-2.1-2.1C18.6 4 12 4 12 4s-6.6 0-8.4.4A3 3 0 0 0 1.5 6.5 31 31 0 0 0 1 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C5.4 20 12 20 12 20s6.6 0 8.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-5.5z\"/><path d=\"M10 15l5-3-5-3z\"/>", "x": "<path d=\"M4 4l11.733 16h4.267l-11.733 -16z\"/><path d=\"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772\"/>", "whatsapp": "<path d=\"M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9\"/><path d=\"M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1\"/>"};
  function ic(n, c) { return '<svg class="ic' + (c || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + SV[n] + '</svg>'; }
  var tools = '<button class="icon-btn" data-act="theme" aria-label="Toggle light or dark mode">' + ic('moon', ' i-moon') + ic('sun', ' i-sun') + '</button>' +
              '<button class="icon-btn" data-act="dir" aria-label="Toggle LTR or RTL">' + ic('swap') + '</button>';

  function links() {
    return '<li><button class="dd-toggle' + (homePages.indexOf(page) > -1 ? ' active' : '') + '" aria-expanded="false">Home &#9662;</button>' +
      '<ul class="dd-menu"><li><a class="' + (page === 'home1' ? 'active' : '') + '" href="index.html">Home 1</a></li>' +
      '<li><a class="' + (page === 'home2' ? 'active' : '') + '" href="home-2.html">Home 2</a></li></ul></li>' +
      '<li><a class="' + cls('about').trim() + '" href="about.html">About</a></li>' +
      '<li><a class="' + cls('services').trim() + '" href="services.html">Pooja Services</a></li>' +
      '<li><a class="' + cls('priests').trim() + '" href="priests.html">Priests</a></li>' +
      '<li><a class="' + cls('contact').trim() + '" href="contact.html">Contact</a></li>' +
      '<li><a class="' + cls('dashboard').trim() + '" href="dashboard.html">Dashboard</a></li>';
  }
  var actions = '<a class="btn btn-outline" href="login.html">Login</a><a class="btn btn-primary" href="services.html">Book Now</a>';

  var headerEl = document.getElementById('site-header');
  if (headerEl) {
    headerEl.className = 'site-header';
    headerEl.innerHTML =
      '<div class="container nav-inner">' + logo +
      '<ul class="nav-links">' + links() + '</ul>' +
      '<div class="nav-actions"><div class="nav-tools">' + tools + '</div>' + actions + '</div>' +
      '<button class="icon-btn hamburger" aria-label="Toggle menu" aria-expanded="false"><svg class="ic ic-menu" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="ic ic-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="mobile-menu"><ul>' + links() + '</ul>' +
      '<div class="mm-tools">' + tools + '</div><div class="mm-actions">' + actions + '</div></div>';
  }

  var footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.className = 'site-footer';
    footerEl.innerHTML =
      '<div class="container"><div class="footer-grid">' +
      '<div>' + logo + '<p style="margin-top:14px">Verified priests, authentic rituals and complete samagri for every sacred occasion, booked with ease.</p><div class="social-row">' +
      [['facebook','Facebook','facebook.com'],['instagram','Instagram','instagram.com'],['youtube','YouTube','youtube.com'],['x','X','x.com'],['whatsapp','WhatsApp','whatsapp.com']].map(function (q) { return '<a href="https://' + q[2] + '" target="_blank" rel="noopener" aria-label="' + q[1] + '">' + ic(q[0]) + '</a>'; }).join('') + '</div></div>' +
      '<div><h4>Explore</h4><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li><li><a href="services.html">Pooja Services</a></li><li><a href="priests.html">Priests</a></li></ul></div>' +
      '<div><h4>Devotees</h4><ul><li><a href="login.html">Login</a></li><li><a href="create-account.html">Create Account</a></li><li><a href="dashboard.html">Dashboard</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
      '<div><h4>Reach Us</h4><ul class="contact-list"><li>' + ic('pin') + '<span>12 Temple Street, Mylapore, Chennai 600004</span></li><li>' + ic('phone') + '<span>+91 98765 43210</span></li><li>' + ic('mail') + '<span>care@shubhpooja.in</span></li><li>' + ic('clock') + '<span>Daily 6:00 AM &ndash; 9:00 PM</span></li></ul></div>' +
      '</div><div class="footer-bottom">&copy; 2026 Shubh Pooja. All rights reserved.</div></div>' +
      '<button class="to-top" aria-label="Back to top">&#8593;</button>';
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.dd-menu.open').forEach(function (m) {
      m.classList.remove('open');
      var b = m.parentNode.querySelector('.dd-toggle'); if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  function closeMobile() {
    var mm = document.querySelector('.mobile-menu'), hb = document.querySelector('.hamburger');
    if (mm) mm.classList.remove('open');
    if (hb) hb.setAttribute('aria-expanded', 'false');
    closeAllDropdowns();
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var dd = t.closest('.dd-toggle');
    if (dd) {
      var menu = dd.nextElementSibling, was = menu.classList.contains('open');
      closeAllDropdowns();
      if (!was) { menu.classList.add('open'); dd.setAttribute('aria-expanded', 'true'); }
      return;
    }
    if (t.closest('.hamburger')) {
      var mm = document.querySelector('.mobile-menu'), open = !mm.classList.contains('open');
      closeAllDropdowns(); mm.classList.toggle('open', open);
      t.closest('.hamburger').setAttribute('aria-expanded', String(open));
      return;
    }
    var act = t.closest('[data-act]');
    if (act) { act.getAttribute('data-act') === 'theme' ? PoojaApp.toggleTheme() : PoojaApp.toggleDir(); return; }
    if (t.closest('.to-top')) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (t.closest('.dd-menu a, .mobile-menu a')) { closeMobile(); return; }
    if (!t.closest('.site-header')) closeMobile();
  });

  var topBtn = document.querySelector('.to-top');
  function onScroll() { if (topBtn) topBtn.classList.toggle('show', window.scrollY > 300); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { if (window.innerWidth > 1366) closeMobile(); });
  onScroll();
})();

/* Page loader: fade out once the page has loaded (minimum 600 ms so it reads as intentional) */
(function () {
  var el = document.getElementById('page-loader'); if (!el) return;
  var t0 = Date.now(), done = false;
  function hide() {
    if (done) return; done = true;
    var wait = Math.max(0, 600 - (Date.now() - t0));
    setTimeout(function () { el.classList.add('hide'); setTimeout(function () { el.remove(); }, 500); }, wait);
  }
  if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
  setTimeout(hide, 4000);
})();
