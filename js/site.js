(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); },
      $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); },
      root = document.documentElement;
  root.classList.add('js');

  /* theme toggle */
  var tbtn = $('#theme'), meta = $('meta[name=theme-color]');
  function setTheme(t, save) {
    root.dataset.theme = t;
    tbtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    meta.content = t === 'dark' ? '#0b1129' : '#1a2650';
    if (save) { try { localStorage.setItem('zeeco-theme', t); } catch (e) {} }
  }
  setTheme(root.dataset.theme || 'light');
  tbtn.addEventListener('click', function () { setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true); });

  /* mobile menu */
  var burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', function () {
    burger.setAttribute('aria-expanded', menu.classList.toggle('open'));
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });

  /* scroll: progress bar, header shadow, back-to-top */
  var bar = $('#bar'), nav = $('.nav'), totop = $('#totop'), ticking = false;
  function onScroll() {
    var h = root.scrollHeight - innerHeight, y = scrollY;
    bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    nav.classList.toggle('scrolled', y > 10);
    totop.classList.toggle('show', y > 700);
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  totop.addEventListener('click', function () { scrollTo({ top: 0, behavior: 'smooth' }); });

  /* scroll reveal with stagger inside grids */
  $$('.grid, .grid4, .steps, .badges-in').forEach(function (g) {
    $$('.reveal, .badge', g).forEach(function (el, i) { el.style.setProperty('--d', (i % 5) * 0.07 + 's'); });
  });
  $$('.badge').forEach(function (b) { b.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* active nav link */
  var links = $$('#menu a[href^="#"]:not(.btn)'), map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { links.forEach(function (a) { a.classList.remove('active'); }); var a = map[e.target.id]; if (a) a.classList.add('active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* vision / mission tabs */
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      $$('.tabpanel').forEach(function (p) { p.hidden = p.id !== 'tab-' + b.dataset.tab; });
    });
  });

  /* hero parallax + card tilt (fine pointers only) */
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (fine) {
    var art = $('#art');
    art.parentNode.addEventListener('mousemove', function (e) {
      var r = art.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$('.glass', art).forEach(function (g, i) {
        var k = (i + 1) * 10;
        g.style.transform = 'translate(' + x * k + 'px,' + y * k + 'px) rotateY(' + x * 10 + 'deg) rotateX(' + -y * 10 + 'deg)';
      });
    });
    art.parentNode.addEventListener('mouseleave', function () { $$('.glass', art).forEach(function (g) { g.style.transform = ''; }); });
    $$('.card').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'translateY(-6px) perspective(700px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }

  /* toast */
  var toast = $('#toast'), tt;
  function say(m) { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2600); }

  /* product card -> pre-select category in the enquiry form */
  var cat = $('#cat');
  $$('.card').forEach(function (c) {
    c.addEventListener('click', function () {
      var p = c.dataset.p.replace(/&/g, '&');
      for (var i = 0; i < cat.options.length; i++) { if (cat.options[i].text === p) cat.selectedIndex = i; }
      $('#contact').scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () { $('#enq [name=name]').focus({ preventScroll: true }); }, 700);
      say(p + ' selected');
    });
  });

  /* enquiry form -> WhatsApp / email */
  var form = $('#enq'), via = 'wa';
  form.addEventListener('click', function (e) { if (e.target.dataset && e.target.dataset.via) via = e.target.dataset.via; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $$('[required]', form).forEach(function (f) { var bad = !f.value.trim(); f.classList.toggle('bad', bad); if (bad) ok = false; });
    if (!ok) { say('Please fill in all fields'); return; }
    var d = new FormData(form);
    var text = 'Hello ZEECO,\nName: ' + d.get('name') + '\nPhone: ' + d.get('phone') + '\nCategory: ' + d.get('cat') + '\nRequirement: ' + d.get('msg');
    if (via === 'wa') { window.open('https://wa.me/918013058087?text=' + encodeURIComponent(text), '_blank', 'noopener'); }
    else { location.href = 'mailto:zeecoindustrialsales@gmail.com?subject=' + encodeURIComponent('Quotation request: ' + d.get('cat')) + '&body=' + encodeURIComponent(text); }
    say('Opening your message...');
  });
  $$('[required]', form).forEach(function (f) { f.addEventListener('input', function () { f.classList.remove('bad'); }); });

  $('#yr').textContent = new Date().getFullYear();
})();
