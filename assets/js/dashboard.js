/* Dashboard: panels, filters, SVG charts (no libraries, static data) */
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var root = document.documentElement;

  // Panels
  function show(id) {
    $$('.panel').forEach(function (p) { p.classList.toggle('active', p.id === 'panel-' + id); });
    $$('.side-link[data-panel]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-panel') === id); });
    if (id === 'overview') drawAll();
    window.scrollTo({ top: 0 });
  }
  $$('[data-panel]').forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-panel')); }); });

  // Bookings filter
  function filterBookings() {
    var q = $('#bk-search').value.trim().toLowerCase(), s = $('#bk-status').value;
    $$('#tbl-all tbody tr').forEach(function (r) {
      var okq = !q || r.textContent.toLowerCase().indexOf(q) > -1, oks = !s || r.getAttribute('data-status') === s;
      r.style.display = okq && oks ? '' : 'none';
    });
  }
  $('#bk-search').addEventListener('input', filterBookings);
  $('#bk-status').addEventListener('change', filterBookings);

  // Book form: adds a row to both tables
  var bf = $('#book-form');
  bf.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = $('#b-date'), err = d.closest('.form-group').querySelector('.err');
    if (!d.value) { err.textContent = 'Please choose a date.'; return; }
    err.textContent = '';
    var id = 'BK-' + (1043 + $$('#tbl-all tbody tr').length - 6);
    var dt = new Date(d.value + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var html = '<tr data-status="Pending"><td>' + id + '</td><td>' + $('#b-ritual').value + '</td><td>' + $('#b-priest').value + '</td><td>' + dt + '</td><td><span class="badge warn">Pending</span></td><td>&mdash;</td></tr>';
    $('#tbl-all tbody').insertAdjacentHTML('afterbegin', html);
    $('#tbl-recent tbody').insertAdjacentHTML('afterbegin', html);
    var ok = $('#book-ok'); ok.textContent = 'Booking ' + id + ' requested for ' + dt + ' at ' + $('#b-time').value + '. View it under My Bookings.'; ok.classList.add('show');
    bf.reset();
  });
  $('#profile-form').addEventListener('submit', function (e) { e.preventDefault(); $('#profile-ok').classList.add('show'); });

  // ----- Charts -----
  var M12 = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  var BOOK12 = [1, 2, 1, 3, 2, 1, 2, 3, 2, 4, 3, 5];
  var SPEND12 = [3.5, 6.2, 2.1, 8.4, 5.1, 2.8, 4.9, 7.3, 5.6, 9.2, 6.8, 11.4];
  var DONUT = [['Griha Pravesh', 6], ['Satyanarayan Katha', 5], ['Ganesh Puja', 4], ['Rudrabhishekam', 4], ['Others', 5]];
  function css(v) { return getComputedStyle(root).getPropertyValue(v).trim(); }
  function palette() { return ['#e8731a', '#7a1f2b', '#c9962b', '#3b7a78', '#8a6fb0']; }
  function slice(arr, n) { return arr.slice(arr.length - n); }
  function rtl() { return root.getAttribute('dir') === 'rtl'; }
  function prep(arr) { return rtl() ? arr.slice().reverse() : arr; }

  function axes(W, H, p, max, labels) {
    var t = css('--muted'), g = css('--border'), s = '';
    for (var i = 0; i <= 4; i++) {
      var y = p.t + (H - p.t - p.b) * i / 4, v = Math.round(max * (4 - i) / 4 * 10) / 10;
      s += '<line x1="' + p.l + '" x2="' + (W - p.r) + '" y1="' + y + '" y2="' + y + '" stroke="' + g + '"/><text x="' + (p.l - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="' + t + '">' + v + '</text>';
    }
    var step = (W - p.l - p.r) / labels.length;
    labels.forEach(function (l, i) { s += '<text x="' + (p.l + step * i + step / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="' + t + '">' + l + '</text>'; });
    return s;
  }
  function line(n) {
    var W = 560, H = 260, p = { l: 36, r: 12, t: 14, b: 30 }, d = prep(slice(BOOK12, n)), lb = prep(slice(M12, n)), max = 6;
    var step = (W - p.l - p.r) / d.length, pts = d.map(function (v, i) { return [p.l + step * i + step / 2, p.t + (H - p.t - p.b) * (1 - v / max)]; });
    var path = pts.map(function (q, i) { return (i ? 'L' : 'M') + q[0] + ' ' + q[1]; }).join(' ');
    var area = path + ' L' + pts[pts.length - 1][0] + ' ' + (H - p.b) + ' L' + pts[0][0] + ' ' + (H - p.b) + ' Z';
    var c = '#e8731a';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Bookings per month">' + axes(W, H, p, max, lb) + '<path d="' + area + '" fill="' + c + '" opacity=".15"/><path d="' + path + '" fill="none" stroke="' + c + '" stroke-width="3"/>' + pts.map(function (q, i) { return '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="4" fill="' + c + '"><title>' + lb[i] + ': ' + d[i] + ' bookings</title></circle>'; }).join('') + '</svg>';
  }
  function bar(n) {
    var W = 560, H = 260, p = { l: 36, r: 12, t: 14, b: 30 }, d = prep(slice(SPEND12, n)), lb = prep(slice(M12, n)), max = 12;
    var step = (W - p.l - p.r) / d.length, bw = Math.min(34, step * .6);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Monthly spend">' + axes(W, H, p, max, lb) + d.map(function (v, i) {
      var h = (H - p.t - p.b) * v / max; return '<rect x="' + (p.l + step * i + (step - bw) / 2) + '" y="' + (H - p.b - h) + '" width="' + bw + '" height="' + h + '" rx="4" fill="#7a1f2b"><title>' + lb[i] + ': ₹' + v + 'k</title></rect>';
    }).join('') + '</svg>';
  }
  function donut() {
    var tot = DONUT.reduce(function (a, b) { return a + b[1]; }, 0), r = 80, C = 2 * Math.PI * r, off = 0, col = palette(), s = '';
    DONUT.forEach(function (d, i) {
      var len = C * d[1] / tot; s += '<circle cx="110" cy="110" r="' + r + '" fill="none" stroke="' + col[i] + '" stroke-width="32" stroke-dasharray="' + len + ' ' + (C - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 110 110)"><title>' + d[0] + ': ' + d[1] + '</title></circle>'; off += len;
    });
    $('#legend-donut').innerHTML = DONUT.map(function (d, i) { return '<span><i style="background:' + col[i] + '"></i>' + d[0] + ' (' + d[1] + ')</span>'; }).join('');
    return '<svg viewBox="0 0 220 220" style="max-width:260px;margin:auto" role="img" aria-label="Rituals booked">' + s + '<text x="110" y="108" text-anchor="middle" font-size="30" font-weight="700" fill="' + css('--text') + '">' + tot + '</text><text x="110" y="128" text-anchor="middle" font-size="12" fill="' + css('--muted') + '">poojas</text></svg>';
  }
  function drawAll() {
    var n = parseInt($('#range').value, 10);
    $('#chart-line').innerHTML = line(n); $('#chart-bar').innerHTML = bar(n); $('#chart-donut').innerHTML = donut();
  }
  $('#range').addEventListener('change', drawAll);
  new MutationObserver(drawAll).observe(root, { attributes: true, attributeFilter: ['data-theme', 'dir'] });
  drawAll();
})();
