const FILES_TO_CACHE = [
    "/", 
    "/index.html",
    "index.js", 
    "/indexedDB.js", 
    "/styles.css"
];

const STATIC_CACHE = "static-cache-v2";
const RUNTIME_CACHE = "runtime-cache";

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log("files cached");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
    if(event.request.url.includes('/api/')) {
        console.log('[Service Worker] Fetch(data)', event.request.url);
    
event.respondWith(
                caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if (response.status === 200){
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(event.request);
                });
            })
            );
            return;
        }

event.respondWith(
    caches.open(STATIC_CACHE).then( cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request);
      });
    })
  );
});