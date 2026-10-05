import { describe, it, expect, beforeEach } from "vitest";
import { GET as handleExport } from "@/app/api/account/export/route";
import { POST as handleReset } from "@/app/api/account/reset/route";
import { reviewStore } from "@/lib/srs/storage";

describe("Account Management APIs", () => {
  beforeEach(() => {
    reviewStore.reset();
  });

  describe("GET /api/account/export", () => {
    it("returns learner export JSON with privacy notice and SRS data", async () => {
      // Seed an item in review store
      reviewStore.upsertItem({
        id: "rev-export-test",
        sanskrit: "रामः",
        iast: "rāmaḥ",
        tamilScript: "ராமஃ",
        meaningEn: "Rama (nominative)",
        meaningTa: "ராமன்",
        type: "word",
      });

      const response = await handleExport();
      expect(response.status).toBe(200);

      const disposition = response.headers.get("Content-Disposition");
      expect(disposition).toContain("basha-data-export.json");

      const body = await response.json();
      expect(body.product).toContain("Bhāṣā");
      expect(body.privacyNotice).toBeDefined();
      expect(body.progress).toBeDefined();
      expect(body.srsReviewQueue.totalCards).toBeGreaterThanOrEqual(1);
    });
  });

  describe("POST /api/account/reset", () => {
    it("resets learning data and returns success", async () => {
      // Seed an item
      reviewStore.upsertItem({
        id: "rev-to-delete",
        sanskrit: "वनम्",
        iast: "vanam",
        tamilScript: "வனம்",
        meaningEn: "forest",
        meaningTa: "காடு",
        type: "word",
      });
      expect(reviewStore.getAllItems().length).toBeGreaterThan(0);

      const response = await handleReset();
      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);

      // Verify review items were wiped
      expect(reviewStore.getAllItems().length).toBe(0);
    });
  });
});
