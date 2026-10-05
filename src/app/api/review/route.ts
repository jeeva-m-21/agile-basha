import { NextResponse } from "next/server";
import { reviewStore } from "@/lib/srs/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "guest-user-default";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const items = reviewStore.getDueItems(userId, limit);
    const dueCount = reviewStore.getDueCount(userId);
    const estMinutes = Math.max(1, Math.ceil(dueCount * 0.75));

    return NextResponse.json({
      items,
      dueCount,
      estMinutes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch review items" },
      { status: 500 }
    );
  }
}
