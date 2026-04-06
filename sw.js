const CACHE_NAME = 'miraz-pro-v50'; // ভার্সন নম্বর বাড়িয়ে দিলাম যাতে আপডেট হয়
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&display=swap'
];

// ১. ফাইলগুলো ফোনের মেমোরিতে জমা করা (Installation)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('সব ফাইল অফলাইনের জন্য সেভ করা হচ্ছে...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); 
});

// ২. পুরোনো ক্যাশ ফাইল পরিষ্কার করা (Activation)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// ৩. ইন্টারনেট না থাকলেও মেমোরি থেকে ফাইল চালানো (Fetching)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // যদি মেমোরিতে ফাইল থাকে তবে সেটি দাও, নাহলে নেট থেকে নাও
      return cachedResponse || fetch(event.request).catch(() => {
        // যদি একদম নেট না থাকে এবং নেভিগেট করার চেষ্টা করে তবে হোম পেজ দাও
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
