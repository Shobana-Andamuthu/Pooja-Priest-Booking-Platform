/* Page behaviour: filters, forms, authentication UI (static, no backend) */
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function setErr(input, msg) { var e = input.closest('.form-group').querySelector('.err'); if (e) e.textContent = msg || ''; return !msg; }
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function required(i, label) { return setErr(i, i.value.trim() ? '' : label + ' is required.'); }
  function email(i) { if (!i.value.trim()) return setErr(i, 'Email is required.'); return setErr(i, emailRe.test(i.value) ? '' : 'Enter a valid email address.'); }
  function phone(i) { if (!i.value.trim()) return setErr(i, 'Phone number is required.'); return setErr(i, /^[+\d][\d\s-]{8,14}$/.test(i.value.trim()) ? '' : 'Enter a valid phone number.'); }

  // Services filter
  var chips = $('#svc-chips');
  if (chips) chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', chips).forEach(function (c) { c.classList.toggle('on', c === b); });
    var f = b.getAttribute('data-f');
    $$('#svc-grid .card').forEach(function (c) { c.style.display = (f === 'all' || c.getAttribute('data-cat') === f) ? '' : 'none'; });
  });
  // Priest search
  var ps = $('#pri-search');
  if (ps) ps.addEventListener('input', function () {
    var q = ps.value.trim().toLowerCase();
    $$('#pri-grid .card').forEach(function (c) { c.style.display = c.getAttribute('data-name').indexOf(q) > -1 ? '' : 'none'; });
  });
  // Contact form
  var cf = $('#contact-form');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = required($('#cf-name'), 'Name') & email($('#cf-email')) & phone($('#cf-phone')) & required($('#cf-msg'), 'Message');
    if (ok) { $('#contact-ok').classList.add('show'); cf.reset(); } else $('#contact-ok').classList.remove('show');
  });
  // Newsletter
  var nl = $('#newsletter');
  if (nl) nl.addEventListener('submit', function (e) {
    e.preventDefault();
    var i = $('input', nl);
    if (emailRe.test(i.value)) { $('#newsletter-ok').classList.add('show'); i.value = ''; i.style.borderColor = ''; } else { i.style.borderColor = '#c0392b'; i.focus(); }
  });
  // Show / hide password
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-toggle-pw]'); if (!b) return;
    var i = document.getElementById(b.getAttribute('data-toggle-pw'));
    var show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.textContent = show ? 'Hide' : 'Show';
  });
  // Social sign-in (static: continues to the dashboard)
  $$('[data-social]').forEach(function (b) { b.addEventListener('click', function () { window.location.href = 'dashboard.html'; }); });
  // Login
  var lf = $('#login-form');
  if (lf) {
    lf.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = $('#l-pass'); var okp = p.value.length >= 6 ? setErr(p, '') : setErr(p, 'Password must be at least 6 characters.');
      if (email($('#l-email')) & okp) window.location.href = 'dashboard.html';
    });
    $('#forgot').addEventListener('click', function (e) {
      e.preventDefault();
      if (email($('#l-email'))) $('#forgot-ok').classList.add('show');
    });
  }
  // Create account
  var sf = $('#signup-form');
  if (sf) sf.addEventListener('submit', function (e) {
    e.preventDefault();
    var p = $('#s-pass'), p2 = $('#s-pass2'), t = $('#s-terms');
    var okp = p.value.length >= 6 ? setErr(p, '') : setErr(p, 'Password must be at least 6 characters.');
    var okc = setErr(p2, p2.value === p.value && p2.value ? '' : 'Passwords do not match.');
    var okt = setErr(t, t.checked ? '' : 'Please accept the Terms and Conditions.');
    if (required($('#s-name'), 'Full name') & email($('#s-email')) & phone($('#s-phone')) & okp & okc & okt) window.location.href = 'dashboard.html';
  });
})();

/* FAQ accordion (one open at a time) and priest carousel */
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (!d.matches || !d.matches('.faq details') || !d.open) return;
    $$('.faq details').forEach(function (o) { if (o !== d) o.open = false; });
  }, true);

  // Priest spotlight: one priest at a time, wraps around, dots + arrows
  var car = $('#priest-carousel');
  if (!car) return;
  var track = $('.car-track', car), slides = $$('.slide', car), prev = $('.prev', car), next = $('.next', car), dotsWrap = $('.car-dots', car), idx = 0;
  var dots = slides.map(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'car-dot'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Show priest ' + (i + 1));
    b.addEventListener('click', function () { idx = i; update(); });
    dotsWrap.appendChild(b); return b;
  });
  function update() {
    var dir = document.documentElement.getAttribute('dir') === 'rtl' ? 1 : -1;
    track.style.transform = 'translateX(' + (dir * idx * 100) + '%)';
    slides.forEach(function (s, i) { s.setAttribute('aria-hidden', i === idx ? 'false' : 'true'); s.inert = i !== idx; });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); d.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
  }
  prev.addEventListener('click', function () { idx = (idx - 1 + slides.length) % slides.length; update(); });
  next.addEventListener('click', function () { idx = (idx + 1) % slides.length; update(); });
  var sx = null;
  car.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  car.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev).click();
  });
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
  update();
})();
