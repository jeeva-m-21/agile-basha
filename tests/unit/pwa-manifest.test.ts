import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("PWA Manifest & App Icon", () => {
  const rootDir = process.cwd();
  const manifestPath = path.join(rootDir, "public", "manifest.json");
  const iconPath = path.join(rootDir, "public", "icon.svg");

  it("has a valid public/manifest.json file", () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const raw = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(raw);

    expect(manifest.name).toContain("Bhāṣā");
    expect(manifest.short_name).toBe("Bhāṣā");
    expect(manifest.start_url).toBe("/home");
    expect(manifest.display).toBe("standalone");
    expect(manifest.background_color).toBe("#FDFBF7");
    expect(manifest.theme_color).toBe("#7C2D12");
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
    expect(manifest.icons[0].src).toBe("/icon.svg");
  });

  it("has a valid public/icon.svg file with Bhāṣā motif", () => {
    expect(fs.existsSync(iconPath)).toBe(true);
    const content = fs.readFileSync(iconPath, "utf-8");
    expect(content).toContain("<svg");
    expect(content).toContain("#7C2D12"); // Terracotta background
    expect(content).toContain("</svg>");
  });

  it("has sw.js with precache and offline fallbacks", () => {
    const swPath = path.join(rootDir, "public", "sw.js");
    expect(fs.existsSync(swPath)).toBe(true);
    const content = fs.readFileSync(swPath, "utf-8");
    expect(content).toContain("basha-cache");
    expect(content).toContain("install");
    expect(content).toContain("fetch");
    expect(content).toContain("/api/lessons/");
  });
});
