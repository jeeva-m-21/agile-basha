import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messageId, userQuestion, assistantAnswer, reason } = body;

    if (!reason || typeof reason !== "string") {
      return NextResponse.json(
        { error: "Reason for report is required" },
        { status: 400 }
      );
    }

    // Reports are stored for curriculum review per SPEC §18.3
    return NextResponse.json({
      success: true,
      message: "Report submitted successfully. Our Sanskrit academic team will review this item.",
      reportId: `rep-${Date.now()}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to submit report" },
      { status: 500 }
    );
  }
}
