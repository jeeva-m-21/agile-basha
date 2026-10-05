import { describe, it, expect } from "vitest";
import { searchDictionary } from "@/lib/dictionary/analyzer";
import { GET } from "@/app/api/dictionary/search/route";

describe("Dictionary Search (SPEC §11.1)", () => {
  it("finds शिव when searching in Devanāgarī", () => {
    const results = searchDictionary("शिव");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].headword).toBe("शिव");
    expect(results[0].iast).toBe("śiva");
  });

  it("finds शिव when searching in Roman / IAST 'shiva' or 'siva' (SPEC §11.1 requirement)", () => {
    const results = searchDictionary("shiva");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.headword === "शिव")).toBe(true);
  });

  it("finds शिव when searching in Tamil script 'சிவ' (SPEC §11.1 requirement)", () => {
    const results = searchDictionary("சிவ");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.headword === "शिव")).toBe(true);
  });

  it("finds words by English meaning (e.g. 'forest' finds वन)", () => {
    const results = searchDictionary("forest");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.headword === "वन")).toBe(true);
  });

  it("finds words by Tamil meaning (e.g. 'கல்வி' finds विद्या)", () => {
    const results = searchDictionary("கல்வி");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.headword === "विद्या")).toBe(true);
  });

  it("returns empty array for empty or whitespace query", () => {
    expect(searchDictionary("")).toEqual([]);
    expect(searchDictionary("   ")).toEqual([]);
  });

  it("GET /api/dictionary/search returns search results via API", async () => {
    const req = new Request("http://localhost:3000/api/dictionary/search?q=rama");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.results).toBeDefined();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results[0].headword).toBe("राम");
  });
});
