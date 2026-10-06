import { NextResponse } from "next/server";
import { placementQuestions } from "@/lib/curriculum/placement";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const band = searchParams.get("band");

  if (band !== null) {
    const bandNum = parseInt(band, 10);
    const filtered = placementQuestions.filter((q) => q.band === bandNum);
    return NextResponse.json({ questions: filtered, total: filtered.length });
  }

  return NextResponse.json({
    questions: placementQuestions,
    total: placementQuestions.length,
  });
}
