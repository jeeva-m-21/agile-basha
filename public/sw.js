const CACHE_NAME = "basha-cache-v2";
const AUDIO_CACHE = "basha-audio-v2";

const SHELL_PRECACHE_URLS = [
  "/",
  "/onboarding",
  "/home",
  "/learn",
  "/practice",
  "/review",
  "/read",
  "/dictionary",
  "/me",
  "/icon.svg",
  "/manifest.json",
  "/api/today",
  "/api/progress/summary",
  "/api/dictionary/grammar",
  "/api/lessons/level-0-lesson-1",
  "/api/lessons/level-0-lesson-2",
  "/lesson/level-0-lesson-1",
  "/lesson/level-0-lesson-2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_PRECACHE_URLS).catch((err) => {
        console.warn("[SW] Precaching error:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== AUDIO_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Audio formant and synthesizer assets: Cache-first
  if (url.pathname.includes("/audio/") || event.request.destination === "audio") {
    event.respondWith(
      caches.open(AUDIO_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // 2. AI Tutor and AI translation endpoints: network only with friendly offline JSON fallback
  if (url.pathname.includes("/api/tutor/") || url.pathname === "/api/reader/translate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            error: "offline",
            messageEn: "This AI service requires an internet connection.",
            messageTa: "இந்த AI சேவைக்கு இணைய இணைப்பு தேவை.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // 3. For all other GET requests: Network-first with cache fallback
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            // If navigating to an HTML page and offline, fallback to cached /home or /
            if (event.request.mode === "navigate") {
              return caches.match("/home") || caches.match("/");
            }
            return new Response("Offline", { status: 503, statusText: "Offline" });
          });
        })
    );
  }
});

// Listen for messages from client (e.g. precache lesson list)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "PRECACHE_LESSONS") {
    const urls = event.data.urls || [];
    if (urls.length > 0) {
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(urls).catch((e) => console.warn("[SW] Error precaching lessons:", e));
      });
    }
  }
});
