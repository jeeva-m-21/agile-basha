import { describe, it, expect, beforeEach } from "vitest";
import { POST as chatPOST } from "@/app/api/tutor/chat/route";
import { POST as reportPOST } from "@/app/api/tutor/report/route";
import { resetQuotaForTesting } from "@/lib/ai/tutor";

describe("AI Tutor API (SPEC §12)", () => {
  beforeEach(() => {
    resetQuotaForTesting();
  });

  it("answers 'Why is it रामेण here?' with grounded instrumental case explanation and references", async () => {
    const req = new Request("http://localhost:3000/api/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Why is it रामेण here?",
        context: {
          type: "lesson",
          lessonId: "lesson-2",
          sentence: "रामेण सह गच्छति",
          word: "रामेण",
        },
        language: "en",
        userId: "test-user-1",
      }),
    });

    const res = await chatPOST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.label).toBe("AI tutor");
    expect(data.answer).toMatch(/instrumental/i);
    expect(data.answer).toMatch(/tṛtīyā/i);
    expect(data.references).toBeDefined();
    expect(data.references.some((r: any) => r.id === "tritiya-vibhakti")).toBe(true);
    expect(data.quotaRemaining).toBe(19);
  });

  it("answers 'What is the root of gacchati?' with dhātu gam", async () => {
    const req = new Request("http://localhost:3000/api/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What is the root of gacchati?",
        context: { type: "lesson", word: "गच्छति" },
        language: "en",
        userId: "test-user-2",
      }),
    });

    const res = await chatPOST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.answer).toMatch(/gam/i);
    expect(data.answer).toMatch(/गम्/i);
  });

  it("answers in Tamil when language is 'ta'", async () => {
    const req = new Request("http://localhost:3000/api/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "ராமேண ஏன் வருகிறது?",
        language: "ta",
        userId: "test-user-3",
      }),
    });

    const res = await chatPOST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.answer).toMatch(/மூன்றாம் வேற்றுமை/i);
  });

  it("enforces daily fair-use quota of 20 questions (SPEC §12.3)", async () => {
    const testUserId = "quota-test-user";

    // Exhaust 20 questions
    for (let i = 0; i < 20; i++) {
      const req = new Request("http://localhost:3000/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "What is Rama?",
          userId: testUserId,
        }),
      });
      const res = await chatPOST(req);
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.quotaRemaining).toBe(19 - i);
    }

    // 21st question should receive quota limit notice
    const overReq = new Request("http://localhost:3000/api/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "One more question please",
        userId: testUserId,
      }),
    });
    const overRes = await chatPOST(overReq);
    const overData = await overRes.json();

    expect(overData.quotaRemaining).toBe(0);
    expect(overData.answer).toMatch(/limit of 20 questions/i);
  });

  it("rejects empty message with 400 status", async () => {
    const req = new Request("http://localhost:3000/api/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "" }),
    });

    const res = await chatPOST(req);
    expect(res.status).toBe(400);
  });

  it("accepts 'Report a problem' submission via POST /api/tutor/report", async () => {
    const req = new Request("http://localhost:3000/api/tutor/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: "msg-123",
        userQuestion: "Why is it रामेण here?",
        assistantAnswer: "Sample answer",
        reason: "Inaccurate grammar explanation",
      }),
    });

    const res = await reportPOST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.reportId).toBeDefined();
  });
});
