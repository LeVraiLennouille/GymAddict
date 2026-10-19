const CACHE_VERSION = 'ga-v2.8.0';
const CACHE_STATIC  = `${CACHE_VERSION}-static`;
const CACHE_FONTS   = `${CACHE_VERSION}-fonts`;

const STATIC_ASSETS = [
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-512-maskable.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      console.log('[SW] Pre-caching static assets…');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('[SW] Installation terminée ✓');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  const CURRENT_CACHES = [CACHE_STATIC, CACHE_FONTS];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => !CURRENT_CACHES.includes(name))
          .map(name => {
            console.log('[SW] Suppression ancien cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation & contrôle des clients ✓');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(event.request, CACHE_FONTS));
    return;
  }

  if (url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(cacheFirst(event.request, CACHE_FONTS));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(event.request, CACHE_STATIC));
    return;
  }

  event.respondWith(networkFirst(event.request));
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Hors ligne – ressource non disponible', { status: 503 });
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_STATIC);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return cache.match('./index.html');
    }
    return new Response('Hors ligne', { status: 503 });
  }
}

self.addEventListener('sync', event => {
  if (event.tag === 'sync-workouts') {
    console.log('[SW] Background sync déclenché (réservé pour sync future)');
  }
});