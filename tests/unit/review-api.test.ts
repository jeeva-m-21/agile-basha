import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "@/app/api/review/route";
import { POST as postAnswer } from "@/app/api/review/answer/route";
import { reviewStore } from "@/lib/srs/storage";

describe("Review API Routes", () => {
  beforeEach(() => {
    reviewStore.resetStore();
  });

  it("GET /api/review returns due items and correct dueCount", async () => {
    const request = new Request("http://localhost:3000/api/review");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.dueCount).toBeGreaterThanOrEqual(4);
    expect(data.items.length).toBeGreaterThanOrEqual(4);
    expect(data.estMinutes).toBeGreaterThanOrEqual(1);

    const firstItem = data.items[0];
    expect(firstItem.sanskrit).toBeTruthy();
    expect(firstItem.iast).toBeTruthy();
    expect(firstItem.meaningEn).toBeTruthy();
  });

  it("POST /api/review/answer updates review item using SM-2 rating", async () => {
    const request = new Request("http://localhost:3000/api/review/answer", {
      method: "POST",
      body: JSON.stringify({
        itemId: "rev-vowel-1",
        quality: 4,
        action: "rate",
      }),
    });

    const response = await postAnswer(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.updatedItem.repCount).toBe(1);
    expect(data.updatedItem.intervalDays).toBe(1);
    expect(data.attempt.quality).toBe(4);
  });

  it("POST /api/review/answer with action 'know_this' marks item as mastered", async () => {
    const request = new Request("http://localhost:3000/api/review/answer", {
      method: "POST",
      body: JSON.stringify({
        itemId: "rev-word-1",
        action: "know_this",
      }),
    });

    const response = await postAnswer(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.updatedItem.intervalDays).toBe(14);
    expect(data.updatedItem.repCount).toBeGreaterThanOrEqual(3);
  });

  it("POST /api/review/answer with action 'reset' resets item interval", async () => {
    const request = new Request("http://localhost:3000/api/review/answer", {
      method: "POST",
      body: JSON.stringify({
        itemId: "rev-word-2",
        action: "reset",
      }),
    });

    const response = await postAnswer(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.updatedItem.intervalDays).toBe(1);
    expect(data.updatedItem.repCount).toBe(0);
    expect(data.updatedItem.easeFactor).toBe(2.5);
  });
});
