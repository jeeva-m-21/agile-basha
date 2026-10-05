import { describe, it, expect } from "vitest";
import {
  calculateSM2,
  markItemKnown,
  resetItem,
  isItemDue,
  countDueItems,
  ReviewItem,
} from "@/lib/srs/sm2";

describe("SM-2 Spaced Repetition Algorithm", () => {
  it("calculates 1 day interval on first successful repetition (rep 0 -> 1)", () => {
    const result = calculateSM2({
      quality: 4,
      repetitions: 0,
      previousInterval: 1,
      previousEaseFactor: 2.5,
    });

    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBe(2.5); // q=4: EF remains unchanged
  });

  it("calculates 6 days interval on second successful repetition (rep 1 -> 2)", () => {
    const result = calculateSM2({
      quality: 5,
      repetitions: 1,
      previousInterval: 1,
      previousEaseFactor: 2.5,
    });

    expect(result.repetitions).toBe(2);
    expect(result.interval).toBe(6);
    expect(result.easeFactor).toBeGreaterThan(2.5); // q=5: EF increases
  });

  it("calculates interval = previousInterval * EF on third and subsequent repetitions", () => {
    const result = calculateSM2({
      quality: 4,
      repetitions: 2,
      previousInterval: 6,
      previousEaseFactor: 2.5,
    });

    expect(result.repetitions).toBe(3);
    // 6 * 2.5 = 15 days
    expect(result.interval).toBe(15);
  });

  it("resets repetitions to 0 and interval to 1 on failed recall (quality < 3)", () => {
    const result = calculateSM2({
      quality: 2,
      repetitions: 4,
      previousInterval: 30,
      previousEaseFactor: 2.5,
    });

    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it("enforces minimum Ease Factor of 1.3", () => {
    let ef = 1.4;
    for (let i = 0; i < 5; i++) {
      const res = calculateSM2({
        quality: 0,
        repetitions: 0,
        previousInterval: 1,
        previousEaseFactor: ef,
      });
      ef = res.easeFactor;
    }

    expect(ef).toBe(1.3);
  });

  it("markItemKnown fast-forwards interval and marks item as mastered", () => {
    const item: ReviewItem = {
      id: "test-1",
      userId: "user-1",
      itemType: "word",
      sanskrit: "रामः",
      iast: "rāmaḥ",
      tamilScript: "ராம:",
      meaningEn: "Rama",
      meaningTa: "இராமன்",
      nextDue: new Date().toISOString(),
      intervalDays: 1,
      easeFactor: 2.5,
      repCount: 1,
    };

    const updated = markItemKnown(item, 14);
    expect(updated.intervalDays).toBe(14);
    expect(updated.repCount).toBe(3);
    expect(new Date(updated.nextDue).getTime()).toBeGreaterThan(Date.now());
  });

  it("resetItem resets item back to day 1 interval and 0 repetitions", () => {
    const item: ReviewItem = {
      id: "test-2",
      userId: "user-1",
      itemType: "word",
      sanskrit: "वनम्",
      iast: "vanam",
      tamilScript: "வநம்",
      meaningEn: "Forest",
      meaningTa: "காடு",
      nextDue: new Date(Date.now() + 864000000).toISOString(),
      intervalDays: 10,
      easeFactor: 2.8,
      repCount: 4,
    };

    const reset = resetItem(item);
    expect(reset.intervalDays).toBe(1);
    expect(reset.easeFactor).toBe(2.5);
    expect(reset.repCount).toBe(0);
  });

  it("isItemDue and countDueItems identify items due for review", () => {
    const pastItem: ReviewItem = {
      id: "due-1",
      userId: "user-1",
      itemType: "vowel",
      sanskrit: "अ",
      iast: "a",
      tamilScript: "அ",
      meaningEn: "Short a",
      meaningTa: "குறில் அ",
      nextDue: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
      intervalDays: 1,
      easeFactor: 2.5,
      repCount: 0,
    };

    const futureItem: ReviewItem = {
      ...pastItem,
      id: "not-due",
      nextDue: new Date(Date.now() + 86400000).toISOString(), // 1 day in future
    };

    expect(isItemDue(pastItem)).toBe(true);
    expect(isItemDue(futureItem)).toBe(false);
    expect(countDueItems([pastItem, futureItem])).toBe(1);
  });
});
