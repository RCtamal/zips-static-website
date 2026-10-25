(function () {
  var slides = [].slice.call(document.querySelectorAll('.slide')), n = slides.length, cur = 0,
      count = document.getElementById('count'), bar = document.querySelector('#progress i'), idle;

  function fit() { document.documentElement.style.setProperty('--s', Math.min(innerWidth / 1280, innerHeight / 720)); }

  function show(i) {
    cur = Math.max(0, Math.min(n - 1, i));
    slides.forEach(function (s, k) { s.classList.toggle('active', k === cur); s.classList.toggle('past', k < cur); });
    count.textContent = (cur + 1) + ' / ' + n;
    bar.style.width = ((cur + 1) / n * 100) + '%';
    try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {}
  }

  function fs() {
    var d = document;
    if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); }
    else { var e = d.documentElement; (e.requestFullscreen || e.webkitRequestFullscreen || function () {}).call(e); }
  }

  function wake() {
    document.body.classList.remove('idle');
    clearTimeout(idle);
    idle = setTimeout(function () { document.body.classList.add('idle'); }, 3000);
  }

  document.getElementById('prev').onclick = function () { show(cur - 1); };
  document.getElementById('next').onclick = function () { show(cur + 1); };
  document.getElementById('fs').onclick = fs;

  addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') { e.preventDefault(); show(cur + 1); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); show(cur - 1); }
    else if (k === 'Home') show(0);
    else if (k === 'End') show(n - 1);
    else if (k === 'f' || k === 'F') fs();
    wake();
  });

  var sx, sy;
  addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(dx < 0 ? cur + 1 : cur - 1);
  }, { passive: true });

  ['mousemove', 'touchstart'].forEach(function (t) { addEventListener(t, wake, { passive: true }); });
  addEventListener('resize', fit);

  fit();
  show((parseInt(location.hash.slice(1), 10) || 1) - 1);
  wake();

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
