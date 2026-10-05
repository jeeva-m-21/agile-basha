import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/reader/analyze/route";

describe("Reader API Route (POST /api/reader/analyze)", () => {
  it("analyzes valid Sanskrit input and returns tokens, translations, and word count", async () => {
    const request = new Request("http://localhost:3000/api/reader/analyze", {
      method: "POST",
      body: JSON.stringify({
        text: "विद्या ददाति विनयम्",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analysis.totalWords).toBe(3);
    expect(data.analysis.translationEn).toContain("Knowledge gives humility");

    const tokens = data.analysis.tokens;
    expect(tokens[0].word).toBe("विद्या");
    expect(tokens[1].word).toBe("ददाति");
    expect(tokens[2].word).toBe("विनयम्");
  });

  it("returns 400 when text input is empty", async () => {
    const request = new Request("http://localhost:3000/api/reader/analyze", {
      method: "POST",
      body: JSON.stringify({
        text: "   ",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
