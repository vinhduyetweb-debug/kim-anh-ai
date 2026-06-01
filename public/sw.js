const CACHE_NAME = "kim-anh-ai-rainbow-house-v11";
const OFFLINE_URL = "/offline.html";
const APP_SHELL = [
  "/",
  "/index.html",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/apps/kimanh-bridge.css",
  "/apps/kimanh-bridge.js",
  "/apps/kimanh-memory.css",
  "/apps/kimanh-memory.js",
  "/apps/abcmyanh/",
  "/apps/abcmyanh/index.html",
  "/apps/abcmyanh/kimanh-memory-hook.js",
  "/apps/abcmyanh/sw.js",
  "/apps/abcmyanh/assets/app-icon-JTzbsX6F.svg",
  "/apps/abcmyanh/assets/index-sFzEZ3gn.css",
  "/apps/abcmyanh/assets/index-z_IRj-F1.js",
  "/apps/abcmyanh/assets/manifest-DA3jYvXZ.json",
  "/apps/vinh-paint/",
  "/apps/vinh-paint/index.html",
  "/apps/vinh-paint/app.js",
  "/apps/vinh-paint/kimanh-memory-hook.js",
  "/apps/vinh-paint/style.css",
  "/apps/vinh-paint/manifest.json",
  "/apps/vinh-paint/sw.js",
  "/apps/vinh-paint/datasets/animals.json",
  "/apps/vinh-xemvideo/",
  "/apps/vinh-xemvideo/index.html",
  "/apps/vinh-xemvideo/app.js",
  "/apps/vinh-xemvideo/kimanh-memory-hook.js",
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

  if (event.request.headers.has("range")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (shouldCache(event.request, response)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/").then((cached) => cached || caches.match(OFFLINE_URL));
          }

          if (event.request.destination === "document") {
            return caches.match(OFFLINE_URL);
          }

          return caches.match(OFFLINE_URL);
        });
    })
  );
});

function shouldCache(request, response) {
  if (!response || !response.ok) {
    return false;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return false;
  }

  if (/\.(mp4|mov|webm|m4v|mp3|wav|ogg|m4a)$/i.test(url.pathname)) {
    return false;
  }

  return true;
}
