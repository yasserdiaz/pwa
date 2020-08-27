self.importScripts('data/games.js');

// Files to cache
var cacheName = 'js13kPWA-v1';
var appShellFiles = [
  '/pwa2/',
  '/pwa2/index.html',
  '/pwa2/app.js',
  '/pwa2/style.css',
  '/pwa2/fonts/graduate.eot',
  '/pwa2/fonts/graduate.ttf',
  '/pwa2/fonts/graduate.woff',
  '/pwa2/favicon.ico',
  '/pwa2/img/js13kgames.png',
  '/pwa2/img/bg.png',
  '/pwa2/icons/icon-32.png',
  '/pwa2/icons/icon-64.png',
  '/pwa2/icons/icon-96.png',
  '/pwa2/icons/icon-128.png',
  '/pwa2/icons/icon-168.png',
  '/pwa2/icons/icon-192.png',
  '/pwa2/icons/icon-256.png',
  '/pwa2/icons/icon-512.png'
];
var gamesImages = [];
for(var i=0; i<games.length; i++) {
  gamesImages.push('data/img/'+games[i].slug+'.jpg');
}
var contentToCache = appShellFiles.concat(gamesImages);

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
