import { NextResponse } from "next/server";
import { answerTutorQuestion } from "@/lib/ai/tutor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context, language = "en", userId = "guest" } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid question for the AI Tutor" },
        { status: 400 }
      );
    }

    const response = await answerTutorQuestion({
      question: message,
      context,
      language: language === "ta" ? "ta" : "en",
      userId,
    });

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process question with AI Tutor" },
      { status: 500 }
    );
  }
}
