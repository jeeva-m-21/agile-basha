import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/lessons/[id]/route";
import { POST as postAnswer } from "@/app/api/lessons/[id]/answer/route";
import { POST as postComplete } from "@/app/api/lessons/[id]/complete/route";

describe("Lesson API Routes", () => {
  it("GET /api/lessons/:id returns complete lesson steps", async () => {
    const request = new Request("http://localhost:3000/api/lessons/level-0-lesson-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "level-0-lesson-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.lesson).toBeTruthy();
    expect(data.lesson.id).toBe("level-0-lesson-1");
    expect(data.lesson.steps.length).toBe(8);

    // Verify step types
    const types = data.lesson.steps.map((s: any) => s.type);
    expect(types).toContain("see_it");
    expect(types).toContain("notice_it");
    expect(types).toContain("rule");
    expect(types).toContain("exercise");
    expect(types).toContain("recap");
  });

  it("POST /api/lessons/:id/answer validates correct and incorrect answers", async () => {
    // 1. Correct answer
    const correctReq = new Request(
      "http://localhost:3000/api/lessons/level-0-lesson-1/answer",
      {
        method: "POST",
        body: JSON.stringify({
          stepId: "step-4",
          selectedOptionId: "opt-2", // "आ" is correct
        }),
      }
    );

    const correctRes = await postAnswer(correctReq, {
      params: Promise.resolve({ id: "level-0-lesson-1" }),
    });
    const correctData = await correctRes.json();

    expect(correctRes.status).toBe(200);
    expect(correctData.correct).toBe(true);
    expect(correctData.explanationEn).toContain("Correct");

    // 2. Incorrect answer
    const wrongReq = new Request(
      "http://localhost:3000/api/lessons/level-0-lesson-1/answer",
      {
        method: "POST",
        body: JSON.stringify({
          stepId: "step-4",
          selectedOptionId: "opt-1", // "अ" is incorrect
        }),
      }
    );

    const wrongRes = await postAnswer(wrongReq, {
      params: Promise.resolve({ id: "level-0-lesson-1" }),
    });
    const wrongData = await wrongRes.json();

    expect(wrongRes.status).toBe(200);
    expect(wrongData.correct).toBe(false);
  });

  it("POST /api/lessons/:id/complete marks lesson complete and returns unlocked skills", async () => {
    const request = new Request(
      "http://localhost:3000/api/lessons/level-0-lesson-1/complete",
      {
        method: "POST",
        body: JSON.stringify({ userId: "test-user-1", score: 3 }),
      }
    );

    const response = await postComplete(request, {
      params: Promise.resolve({ id: "level-0-lesson-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.skillsUnlocked.length).toBeGreaterThan(0);
    expect(data.wordsLearned).toBe(5);
  });
});
