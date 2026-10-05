import { NextResponse } from "next/server";
import { memoryDb } from "@/lib/db/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { userId = "guest-user-default", score = 3 } = body;

    const record = {
      userId,
      lessonId: id,
      status: "completed",
      score,
      completedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      lessonId: id,
      skillsUnlocked: ["vowels_hrasva", "vowels_dirgha"],
      wordsLearned: 5,
      record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to complete lesson" },
      { status: 500 }
    );
  }
}
