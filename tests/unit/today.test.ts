import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/today/route";
import { calculateUpdatedStreak, getStartOfWeek } from "@/lib/progress/streak";

describe("GET /api/today API Endpoint", () => {
  it("returns today's next lesson, review items, reading verse, and streak", async () => {
    const request = new Request("http://localhost:3000/api/today");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.nextLesson).toBeTruthy();
    expect(data.nextLesson.id).toBe("level-0-lesson-1");
    expect(data.nextLesson.estMinutes).toBeGreaterThan(0);

    expect(data.review).toBeTruthy();
    expect(data.reading).toBeTruthy();
    expect(data.reading.sanskrit).toBeTruthy();

    expect(data.streak).toBeTruthy();
    expect(data.streak.current).toBeGreaterThanOrEqual(1);

    expect(data.weekProgress).toBeTruthy();
  });
});

describe("Streak and Rest-Day Logic", () => {
  const currentWeek = getStartOfWeek(new Date(2026, 9, 5));

  it("extends streak on consecutive active days", () => {
    const initial = {
      currentStreak: 2,
      longestStreak: 5,
      lastActiveDate: "2026-10-04",
      restDayUsed: false,
      restDayWeekStart: currentWeek,
    };

    const result = calculateUpdatedStreak(initial, new Date(2026, 9, 5));
    expect(result.updated).toBe(true);
    expect(result.state.currentStreak).toBe(3);
    expect(result.state.restDayUsed).toBe(false);
  });

  it("does not increase streak if already active today", () => {
    const initial = {
      currentStreak: 2,
      longestStreak: 5,
      lastActiveDate: "2026-10-05",
      restDayUsed: false,
      restDayWeekStart: currentWeek,
    };

    const result = calculateUpdatedStreak(initial, new Date(2026, 9, 5));
    expect(result.updated).toBe(false);
    expect(result.state.currentStreak).toBe(2);
  });

  it("applies forgiving weekly rest day on missing 1 day without breaking streak", () => {
    const initial = {
      currentStreak: 4,
      longestStreak: 4,
      lastActiveDate: "2026-10-03", // Missed Oct 4th
      restDayUsed: false,
      restDayWeekStart: currentWeek,
    };

    const result = calculateUpdatedStreak(initial, new Date(2026, 9, 5)); // Active Oct 5th
    expect(result.updated).toBe(true);
    expect(result.state.currentStreak).toBe(5); // Preserved!
    expect(result.state.restDayUsed).toBe(true);
    expect(result.message).toContain("rest day");
  });

  it("resets streak warmly if more than allowed missed days", () => {
    const initial = {
      currentStreak: 10,
      longestStreak: 10,
      lastActiveDate: "2026-09-20", // Missed 15 days
      restDayUsed: false,
      restDayWeekStart: currentWeek,
    };

    const result = calculateUpdatedStreak(initial, new Date(2026, 9, 5));
    expect(result.updated).toBe(true);
    expect(result.state.currentStreak).toBe(1);
    expect(result.state.longestStreak).toBe(10); // Longest preserved
    expect(result.message).toContain("Welcome back");
  });
});
