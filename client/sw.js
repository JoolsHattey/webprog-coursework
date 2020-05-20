self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('quizapp').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/components/'
      ]);
    })
  );
});
// self.addEventListener('fetch', event => {
//     console.log('Fetch event for ', event.request.url);
//     event.respondWith(
//         caches.match(event.request)
//         .then(response => {
//             if (response) {
//                 console.log('Found ', event.request.url, ' in cache');
//                 return response;
//             }
//             console.log('Network request for ', event.request.url);
//             return fetch(event.request).then(response => {
//                 // TODO 5 - Respond with custom 404 page
//                 return caches.open(staticCacheName).then(cache => {
//                   cache.put(event.request.url, response.clone());
//                   return response;
//                 });
//               });

//             // TODO 4 - Add fetched files to the cache

//         }).catch(error => {

//             // TODO 6 - Respond with custom offline page

//         })
//     );
// })