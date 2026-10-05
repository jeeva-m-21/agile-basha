/**
 * Offline Sync Queue using IndexedDB with localStorage fallback.
 * Allows lesson exercises, completions, and reviews to be completed offline
 * and automatically synced when network connectivity returns.
 */

export interface OfflineAction {
  id: string;
  type: "lesson_answer" | "lesson_complete" | "review_answer";
  url: string;
  payload: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}

const DB_NAME = "basha_offline_db";
const STORE_NAME = "offline_actions";
const DB_VERSION = 1;
const FALLBACK_KEY = "basha_offline_queue_backup";

function hasIndexedDB(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!hasIndexedDB()) {
      return reject(new Error("IndexedDB not available"));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback helpers using localStorage
function getFallbackQueue(): OfflineAction[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFallbackQueue(items: OfflineAction[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(items));
  } catch {}
}

/**
 * Enqueue an action to be synchronized later.
 */
export async function enqueueOfflineAction(
  type: OfflineAction["type"],
  url: string,
  payload: Record<string, unknown>
): Promise<OfflineAction> {
  const action: OfflineAction = {
    id: `action_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    type,
    url,
    payload,
    timestamp: Date.now(),
    retryCount: 0,
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(action);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage
    const queue = getFallbackQueue();
    queue.push(action);
    saveFallbackQueue(queue);
  }

  return action;
}

/**
 * Get all pending actions from the queue.
 */
export async function getOfflineQueue(): Promise<OfflineAction[]> {
  try {
    const db = await openDB();
    return await new Promise<OfflineAction[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getFallbackQueue();
  }
}

/**
 * Remove an action by ID after successful sync.
 */
export async function removeOfflineAction(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const queue = getFallbackQueue().filter((item) => item.id !== id);
    saveFallbackQueue(queue);
  }
}

/**
 * Clear the entire offline queue.
 */
export async function clearOfflineQueue(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(FALLBACK_KEY);
    }
  }
}

/**
 * Get total pending count.
 */
export async function getOfflineQueueCount(): Promise<number> {
  const items = await getOfflineQueue();
  return items.length;
}

/**
 * Synchronize all pending items in the offline queue with the server.
 */
export async function syncOfflineQueue(
  customFetch: typeof fetch = fetch
): Promise<{ synced: number; failed: number }> {
  const queue = await getOfflineQueue();
  if (queue.length === 0) {
    return { synced: 0, failed: 0 };
  }

  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      const res = await customFetch(item.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      });

      if (res.ok || (res.status >= 200 && res.status < 300)) {
        await removeOfflineAction(item.id);
        synced++;
      } else if (res.status >= 400 && res.status < 500) {
        // Bad request / invalid state, discard so it doesn't block the queue indefinitely
        await removeOfflineAction(item.id);
        failed++;
      } else {
        // 5xx or server down, keep in queue
        failed++;
      }
    } catch {
      // Network still down or request threw
      failed++;
    }
  }

  return { synced, failed };
}
