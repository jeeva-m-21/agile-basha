import { NextResponse } from "next/server";
import { level0Lesson1 } from "@/lib/curriculum/lesson1";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stepId, selectedOptionId } = body;

    const step = level0Lesson1.steps.find((s) => s.id === stepId);
    if (!step || step.type !== "exercise") {
      return NextResponse.json({ error: "Invalid exercise step" }, { status: 400 });
    }

    const exercise = step.content;
    const isCorrect = exercise.correctOptionId === selectedOptionId;

    return NextResponse.json({
      correct: isCorrect,
      correctOptionId: exercise.correctOptionId,
      explanationEn: exercise.explanationEn,
      explanationTa: exercise.explanationTa,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to validate answer" },
      { status: 500 }
    );
  }
}
