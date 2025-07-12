const CACHE_VERSION = "v1"
const CACHE_NAME = `site-cache-${CACHE_VERSION}`

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/blog.html",
  "/post.html",
  "/src/auth.js",
  "/src/blog-posts.js",
  "/src/supabase-client.js",
  "/src/ui.js",
]

self.addEventListener("install", (event) => {
  console.log("[SW] Install")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE)
      })
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate")
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        )
      })
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const request = event.request

  const url = new URL(request.url)
  const isLocal = url.origin === self.location.origin

  if (!isLocal) return

  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request)
          .then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone())
              return response
            })
          })
          .catch(() => {
            return new Response("Offline", { status: 503 })
          })
      )
    }),
  )
})
