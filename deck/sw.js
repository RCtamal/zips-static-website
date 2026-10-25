var C = 'zeeco-v2', F = ['./', 'index.html', 'css/style.css', 'js/app.js'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(F); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x !== C; }).map(function (x) { return caches.delete(x); }));
  }).then(function () { return self.clients.claim(); }));
});
// network first, fall back to cache so the deck works offline after one visit
self.addEventListener('fetch', function (e) {
  e.respondWith(fetch(e.request).then(function (r) {
    var c = r.clone(); caches.open(C).then(function (x) { x.put(e.request, c); }); return r;
  }).catch(function () { return caches.match(e.request); }));
});
