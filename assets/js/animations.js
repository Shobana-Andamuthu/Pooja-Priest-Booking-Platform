/* Motion: scroll reveals, counters, image fade-in, header shadow and filter pop-ins.
   Everything is progressive enhancement: without JS the page is fully visible,
   and with prefers-reduced-motion the reveals are skipped. */
(function () {
  'use strict';
  var root = document.documentElement;
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Images fade in once they have loaded ---------- */
  root.classList.add('imgfade');
  $$('.img-slot > img').forEach(function (img) {
    function ok() { img.classList.add('loaded'); }
    if (img.complete) ok(); else { img.addEventListener('load', ok); img.addEventListener('error', ok); }
  });

  /* ---------- 2. Header gets a shadow once the page is scrolled ---------- */
  var bar = document.querySelector('.site-header, .dash-bar, .auth-bar');
  function onScroll() { if (bar) bar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- 3. Helpers ---------- */
  function finalize(el) {              // hand the element back to its normal (hover-able) styles
    el.classList.add('in');
    el.classList.remove('reveal', 'from-start', 'from-end', 'zoom');
    el.style.removeProperty('--d');
  }
  function formatNum(n, dec, comma) {
    var s = n.toFixed(dec);
    return comma ? Number(s).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : s;
  }
  function countUp(b) {                // "12,500+" -> counts from 0, keeps prefix / suffix / decimals
    var m = /^([^\d]*)(\d[\d,]*\.?\d*)(.*)$/.exec((b.getAttribute('data-final') || b.textContent).trim());
    if (!m) return;
    var target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].indexOf(',') > -1;
    var t0 = null, dur = 1700;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      b.textContent = m[1] + formatNum(target * e, dec, comma) + m[3];
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 4. Pick what should reveal on scroll ---------- */
  var skip = '.site-footer, .hero, .auth-wrap, .dash, .dash-bar, .site-header, .auth-bar, .page-loader';
  var seen = [];
  function tag(el, kind, delay) {
    if (!el || el.classList.contains('reveal') || el.closest(skip) || seen.indexOf(el) > -1) return;
    seen.push(el);
    el.classList.add('reveal');
    if (kind) el.classList.add(kind);
    if (delay) el.style.setProperty('--d', delay.toFixed(2) + 's');
  }
  function group(sel, kind, cols) {
    $$(sel).forEach(function (parent) {
      Array.prototype.forEach.call(parent.children, function (c, i) { tag(c, kind, (i % (cols || 4)) * 0.09); });
    });
  }

  function collect() {
    $$('.section-title, .how-intro, .why-intro').forEach(function (e) { tag(e); });
    group('.grid'); group('.stories-pair', null, 2); group('.cal', null, 2); group('.stepper');
    group('.why-grid', null, 3); group('.vlist', null, 1); group('.city-list', null, 2); group('.row-list', null, 1);
    group('.strip', null, 3); group('.how-list', null, 1); group('.contact-grid', null, 2);
    group('.contact-side', null, 1); group('.faq', null, 1); group('.checks', 'from-start', 1); group('.timeline', null, 1);
    group('.chips', 'zoom', 8);
    $$('.checks').forEach(function (ul) { Array.prototype.forEach.call(ul.children, function (li, i) { li.style.setProperty('--d', (0.1 + i * 0.1).toFixed(2) + 's'); }); });
    $$('.split').forEach(function (s) {
      var flip = s.classList.contains('flip'), kids = Array.prototype.slice.call(s.children);
      kids.forEach(function (k, i) { tag(k, ((i === 0) !== flip) ? 'from-start' : 'from-end'); });
    });
    $$('.zz-item').forEach(function (z, i) { tag(z, i % 2 === 0 ? 'from-start' : 'from-end'); });
    $$('.zz-item .img-slot, .split .img-slot').forEach(function (e) { e.style.setProperty('--d', '.12s'); });
    tag(document.querySelector('.stories-photo'), 'from-start');
    $$('.stories-col > .story').forEach(function (s) { tag(s, null, 0.1); });
    $$('.how-step').forEach(function (s, i) { tag(s, null, Math.min(i, 3) * 0.1); });
    $$('.row-item').forEach(function (s, i) { tag(s, null, Math.min(i, 3) * 0.08); });
    $$('.spotlight, .map-embed, .map-link, .toolbar, .trust-row, .section > .container > .card').forEach(function (e) { tag(e); });
    $$('.cta-band .container > *').forEach(function (e, i) { tag(e, null, i * 0.12); });
  }

  var io = null;
  function show(el) {
    var wait = (parseFloat(el.style.getPropertyValue('--d')) || 0) * 1000;
    el.classList.add('in');
    var b = el.classList.contains('stat') ? el.querySelector('b') : null;
    if (b) setTimeout(function () { countUp(b); }, wait);
    setTimeout(function () { finalize(el); }, wait + 1700);   // after the transition: drop the reveal classes
  }
  function observe() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(show); $$('.zigzag').forEach(function (z) { z.classList.add('in'); }); return; }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        if (en.target.classList.contains('zigzag')) en.target.classList.add('in'); else show(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
    $$('.zigzag').forEach(function (el) { io.observe(el); });
    // stat counters start at 0 so the number never flashes at full value
    $$('.stat b').forEach(function (b) { var m = /^([^\d]*)(\d[\d,]*\.?\d*)(.*)$/.exec(b.textContent.trim()); if (m) b.setAttribute('data-final', b.textContent.trim()); if (m) b.textContent = m[1] + formatNum(0, (m[2].split('.')[1] || '').length, m[2].indexOf(',') > -1) + m[3]; });
  }

  /* ---------- 5. Filtering (services / priests) re-plays a pop-in on the cards that remain ---------- */
  function pop(grid) {
    var i = 0;
    $$('.card', grid).forEach(function (c) {
      if (c.style.display === 'none') return;
      finalize(c);
      c.classList.remove('pop'); void c.offsetWidth;
      c.style.setProperty('--pd', (Math.min(i, 11) * 0.04).toFixed(2) + 's');
      c.classList.add('pop'); i++;
      c.addEventListener('animationend', function h() { c.classList.remove('pop'); c.removeEventListener('animationend', h); });
    });
  }
  var chips = document.getElementById('svc-chips'), sg = document.getElementById('svc-grid');
  if (chips && sg) chips.addEventListener('click', function (e) { if (e.target.closest('.chip')) pop(sg); });
  var ps = document.getElementById('pri-search'), pg = document.getElementById('pri-grid');
  if (ps && pg) ps.addEventListener('input', function () { pop(pg); });

  /* ---------- 6. Go once the page loader has faded (or immediately if it is already gone) ---------- */
  var started = false;
  function start() {
    if (started) return; started = true;
    root.classList.add('loaded');
    if (reduce) return;
    collect(); observe();
  }
  var loader = document.getElementById('page-loader');
  if (!loader || loader.classList.contains('hide')) start();
  else {
    new MutationObserver(function (_, mo) { if (loader.classList.contains('hide')) { mo.disconnect(); start(); } })
      .observe(loader, { attributes: true, attributeFilter: ['class'] });
    setTimeout(start, 5000);
  }
})();
