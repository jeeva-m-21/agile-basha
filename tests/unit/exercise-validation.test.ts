import { describe, it, expect } from "vitest";
import { validateAnswer, normalizeSentence } from "@/lib/exercises/validation";

describe("Exercise Validation Engine", () => {
  it("normalizes sentences by stripping punctuation and extraneous whitespace", () => {
    expect(normalizeSentence("रामः   वनम्  गच्छति । ")).toBe("रामः वनम् गच्छति");
    expect(normalizeSentence("rāmaḥ,  vanam. gacchati!")).toBe("rāmaḥ vanam gacchati");
  });

  describe("fill_blank validation", () => {
    const exercise = {
      exerciseType: "fill_blank",
      correctOptionId: "opt-1",
      explanationEn: "Correct accusative form.",
      explanationTa: "சரியான உருபு.",
    };

    it("validates correct and incorrect options", () => {
      const correct = validateAnswer(exercise, { selectedOptionId: "opt-1" });
      expect(correct.correct).toBe(true);

      const wrong = validateAnswer(exercise, { selectedOptionId: "opt-2" });
      expect(wrong.correct).toBe(false);
    });
  });

  describe("match validation", () => {
    const exercise = {
      exerciseType: "match",
      pairs: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
      ],
      explanationEn: "All pairs matched!",
      explanationTa: "அனைத்தும் பொருந்தின!",
    };

    it("validates matching all pairs correctly", () => {
      const result = validateAnswer(exercise, {
        matchedPairs: [
          { leftId: "l1", rightId: "r1" },
          { leftId: "l2", rightId: "r2" },
        ],
      });
      expect(result.correct).toBe(true);
    });

    it("fails when incomplete or wrong pairs are submitted", () => {
      const incomplete = validateAnswer(exercise, {
        matchedPairs: [{ leftId: "l1", rightId: "r1" }],
      });
      expect(incomplete.correct).toBe(false);

      const wrong = validateAnswer(exercise, {
        matchedPairs: [
          { leftId: "l1", rightId: "r2" },
          { leftId: "l2", rightId: "r1" },
        ],
      });
      expect(wrong.correct).toBe(false);
    });
  });

  describe("build_sentence flexible word order validation", () => {
    const exercise = {
      exerciseType: "build_sentence",
      tiles: [
        { id: "t1", text: "रामः" },
        { id: "t2", text: "वनम्" },
        { id: "t3", text: "गच्छति" },
      ],
      acceptedTileSequences: [
        ["t1", "t2", "t3"],
        ["t2", "t1", "t3"],
        ["t3", "t1", "t2"],
      ],
      canonicalSentence: "रामः वनम् गच्छति",
      canonicalSentenceTa: "रामः वनम् गच्छति",
      explanationEn: "Valid Sanskrit sentence.",
      explanationTa: "சரியான சமஸ்கிருத வாக்கியம்.",
    };

    it("accepts canonical word order", () => {
      const result = validateAnswer(exercise, {
        selectedTileIds: ["t1", "t2", "t3"],
      });

      expect(result.correct).toBe(true);
      expect(result.isAlternativeOrder).toBe(false);
      expect(result.alsoCorrectEn).toBeUndefined();
    });

    it("accepts alternative valid word order and returns alsoCorrect guidance", () => {
      const result = validateAnswer(exercise, {
        selectedTileIds: ["t2", "t1", "t3"],
      });

      expect(result.correct).toBe(true);
      expect(result.isAlternativeOrder).toBe(true);
      expect(result.alsoCorrectEn).toContain("रामः वनम् गच्छति");
    });

    it("rejects incorrect tile combinations", () => {
      const result = validateAnswer(exercise, {
        selectedTileIds: ["t1", "t3"], // Missing object
      });

      expect(result.correct).toBe(false);
    });
  });

  describe("transliterate validation", () => {
    const exercise = {
      exerciseType: "transliterate",
      correctOptionId: "opt-1",
      explanationEn: "Spot on transliteration!",
      explanationTa: "சரியான ஒலிபெயர்ப்பு!",
    };

    it("validates transliterate choice option", () => {
      const correct = validateAnswer(exercise, { selectedOptionId: "opt-1" });
      expect(correct.correct).toBe(true);

      const wrong = validateAnswer(exercise, { selectedOptionId: "opt-3" });
      expect(wrong.correct).toBe(false);
    });
  });
});
