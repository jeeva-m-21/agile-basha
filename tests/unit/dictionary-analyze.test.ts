import { describe, it, expect } from "vitest";
import { analyzeWordForm } from "@/lib/dictionary/analyzer";
import { GET as analyzeGET } from "@/app/api/dictionary/analyze/route";
import { GET as grammarGET } from "@/app/api/dictionary/grammar/route";

describe("Word Form Analysis & Grammar API (SPEC §11.1 & §11.2)", () => {
  it("analyzes verbal form 'gacchati' as present tense 3rd person singular of root gam", () => {
    const analysis = analyzeWordForm("gacchati");
    expect(analysis).not.toBeNull();
    expect(analysis?.baseLemma).toBe("गम्");
    expect(analysis?.partOfSpeech).toBe("verb");
    expect(analysis?.grammarEn).toMatch(/present active.*3rd person singular/i);
    expect(analysis?.grammarTa).toMatch(/நிகழ்காலம்.*படர்க்கை ஒருமை/i);
    expect(analysis?.ruleSlug).toBe("lat-lakara");
    expect(analysis?.relatedLessonId).toBe("lesson-1");
  });

  it("analyzes instrumental nominal form 'रामेण' as masculine singular instrumental", () => {
    const analysis = analyzeWordForm("रामेण");
    expect(analysis).not.toBeNull();
    expect(analysis?.baseLemma).toBe("राम");
    expect(analysis?.grammarEn).toMatch(/instrumental/i);
    expect(analysis?.grammarTa).toMatch(/மூன்றாம் வேற்றுமை/i);
    expect(analysis?.ruleSlug).toBe("tritiya-vibhakti");
  });

  it("analyzes accusative form 'वनम्' (destination/object)", () => {
    const analysis = analyzeWordForm("वनम्");
    expect(analysis).not.toBeNull();
    expect(analysis?.baseLemma).toBe("वन");
    expect(analysis?.grammarEn).toMatch(/accusative/i);
    expect(analysis?.ruleSlug).toBe("dvitiya-vibhakti");
  });

  it("analyzes nominative form 'शिवः' with link to prathama-vibhakti rule", () => {
    const analysis = analyzeWordForm("शिवः");
    expect(analysis).not.toBeNull();
    expect(analysis?.baseLemma).toBe("शिव");
    expect(analysis?.grammarEn).toMatch(/nominative/i);
    expect(analysis?.ruleSlug).toBe("prathama-vibhakti");
  });

  it("GET /api/dictionary/analyze returns form analysis JSON", async () => {
    const req = new Request("http://localhost:3000/api/dictionary/analyze?word=गच्छति");
    const res = await analyzeGET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.analysis).toBeDefined();
    expect(data.analysis.baseLemma).toBe("गम्");
  });

  it("GET /api/dictionary/grammar returns all grammar rules or specific rule by slug", async () => {
    // 1. All rules
    const reqAll = new Request("http://localhost:3000/api/dictionary/grammar");
    const resAll = await grammarGET(reqAll);
    const dataAll = await resAll.json();
    expect(resAll.status).toBe(200);
    expect(dataAll.rules.length).toBeGreaterThanOrEqual(6);

    // 2. Specific rule by slug
    const reqRule = new Request("http://localhost:3000/api/dictionary/grammar?slug=tritiya-vibhakti");
    const resRule = await grammarGET(reqRule);
    const dataRule = await resRule.json();
    expect(resRule.status).toBe(200);
    expect(dataRule.rule).toBeDefined();
    expect(dataRule.rule.slug).toBe("tritiya-vibhakti");
    expect(dataRule.rule.sutra).toContain("कर्तृकरणयोस्तृतीया");
  });
});
