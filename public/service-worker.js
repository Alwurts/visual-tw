const CACHE_NAME = "version-0.0.1-beta";
const urlsToCache = ["index.html", "offline.html"];

// eslint-disable-next-line @typescript-eslint/no-this-alias
const self = this;

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return the cached asset if found
        //console.log("Found", event.request.url, "in cache");
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
      .catch(() => {
        console.error("Failed to fetch", event.request.url);
        // If both cache and network fail, show the offline page
        return caches.match("/offline.html");
      }),
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]; // List all cache versions you want to keep

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete the caches that are not in the whitelist
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
