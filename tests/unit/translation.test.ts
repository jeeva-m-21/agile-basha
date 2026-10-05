import { describe, it, expect, beforeEach } from "vitest";
import { translateSanskrit, clearTranslationCache } from "@/lib/ai/translation";
import { POST } from "@/app/api/reader/translate/route";

describe("Translation Service & Caching (SPEC §10.1)", () => {
  beforeEach(() => {
    clearTranslationCache();
  });

  it("returns curated human translation with curated label for known verses", async () => {
    const result = await translateSanskrit({
      text: "कर्मण्येवाधिकारस्ते",
      targetLang: "en",
    });

    expect(result.translation).toContain("duty");
    expect(result.provider).toBe("curated");
    expect(result.isAiTranslated).toBe(false);
    expect(result.label).toBe("Curated translation");
  });

  it("caches translations in memory and returns isCached: true on subsequent requests", async () => {
    const first = await translateSanskrit({
      text: "ॐ असतो मा सद्गमय",
      targetLang: "en",
    });
    expect(first.isCached).toBe(false);

    const second = await translateSanskrit({
      text: "ॐ असतो मा सद्गमय",
      targetLang: "en",
    });
    expect(second.isCached).toBe(true);
    expect(second.translation).toBe(first.translation);
  });

  it("generates contextual translation with 'AI-assisted translation' label for arbitrary Sanskrit input", async () => {
    const result = await translateSanskrit({
      text: "वृक्षात् पर्णं पतति",
      targetLang: "en",
    });

    expect(result.isAiTranslated).toBe(true);
    expect(result.label).toContain("AI-assisted translation");
    expect(result.translation).toBeDefined();
  });

  it("translates into Tamil when requested", async () => {
    const result = await translateSanskrit({
      text: "विद्या ददाति विनयम्",
      targetLang: "ta",
    });

    expect(result.targetLang).toBe("ta");
    expect(result.translation).toContain("பணிவு");
  });

  it("POST /api/reader/translate responds with translation result", async () => {
    const req = new Request("http://localhost:3000/api/reader/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "रामः वनं गच्छति",
        targetLang: "en",
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result.translation).toContain("forest");
  });

  it("POST /api/reader/translate rejects empty body", async () => {
    const req = new Request("http://localhost:3000/api/reader/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
