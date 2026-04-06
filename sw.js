const CACHE_NAME = 'miraz-pro-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// সার্ভিস ওয়ার্কার ইন্সটল করা এবং ফাইল ক্যাশ করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// অফলাইনে ফাইলগুলো প্রদর্শন করা
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ক্যাশে থাকলে সেটি দাও, না থাকলে নেটওয়ার্ক থেকে নাও
        return response || fetch(event.request);
      }).catch(() => {
        // যদি একদমই নেট না থাকে এবং ক্যাশেও না থাকে
        return caches.match('./index.html');
      })
  );
});

// পুরনো ক্যাশ ডিলিট করা
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
