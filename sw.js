// Офлайн-кэш приложения. При любом изменении файлов увеличь номер версии —
// по нему телефон понимает, что пора скачать новую версию целиком.
const CACHE = "gymlog-v6";
const FILES = ["./", "index.html", "style.css", "app.js", "manifest.webmanifest",
  "icon-180.png", "icon-192.png", "icon-512.png"];

// Все файлы версии скачиваются вместе и в обход HTTP-кэша,
// поэтому старый app.js не может смешаться с новым index.html.
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Только из кэша текущей версии; сеть — для всего остального.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true })
      || (e.request.mode === "navigate" ? await c.match("index.html") : undefined);
    return hit || fetch(e.request);
  }));
});
