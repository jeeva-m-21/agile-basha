import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  enqueueOfflineAction,
  getOfflineQueue,
  getOfflineQueueCount,
  removeOfflineAction,
  clearOfflineQueue,
  syncOfflineQueue,
} from "@/lib/offline/queue";

describe("Offline Sync Queue", () => {
  beforeEach(async () => {
    await clearOfflineQueue();
  });

  it("enqueues and retrieves actions", async () => {
    const action = await enqueueOfflineAction("lesson_answer", "/api/lessons/l1/answer", {
      selectedOptionId: "opt-1",
    });

    expect(action.id).toBeDefined();
    expect(action.type).toBe("lesson_answer");
    expect(action.url).toBe("/api/lessons/l1/answer");
    expect(action.payload).toEqual({ selectedOptionId: "opt-1" });

    const queue = await getOfflineQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].id).toBe(action.id);

    const count = await getOfflineQueueCount();
    expect(count).toBe(1);
  });

  it("removes a single action by id", async () => {
    const a1 = await enqueueOfflineAction("lesson_answer", "/api/1", {});
    const a2 = await enqueueOfflineAction("lesson_complete", "/api/2", {});

    expect(await getOfflineQueueCount()).toBe(2);

    await removeOfflineAction(a1.id);
    const remaining = await getOfflineQueue();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(a2.id);
  });

  it("clears the whole queue", async () => {
    await enqueueOfflineAction("lesson_answer", "/api/1", {});
    await enqueueOfflineAction("review_answer", "/api/2", {});
    expect(await getOfflineQueueCount()).toBe(2);

    await clearOfflineQueue();
    expect(await getOfflineQueueCount()).toBe(0);
  });

  it("syncs successfully synced actions and removes them from queue", async () => {
    await enqueueOfflineAction("lesson_answer", "/api/lessons/1/answer", { opt: "a" });
    await enqueueOfflineAction("lesson_complete", "/api/lessons/1/complete", { lessonId: "1" });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    const result = await syncOfflineQueue(mockFetch as unknown as typeof fetch);

    expect(result.synced).toBe(2);
    expect(result.failed).toBe(0);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    const remaining = await getOfflineQueue();
    expect(remaining.length).toBe(0);
  });

  it("handles network failure and retains failed actions for retry", async () => {
    await enqueueOfflineAction("review_answer", "/api/review/answer", { itemId: "rev-1" });

    const mockFetch = vi.fn().mockRejectedValue(new Error("Network offline"));

    const result = await syncOfflineQueue(mockFetch as unknown as typeof fetch);

    expect(result.synced).toBe(0);
    expect(result.failed).toBe(1);

    const remaining = await getOfflineQueue();
    expect(remaining.length).toBe(1);
  });

  it("discards 4xx bad requests so they do not block queue forever", async () => {
    await enqueueOfflineAction("lesson_answer", "/api/invalid", { bad: "data" });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Bad Request" }),
    });

    const result = await syncOfflineQueue(mockFetch as unknown as typeof fetch);

    expect(result.synced).toBe(0);
    expect(result.failed).toBe(1);

    // Bad requests are cleared
    const remaining = await getOfflineQueue();
    expect(remaining.length).toBe(0);
  });
});
