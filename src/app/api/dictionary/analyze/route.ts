import { NextResponse } from "next/server";
import { analyzeWordForm } from "@/lib/dictionary/analyzer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get("word") || searchParams.get("q") || "";

    if (!word.trim()) {
      return NextResponse.json(
        { error: "Missing word parameter" },
        { status: 400 }
      );
    }

    const analysis = analyzeWordForm(word);

    if (!analysis) {
      return NextResponse.json(
        { error: "Could not analyze the given word form" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      word,
      analysis,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to analyze word form" },
      { status: 500 }
    );
  }
}
