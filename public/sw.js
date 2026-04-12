// Simple pass-through Service Worker to satisfy PWA installation criteria
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // We just pass through all requests natively, we rely on standard browser cache.
    // The presence of this fetch listener alone tells the browser "I can be installed as a PWA".
    event.respondWith(fetch(event.request));
});
