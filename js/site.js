(function () {
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('open'); });

  document.getElementById('yr').textContent = new Date().getFullYear();

  var form = document.getElementById('enq'), via = 'wa';
  form.addEventListener('click', function (e) { if (e.target.dataset && e.target.dataset.via) via = e.target.dataset.via; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var d = new FormData(form);
    var text = 'Hello ZEECO,\nName: ' + d.get('name') + '\nPhone: ' + d.get('phone') + '\nRequirement: ' + d.get('msg');
    if (via === 'wa') {
      window.open('https://wa.me/918013058087?text=' + encodeURIComponent(text), '_blank', 'noopener');
    } else {
      location.href = 'mailto:zeecoindustrialsales@gmail.com?subject=' + encodeURIComponent('Quotation request') + '&body=' + encodeURIComponent(text);
    }
  });
})();
