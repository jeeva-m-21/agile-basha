import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { enqueueOfflineAction, clearOfflineQueue } from "@/lib/offline/queue";

describe("useNetworkStatus hook", () => {
  beforeEach(async () => {
    await clearOfflineQueue();
  });

  it("reports online by default", () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.pendingCount).toBe(0);
    expect(result.current.isSyncing).toBe(false);
  });

  it("updates state on offline and online window events", async () => {
    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current.isOnline).toBe(false);

    await act(async () => {
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current.isOnline).toBe(true);
  });

  it("updates pending count when items are enqueued and refreshed", async () => {
    const { result } = renderHook(() => useNetworkStatus());

    await enqueueOfflineAction("lesson_answer", "/api/test", { q: 1 });

    await act(async () => {
      await result.current.refreshCount();
    });

    expect(result.current.pendingCount).toBe(1);
  });
});
