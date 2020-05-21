self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('quizapp').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/components/',
      ]);
    }),
  );
});
