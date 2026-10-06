import { describe, it, expect } from "vitest";
import {
  placementQuestions,
  evaluatePlacementQuiz,
} from "@/lib/curriculum/placement";

describe("Placement Diagnostic Engine", () => {
  it("contains diagnostic questions spanning all 5 difficulty bands", () => {
    expect(placementQuestions.length).toBeGreaterThanOrEqual(5);

    const bands = placementQuestions.map((q) => q.band);
    expect(bands).toContain(0); // Script & Sounds
    expect(bands).toContain(1); // Vocabulary
    expect(bands).toContain(2); // Simple Verbs
    expect(bands).toContain(3); // Cases
    expect(bands).toContain(4); // Sentences & Syntax
  });

  it("each question has valid options with exactly one correct option", () => {
    for (const q of placementQuestions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      const correctOptions = q.options.filter((o) => o.isCorrect);
      expect(correctOptions.length).toBe(1);
      expect(q.topicEn).toBeTruthy();
      expect(q.promptEn).toBeTruthy();
      expect(q.explanationEn).toBeTruthy();
    }
  });

  it("recommends Level 0 for low score (< 4)", () => {
    const answers: Record<string, string> = {
      "pq-0-1": "opt-2", // 1 correct
    };

    const result = evaluatePlacementQuiz(answers);
    expect(result.score).toBe(1);
    expect(result.recommendedLevel).toBe("level-0");
    expect(result.recommendedLesson).toBe("level-0-lesson-1");
    expect(result.masteredSkills.length).toBe(1);
    expect(result.reviewSkills.length).toBeGreaterThan(0);
  });

  it("recommends Level 1 for moderate score (4 to 6)", () => {
    const answers: Record<string, string> = {};
    // Answer first 5 questions correctly
    for (let i = 0; i < 5; i++) {
      const q = placementQuestions[i];
      const correct = q.options.find((o) => o.isCorrect);
      if (correct) answers[q.id] = correct.id;
    }

    const result = evaluatePlacementQuiz(answers);
    expect(result.score).toBe(5);
    expect(result.recommendedLevel).toBe("level-1");
    expect(result.recommendedLesson).toBe("level-1-lesson-1");
    expect(result.percentage).toBeGreaterThanOrEqual(50);
  });

  it("recommends Level 2 for high score (>= 7)", () => {
    const answers: Record<string, string> = {};
    // Answer all questions correctly
    for (const q of placementQuestions) {
      const correct = q.options.find((o) => o.isCorrect);
      if (correct) answers[q.id] = correct.id;
    }

    const result = evaluatePlacementQuiz(answers);
    expect(result.score).toBe(placementQuestions.length);
    expect(result.recommendedLevel).toBe("level-2");
    expect(result.percentage).toBe(100);
    expect(result.masteredSkills.length).toBeGreaterThanOrEqual(4);
    expect(result.reviewSkills.length).toBe(0);
  });
});
