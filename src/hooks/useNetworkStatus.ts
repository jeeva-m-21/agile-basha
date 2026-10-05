"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getOfflineQueueCount,
  syncOfflineQueue,
} from "@/lib/offline/queue";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const refreshCount = useCallback(async () => {
    try {
      const count = await getOfflineQueueCount();
      setPendingCount(count);
    } catch {
      setPendingCount(0);
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.onLine || isSyncing) return;
    setIsSyncing(true);
    try {
      await syncOfflineQueue();
      await refreshCount();
    } catch (err) {
      console.warn("[NetworkStatus] Sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshCount]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
      refreshCount();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    refreshCount();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncNow, refreshCount]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    refreshCount,
    syncNow,
  };
}
