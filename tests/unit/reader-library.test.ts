import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/reader/library/route";

describe("Reader Library API (GET /api/reader/library)", () => {
  it("returns all curated classical texts by default", async () => {
    const req = new Request("http://localhost:3000/api/reader/library");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.texts).toBeDefined();
    expect(data.texts.length).toBeGreaterThanOrEqual(6);
    expect(data.category).toBe("all");
  });

  it("filters texts by category (e.g. gita)", async () => {
    const req = new Request("http://localhost:3000/api/reader/library?category=gita");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.texts.length).toBeGreaterThanOrEqual(2);
    expect(data.texts.every((t: any) => t.category === "gita")).toBe(true);
  });

  it("retrieves a single text by id", async () => {
    const req = new Request("http://localhost:3000/api/reader/library?id=gita-1-1");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.text).toBeDefined();
    expect(data.text.id).toBe("gita-1-1");
    expect(data.text.sanskrit).toContain("धर्मक्षेत्रे");
  });

  it("returns 404 for non-existent text id", async () => {
    const req = new Request("http://localhost:3000/api/reader/library?id=non-existent");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });
});
