const CACHE='lex-v8';
const CORE=['/','/index.html','/manifest.json','/icons/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('googleapis.com'))return;
  e.respondWith(caches.match(e.request).then(c=>{
    if(c)return c;
    return fetch(e.request).then(r=>{
      if(!r||r.status!==200||r.type!=='basic')return r;
      caches.open(CACHE).then(ca=>ca.put(e.request,r.clone()));
      return r;
    }).catch(()=>caches.match('/index.html'));
  }));
});