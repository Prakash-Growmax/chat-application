const CACHE_NAME = "chat-shell-v1";

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Served from cache:", event.request.url);
        return response;
      }
      console.log("Fetching from network:", event.request.url);
      return fetch(event.request);
    })
  );
});
