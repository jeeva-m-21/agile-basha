import { describe, it, expect } from "vitest";
import { GET as getQuiz } from "@/app/api/placement/quiz/route";
import { POST as evaluateQuiz } from "@/app/api/placement/evaluate/route";

describe("Placement API Routes", () => {
  it("GET /api/placement/quiz returns all questions", async () => {
    const req = new Request("http://localhost/api/placement/quiz");
    const res = await getQuiz(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.total).toBe(data.questions.length);
    expect(data.total).toBeGreaterThanOrEqual(5);
  });

  it("GET /api/placement/quiz?band=0 filters questions by band", async () => {
    const req = new Request("http://localhost/api/placement/quiz?band=0");
    const res = await getQuiz(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.questions.every((q: any) => q.band === 0)).toBe(true);
  });

  it("POST /api/placement/evaluate returns 400 for invalid body", async () => {
    const req = new Request("http://localhost/api/placement/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await evaluateQuiz(req);
    expect(res.status).toBe(400);
  });

  it("POST /api/placement/evaluate evaluates quiz answers accurately", async () => {
    const req = new Request("http://localhost/api/placement/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: {
          "pq-0-1": "opt-2",
          "pq-1-1": "opt-2",
        },
      }),
    });
    const res = await evaluateQuiz(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.evaluation.score).toBe(2);
    expect(data.evaluation.recommendedLevel).toBe("level-0");
  });
});
