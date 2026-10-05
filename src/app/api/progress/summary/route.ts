import { NextResponse } from "next/server";
import { computeProgressSummary } from "@/lib/progress/skills";

export async function GET() {
  try {
    const summary = computeProgressSummary();

    return NextResponse.json({
      success: true,
      ...summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load progress summary" },
      { status: 500 }
    );
  }
}
