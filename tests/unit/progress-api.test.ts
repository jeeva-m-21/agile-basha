import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/progress/summary/route";

describe("Progress API (GET /api/progress/summary)", () => {
  it("returns 200 with level progress, skills graph, and stats", async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.currentLevel).toBe(1);
    expect(data.levelProgressPercent).toBeGreaterThan(0);
    expect(data.skills).toBeInstanceOf(Array);
    expect(data.skills.length).toBeGreaterThanOrEqual(8);
    expect(data.stats).toBeDefined();
    expect(data.stats.minutesPracticedWeek).toBeGreaterThanOrEqual(0);
    expect(data.stats.lessonsCompletedWeek).toBeGreaterThanOrEqual(0);
  });
});
