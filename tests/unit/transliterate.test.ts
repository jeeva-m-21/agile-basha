import { describe, it, expect } from "vitest";
import {
  detectScript,
  transliterate,
  iastToDevanagari,
  devanagariToIast,
  devanagariToTamil,
} from "@/lib/reader/transliterate";

describe("Transliteration Engine", () => {
  describe("detectScript", () => {
    it("detects Devanāgarī script", () => {
      expect(detectScript("रामः")).toBe("devanagari");
      expect(detectScript("धर्मक्षेत्रे कुरुक्षेत्रे")).toBe("devanagari");
    });

    it("detects Tamil script", () => {
      expect(detectScript("ராம:")).toBe("tamil");
      expect(detectScript("க³ச்ச²தி")).toBe("tamil");
    });

    it("detects IAST / Roman script", () => {
      expect(detectScript("rāmaḥ")).toBe("iast");
      expect(detectScript("dharmakṣetre")).toBe("iast");
    });
  });

  describe("Devanāgarī to IAST", () => {
    it("converts vowels and consonants to IAST transliteration", () => {
      expect(transliterate("रामः", "iast")).toBe("rāmaḥ");
      expect(transliterate("गच्छति", "iast")).toBe("gacchati");
      expect(transliterate("विद्या", "iast")).toBe("vidyā");
    });
  });

  describe("Devanāgarī to Tamil", () => {
    it("converts Devanāgarī words to Tamil script representation", () => {
      expect(transliterate("रामः", "tamil")).toBe("ராம:");
      expect(transliterate("गच्छति", "tamil")).toBe("க³ச்ச²தி");
      expect(transliterate("विद्या", "tamil")).toBe("வித்³யா");
    });
  });

  describe("IAST to Devanāgarī", () => {
    it("converts IAST Roman inputs to Devanāgarī", () => {
      expect(iastToDevanagari("rāmaḥ")).toBe("रामः");
      expect(iastToDevanagari("vanam")).toBe("वनम्");
    });

    it("handles common phonetic keyboard shortcuts (aa -> ā)", () => {
      expect(iastToDevanagari("raama")).toBe("राम");
    });
  });
});
