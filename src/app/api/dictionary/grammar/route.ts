import { NextResponse } from "next/server";
import { getGrammarRules, getGrammarRuleBySlug } from "@/lib/dictionary/grammar-rules";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    if (slug) {
      const rule = getGrammarRuleBySlug(slug);
      if (!rule) {
        return NextResponse.json({ error: "Grammar rule not found" }, { status: 404 });
      }
      return NextResponse.json({ rule });
    }

    const rules = getGrammarRules(category || undefined);
    return NextResponse.json({
      rules,
      total: rules.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load grammar rules" },
      { status: 500 }
    );
  }
}
