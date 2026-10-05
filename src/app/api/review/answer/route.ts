import { NextResponse } from "next/server";
import { reviewStore } from "@/lib/srs/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, quality = 4, action = "rate" } = body;

    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    const result = reviewStore.answerItem(itemId, quality, action);

    return NextResponse.json({
      success: true,
      updatedItem: result.updatedItem,
      attempt: result.attempt,
      remainingDueCount: result.remainingDueCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process review answer" },
      { status: 500 }
    );
  }
}
