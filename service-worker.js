const CACHE_NAME = "netral-news-static-v3";
const STATIC_ASSETS = [
  "./style.css",
  "./app.js"
];

// INSTALL: cache HANYA asset statis
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE: hapus cache lama
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH STRATEGY
self.addEventListener("fetch", event => {
  const req = event.request;

  // HTML → SELALU ambil dari network
  if (req.mode === "navigate") {
    event.respondWith(fetch(req));
    return;
  }

  // Asset → cache fallback
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});
