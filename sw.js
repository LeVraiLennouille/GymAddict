const CACHE_VERSION = 'ga-v2.8.6';
const CACHE_STATIC  = `${CACHE_VERSION}-static`;
const CACHE_FONTS   = `${CACHE_VERSION}-fonts`;
const CACHE_CONFIG  = 'ga-config'; /* non versionné : config des rappels, lue ici et écrite par la page */

const STATIC_ASSETS = [
  './index.html',
  './style.css',
  './js/loader.js',
  './js/data.js',
  './js/core.js',
  './js/stubs.js',
  './js/app.js',
  './js/stats.js',
  './js/week.js',
  './js/cardio.js',
  './js/profile.js',
  './js/reminders.js',
  './js/history.js',
  './js/editor.js',
  './js/backup.js',
  './js/swap.js',
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
  const CURRENT_CACHES = [CACHE_STATIC, CACHE_FONTS, CACHE_CONFIG];
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

/* ============================================================
   RAPPELS D'ENTRAÎNEMENT
   La page écrit la config dans le cache « ga-config » ; ce service worker la lit et affiche la notification.
   Déclencheurs : Periodic Background Sync (appli installée, Chrome/Edge Android) ou message « check-reminder »
   envoyé chaque minute par la page quand elle est ouverte.
   ============================================================ */
const REMINDER_CONFIG_URL = new URL('./__ga-reminder-config', self.registration.scope).href;

async function readReminderConfig() {
  const cache = await caches.open(CACHE_CONFIG);
  const res = await cache.match(REMINDER_CONFIG_URL);
  return res ? res.json() : null;
}
async function writeReminderConfig(cfg) {
  const cache = await caches.open(CACHE_CONFIG);
  await cache.put(REMINDER_CONFIG_URL, new Response(JSON.stringify(cfg), { headers: { 'Content-Type': 'application/json' } }));
}
const localDayKey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

async function checkReminder() {
  const cfg = await readReminderConfig();
  if (!cfg || !cfg.enabled || Notification.permission !== 'granted') return false;
  const now = new Date(), day = now.getDay(), key = localDayKey(now);
  if (!Array.isArray(cfg.days) || !cfg.days.includes(day)) return false;
  const [h, m] = String(cfg.time || '18:00').split(':').map(Number);
  const due = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h || 0, m || 0).getTime();
  const t = now.getTime();
  if (t < due || t > due + 3 * 3600 * 1000) return false;          /* fenêtre : l'heure dite + 3 h */
  if (cfg.lastNotified === key || cfg.trainedDate === key) return false; /* déjà notifié / déjà entraîné */
  const label = (cfg.labels && cfg.labels[day]) || 'Séance du jour';
  const icon = new URL('./assets/icon-192.png', self.registration.scope).href;
  await self.registration.showNotification("GymAddict · C'est l'heure !", {
    body: label + ' t’attend. Prêt à t’y mettre ?',
    tag: 'ga-reminder',
    icon,
    badge: icon,
    data: { url: './index.html#today' }
  });
  cfg.lastNotified = key;
  await writeReminderConfig(cfg);
  return true;
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'check-reminder') {
    event.waitUntil(checkReminder().catch(() => false));
  }
});

self.addEventListener('periodicsync', event => {
  if (event.tag === 'ga-reminder') {
    event.waitUntil(checkReminder().catch(() => false));
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || './index.html#today', self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) {
          return client.focus().then(() => ('navigate' in client ? client.navigate(url).catch(() => {}) : undefined));
        }
      }
      return self.clients.openWindow(url);
    })
  );
});