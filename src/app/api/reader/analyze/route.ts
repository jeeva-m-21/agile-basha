import { NextResponse } from "next/server";
import { analyzeSentence } from "@/lib/reader/dictionary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid Sanskrit sentence or verse" },
        { status: 400 }
      );
    }

    const analysis = analyzeSentence(text);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to analyze Sanskrit text" },
      { status: 500 }
    );
  }
}
