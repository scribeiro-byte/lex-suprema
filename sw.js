const CACHE = 'lex-suprema-v4';
const CORE  = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.url.includes('googleapis.com')) return;
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(resp => {
      if (!resp || resp.status !== 200 || resp.type !== 'basic') return resp;
      caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
      return resp;
    }).catch(() => caches.match('/index.html'));
  }));
});