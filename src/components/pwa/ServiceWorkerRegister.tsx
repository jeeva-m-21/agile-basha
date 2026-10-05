"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Once service worker is active, precache next 7 days of lessons & curriculum
        if (registration.active) {
          registration.active.postMessage({
            type: "PRECACHE_LESSONS",
            urls: [
              "/api/lessons/level-0-lesson-1",
              "/api/lessons/level-0-lesson-2",
              "/lesson/level-0-lesson-1",
              "/lesson/level-0-lesson-2",
              "/api/today",
              "/api/progress/summary",
              "/api/review",
              "/api/dictionary/grammar",
            ],
          });
        }
      })
      .catch((err) => {
        console.warn("[SW] Registration failed:", err);
      });
  }, []);

  return null;
}
