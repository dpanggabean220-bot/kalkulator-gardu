const CACHE_VERSION = "v1";
const CACHE_NAME = `kalkulator-gi-${CACHE_VERSION}`;

// Files to cache - must match exactly what's used in index.html including ?v= parameters
const urlsToCache = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/style.css?v=3",
    "./js/rumus.js?v=3",
    "./js/ui.js?v=4",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/apple-touch-icon.png"
];

// Install service worker and cache all files
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Meng-cache file aplikasi');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                // Force the waiting service worker to become active
                return self.skipWaiting();
            })
    );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            // Take control of all clients under the service worker's scope
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', function(event) {
    // Only handle GET requests to same origin
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    // Only handle requests to same origin
    if (url.origin !== location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(function(cachedResponse) {
                // Return cached response if found
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, fetch from network
                return fetch(event.request).then(function(networkResponse) {
                    // Check if we received a valid response
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Clone the response because it's a stream that can only be consumed once
                    const responseToCache = networkResponse.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return networkResponse;
                });
            })
            .catch(function() {
                // If both cache and network fail, show offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});