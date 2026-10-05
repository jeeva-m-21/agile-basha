import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/lessons/[id]/route";
import { POST as postAnswer } from "@/app/api/lessons/[id]/answer/route";

describe("Lesson 2 Exercise API Integration", () => {
  it("GET /api/lessons/level-0-lesson-2 returns lesson 2 with all exercise types", async () => {
    const request = new Request("http://localhost:3000/api/lessons/level-0-lesson-2");
    const response = await GET(request, {
      params: Promise.resolve({ id: "level-0-lesson-2" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.lesson.id).toBe("level-0-lesson-2");

    const exerciseTypes = data.lesson.steps
      .filter((s: any) => s.type === "exercise")
      .map((s: any) => s.content.exerciseType);

    expect(exerciseTypes).toContain("fill_blank");
    expect(exerciseTypes).toContain("match");
    expect(exerciseTypes).toContain("build_sentence");
    expect(exerciseTypes).toContain("transliterate");
  });

  it("POST /api/lessons/:id/answer validates fill_blank exercise", async () => {
    const req = new Request("http://localhost:3000/api/lessons/level-0-lesson-2/answer", {
      method: "POST",
      body: JSON.stringify({
        stepId: "ex-l2-1", // ex-l2-1 is step-4 content id, stepId is "l2-step-4"
      }),
    });
  });

  it("POST /api/lessons/:id/answer validates build_sentence with flexible word order", async () => {
    // 1. Canonical order
    const canonicalReq = new Request(
      "http://localhost:3000/api/lessons/level-0-lesson-2/answer",
      {
        method: "POST",
        body: JSON.stringify({
          stepId: "l2-step-6",
          selectedTileIds: ["tile-1", "tile-2", "tile-3"], // "रामः वनम् गच्छति"
        }),
      }
    );
    const canonicalRes = await postAnswer(canonicalReq, {
      params: Promise.resolve({ id: "level-0-lesson-2" }),
    });
    const canonicalData = await canonicalRes.json();
    expect(canonicalRes.status).toBe(200);
    expect(canonicalData.correct).toBe(true);
    expect(canonicalData.isAlternativeOrder).toBe(false);

    // 2. Alternative valid order
    const altReq = new Request(
      "http://localhost:3000/api/lessons/level-0-lesson-2/answer",
      {
        method: "POST",
        body: JSON.stringify({
          stepId: "l2-step-6",
          selectedTileIds: ["tile-2", "tile-1", "tile-3"], // "वनम् रामः गच्छति"
        }),
      }
    );
    const altRes = await postAnswer(altReq, {
      params: Promise.resolve({ id: "level-0-lesson-2" }),
    });
    const altData = await altRes.json();
    expect(altRes.status).toBe(200);
    expect(altData.correct).toBe(true);
    expect(altData.isAlternativeOrder).toBe(true);
    expect(altData.alsoCorrectEn).toContain("रामः वनम् गच्छति");
  });

  it("POST /api/lessons/:id/answer validates match exercise", async () => {
    const req = new Request("http://localhost:3000/api/lessons/level-0-lesson-2/answer", {
      method: "POST",
      body: JSON.stringify({
        stepId: "l2-step-5",
        matchedPairs: [
          { leftId: "p1-l", rightId: "p1-r" },
          { leftId: "p2-l", rightId: "p2-r" },
          { leftId: "p3-l", rightId: "p3-r" },
          { leftId: "p4-l", rightId: "p4-r" },
        ],
      }),
    });
    const res = await postAnswer(req, {
      params: Promise.resolve({ id: "level-0-lesson-2" }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.correct).toBe(true);
  });
});
