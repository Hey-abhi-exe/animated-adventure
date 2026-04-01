const CACHE='lifeos-v1';
const SHELL=['./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(!url.startsWith('http')||e.request.method!=='GET') return;
  if(url.includes('firebase')||url.includes('googleapis')||url.includes('gstatic')||url.includes('fonts.google')) return;
  e.respondWith(caches.match(e.request).then(c=>{if(c)return c;return fetch(e.request).then(r=>{if(r&&r.ok){const cl=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cl));}return r;}).catch(()=>caches.match('./index.html'));}).catch(()=>caches.match('./index.html')));
});
