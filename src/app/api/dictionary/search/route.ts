import { NextResponse } from "next/server";
import { searchDictionary } from "@/lib/dictionary/analyzer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json({
        query: "",
        results: [],
        total: 0,
      });
    }

    const results = searchDictionary(q);

    return NextResponse.json({
      query: q,
      results,
      total: results.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to search dictionary" },
      { status: 500 }
    );
  }
}
