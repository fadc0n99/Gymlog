// Офлайн-кэш приложения. При изменении файлов увеличь номер версии.
const CACHE = "gymlog-v5";
const FILES = ["./", "index.html", "style.css", "app.js", "manifest.webmanifest",
  "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Сразу отдаём из кэша (мгновенно и без сети), а в фоне обновляем кэш —
// новая версия подхватится при следующем запуске.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const cached = await c.match(e.request, { ignoreSearch: true })
      || (e.request.mode === "navigate" ? await c.match("index.html") : undefined);
    const net = fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }).catch(() => null);
    if (cached) { e.waitUntil(net); return cached; }
    return (await net) || Response.error();
  }));
});
