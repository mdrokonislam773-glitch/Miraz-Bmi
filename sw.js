const CACHE_NAME = 'miraz-pro-v25';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&display=swap'
];

// ১. ফাইলগুলো ফোনে সেভ করা (Install Event)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('ফাইলগুলো ক্যাশ করা হচ্ছে...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); // নতুন আপডেট সাথে সাথে কার্যকর হবে
});

// ২. পুরোনো ফাইল মুছে ফেলা (Activate Event)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// ৩. অফলাইন মোডে ফাইল চালানো (Fetch Event)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // যদি ক্যাশে ফাইল থাকে তবে সেটি দাও, নাহলে নেট থেকে নাও
      return res || fetch(e.request).catch(() => {
        // যদি একদম নেট না থাকে তবে হোম পেজ দেখাও
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
