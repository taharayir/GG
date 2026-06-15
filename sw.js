/* ═══════════════════════════════════════
   sw.js — سرویس‌ورکر (آفلاین)
═══════════════════════════════════════ */

// هر بار که آپدیت مهمی دادی، این عدد رو زیاد کن (v2, v3, ...)
// تا کش قدیمی پاک بشه و نسخه‌ی جدید لود شه
const CACHE_NAME = 'myplan-v3';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/particles.js',
  './js/audio.js',
  './js/habits.js',
  './js/plan.js',
  './js/app.js',
  './manifest.json',
  './assets/bg.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// استراتژی: اول شبکه (network-first) — همیشه آخرین نسخه رو می‌گیره
// و فقط وقتی آفلاینی، از کش استفاده می‌کنه
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
