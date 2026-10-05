import { NextResponse } from "next/server";
import { level0Lesson1 } from "@/lib/curriculum/lesson1";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id === "level-0-lesson-1" || id === "latest") {
    return NextResponse.json({ lesson: level0Lesson1 });
  }

  // Return lesson 1 as default for initial curriculum
  return NextResponse.json({ lesson: level0Lesson1 });
}
