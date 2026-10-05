import { NextResponse } from "next/server";
import { level0Lesson1 } from "@/lib/curriculum/lesson1";
import { level0Lesson2 } from "@/lib/curriculum/lesson2";
import { validateAnswer } from "@/lib/exercises/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stepId } = body;

    const allSteps = [...level0Lesson1.steps, ...level0Lesson2.steps];
    const step = allSteps.find((s) => s.id === stepId);
    if (!step || step.type !== "exercise") {
      return NextResponse.json({ error: "Invalid exercise step" }, { status: 400 });
    }

    const result = validateAnswer(step.content, body);

    return NextResponse.json({
      correct: result.correct,
      correctOptionId: result.correctOptionId,
      isAlternativeOrder: result.isAlternativeOrder,
      alsoCorrectEn: result.alsoCorrectEn,
      alsoCorrectTa: result.alsoCorrectTa,
      explanationEn: result.explanationEn,
      explanationTa: result.explanationTa,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to validate answer" },
      { status: 500 }
    );
  }
}
