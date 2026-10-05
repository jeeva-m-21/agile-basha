import { NextResponse } from "next/server";
import { getCuratedTexts, getTextById } from "@/lib/reader/texts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const textId = searchParams.get("id");

    if (textId) {
      const item = getTextById(textId);
      if (!item) {
        return NextResponse.json({ error: "Text not found" }, { status: 404 });
      }
      return NextResponse.json({ text: item });
    }

    const items = getCuratedTexts(category);

    return NextResponse.json({
      texts: items,
      total: items.length,
      category,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load library texts" },
      { status: 500 }
    );
  }
}
