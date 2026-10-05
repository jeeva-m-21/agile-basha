import { NextResponse } from "next/server";
import { memoryDb } from "@/lib/db/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      learnIn = "en",
      script = "devanagari",
      helperLine = "roman",
      goals = ["gita"],
      level = "beginner",
      dailyGoalMin = 10,
      theme = "system",
      userId = "guest-user-default",
    } = body;

    // Validate inputs
    if (!["en", "ta"].includes(learnIn)) {
      return NextResponse.json({ error: "Invalid learnIn language" }, { status: 400 });
    }

    if (!["devanagari", "tamil", "iast"].includes(script)) {
      return NextResponse.json({ error: "Invalid Sanskrit script" }, { status: 400 });
    }

    const preferences = {
      userId,
      learnIn,
      script,
      helperLine,
      goals,
      level,
      dailyGoalMin: Number(dailyGoalMin),
      theme,
      updatedAt: new Date().toISOString(),
    };

    memoryDb.setPreferences(userId, preferences);

    return NextResponse.json({ success: true, preferences });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to save preferences" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "guest-user-default";
  const preferences = memoryDb.getPreferences(userId) || {
    userId,
    learnIn: "en",
    script: "devanagari",
    helperLine: "roman",
    goals: ["gita", "mantras"],
    level: "beginner",
    dailyGoalMin: 10,
    theme: "system",
  };

  return NextResponse.json({ preferences });
}
