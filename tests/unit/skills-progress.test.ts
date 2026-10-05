import { describe, it, expect } from "vitest";
import {
  SKILL_GRAPH,
  computeProgressSummary,
} from "@/lib/progress/skills";

describe("Skill Map & Progress Engine (SPEC §13.1 & §13.2)", () => {
  it("defines skill nodes spanning sounds, sentences, vibhaktis, sandhi, and reading", () => {
    expect(SKILL_GRAPH.length).toBeGreaterThanOrEqual(8);

    const categories = new Set(SKILL_GRAPH.map((s) => s.category));
    expect(categories.has("sounds")).toBe(true);
    expect(categories.has("sentences")).toBe(true);
    expect(categories.has("vibhaktis")).toBe(true);
    expect(categories.has("sandhi")).toBe(true);
    expect(categories.has("reading")).toBe(true);
  });

  it("calculates level progress percentage and 'You can now' statement", () => {
    const summary = computeProgressSummary();

    expect(summary.currentLevel).toBe(1);
    expect(summary.levelProgressPercent).toBeGreaterThan(0);
    expect(summary.levelProgressPercent).toBeLessThanOrEqual(100);
    expect(summary.youCanNowEn).toBeDefined();
    expect(summary.youCanNowTa).toBeDefined();
    expect(summary.youCanNowEn.length).toBeGreaterThan(10);
  });

  it("calculates progress percentage when custom skill states are provided", () => {
    // All mastered -> 100%
    const allMastered: Record<string, "mastered"> = {};
    SKILL_GRAPH.forEach((s) => {
      allMastered[s.id] = "mastered";
    });

    const summary100 = computeProgressSummary(allMastered);
    expect(summary100.levelProgressPercent).toBe(100);

    // All locked -> 0%
    const allLocked: Record<string, "locked"> = {};
    SKILL_GRAPH.forEach((s) => {
      allLocked[s.id] = "locked";
    });

    const summary0 = computeProgressSummary(allLocked);
    expect(summary0.levelProgressPercent).toBe(0);
  });

  it("includes vocabulary count, review due, and protected rest day stats", () => {
    const summary = computeProgressSummary();

    expect(summary.stats.vocabularyCount).toBeGreaterThan(0);
    expect(summary.stats.wordsLearned).toBeGreaterThan(0);
    expect(summary.stats.wordsDueForReview).toBeGreaterThanOrEqual(0);
    expect(summary.stats.restDayProtected).toBe(true);
    expect(summary.stats.streakDays).toBeGreaterThanOrEqual(1);
  });
});
