import { NextResponse } from "next/server";
import { translateSanskrit } from "@/lib/ai/translation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, targetLang = "en" } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid Sanskrit text" },
        { status: 400 }
      );
    }

    const result = await translateSanskrit({
      text,
      targetLang: targetLang === "ta" ? "ta" : "en",
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate translation" },
      { status: 500 }
    );
  }
}
