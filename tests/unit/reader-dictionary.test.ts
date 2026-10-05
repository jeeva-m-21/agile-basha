import { describe, it, expect } from "vitest";
import { analyzeSentence } from "@/lib/reader/dictionary";

describe("Reader Dictionary and Sentence Analysis", () => {
  it("analyzes 'रामः वनं गच्छति' into individual word tokens and grammar breakdown", () => {
    const result = analyzeSentence("रामः वनं गच्छति");

    expect(result.detectedScript).toBe("devanagari");
    expect(result.totalWords).toBe(3);
    expect(result.knownWords).toBe(3);
    expect(result.translationEn).toContain("Rāma goes to the forest");

    const [rama, vanam, gacchati] = result.tokens;

    // Word 1: Rāmaḥ
    expect(rama.word).toBe("रामः");
    expect(rama.baseForm).toBe("राम");
    expect(rama.grammarEn).toContain("Nominative");
    expect(rama.ruleEn).toContain("Prathamā");
    expect(rama.ambiguityStatus).toBe("clear");

    // Word 2: Vanaṃ
    expect(vanam.word).toBe("वनं");
    expect(vanam.baseForm).toBe("वन");
    expect(vanam.grammarEn).toContain("Accusative");

    // Word 3: Gacchati
    expect(gacchati.word).toBe("गच्छति");
    expect(gacchati.baseForm).toBe("गम्");
    expect(gacchati.grammarEn).toContain("Present");
  });

  it("normalizes and tokenizes text input in Roman (IAST)", () => {
    const result = analyzeSentence("rāmaḥ vanaṃ gacchati");

    expect(result.detectedScript).toBe("iast");
    expect(result.totalWords).toBe(3);
    expect(result.tokens[0].word).toBe("रामः");
    expect(result.tokens[0].meaningEn).toBeTruthy();
  });

  it("handles unknown or complex words gracefully with 'possible' ambiguity label", () => {
    const result = analyzeSentence("सत्यमेव जयते");

    expect(result.totalWords).toBe(2);
    expect(result.tokens[0].ambiguityStatus).toBe("possible");
    expect(result.tokens[0].grammarEn).toBeTruthy();
  });
});
