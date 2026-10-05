import { NextResponse } from "next/server";
import { computeProgressSummary } from "@/lib/progress/skills";
import { reviewStore } from "@/lib/srs/storage";

export async function GET() {
  try {
    const summary = computeProgressSummary();
    const reviewItems = reviewStore.getAllItems();

    const exportData = {
      product: "Bhāṣā (भाषा · பாஷா)",
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      privacyNotice:
        "All data belongs strictly to the learner. Bhāṣā never sells learner data.",
      progress: {
        currentLevel: summary.currentLevel,
        levelNameEn: summary.levelNameEn,
        levelNameTa: summary.levelNameTa,
        levelProgressPercent: summary.levelProgressPercent,
        youCanNowEn: summary.youCanNowEn,
        youCanNowTa: summary.youCanNowTa,
        skills: summary.skills,
        stats: summary.stats,
      },
      srsReviewQueue: {
        totalCards: reviewItems.length,
        items: reviewItems,
      },
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="basha-data-export.json"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export data", details: String(error) },
      { status: 500 }
    );
  }
}
