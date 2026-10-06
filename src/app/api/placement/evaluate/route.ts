import { NextResponse } from "next/server";
import { evaluatePlacementQuiz } from "@/lib/curriculum/placement";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answers = body?.answers;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid request: 'answers' map is required." },
        { status: 400 }
      );
    }

    const evaluation = evaluatePlacementQuiz(answers);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to evaluate placement quiz", details: error?.message },
      { status: 500 }
    );
  }
}
