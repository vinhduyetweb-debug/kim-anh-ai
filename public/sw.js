const CACHE_NAME = "kim-anh-ai-rainbow-house-v5";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/apps/kimanh-bridge.css",
  "/apps/kimanh-bridge.js",
  "/apps/abcmyanh/",
  "/apps/abcmyanh/index.html",
  "/apps/abcmyanh/sw.js",
  "/apps/abcmyanh/assets/app-icon-JTzbsX6F.svg",
  "/apps/abcmyanh/assets/index-sFzEZ3gn.css",
  "/apps/abcmyanh/assets/index-z_IRj-F1.js",
  "/apps/abcmyanh/assets/manifest-DA3jYvXZ.json",
  "/apps/vinh-paint/",
  "/apps/vinh-paint/index.html",
  "/apps/vinh-paint/app.js",
  "/apps/vinh-paint/style.css",
  "/apps/vinh-paint/manifest.json",
  "/apps/vinh-paint/sw.js",
  "/apps/vinh-paint/datasets/animals.json",
  "/apps/vinh-xemvideo/",
  "/apps/vinh-xemvideo/index.html",
  "/apps/vinh-xemvideo/app.js",
  "/apps/vinh-xemvideo/style.css",
  "/apps/vinh-xemvideo/manifest.json",
  "/apps/vinh-xemvideo/sw.js",
  "/apps/vinh-khobaukyuc/",
  "/apps/vinh-khobaukyuc/index.html",
  "/apps/vinh-khobaukyuc/app.js",
  "/apps/vinh-khobaukyuc/style.css",
  "/apps/vinh-khobaukyuc/manifest.json",
  "/apps/vinh-khobaukyuc/folder_map.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});
