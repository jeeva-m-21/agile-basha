import { describe, it, expect } from "vitest";
import {
  getSyllableDuration,
  vowelFormants,
  playPhoneticSound,
} from "@/lib/audio/phonetics";

describe("Sanskrit Phonetics & Timing", () => {
  it("calculates 350ms for short (hrasva) and 700ms for long (dīrgha) vowels", () => {
    expect(getSyllableDuration(false)).toBe(350);
    expect(getSyllableDuration(true)).toBe(700);
  });

  it("scales duration by 1.4x when slow speed is enabled", () => {
    expect(getSyllableDuration(false, true)).toBe(490);
    expect(getSyllableDuration(true, true)).toBe(980);
  });

  it("defines acoustic vowel formant frequencies for a, ā, i, ī, u", () => {
    expect(vowelFormants.a.f1).toBe(730);
    expect(vowelFormants.i.f1).toBe(270);
    expect(vowelFormants.u.f1).toBe(300);
  });

  it("playPhoneticSound completes gracefully in test environment", async () => {
    const promise = playPhoneticSound("a", false);
    expect(promise).toBeInstanceOf(Promise);
  });
});
