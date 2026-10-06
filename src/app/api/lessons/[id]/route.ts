import { NextResponse } from "next/server";
import { level0Lesson1 } from "@/lib/curriculum/lesson1";
import { level0Lesson2 } from "@/lib/curriculum/lesson2";
import { level1Lesson1, level1Lesson2 } from "@/lib/curriculum/lessonLevel1";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id === "level-0-lesson-2") {
    return NextResponse.json({ lesson: level0Lesson2 });
  }

  if (id === "level-1-lesson-1") {
    return NextResponse.json({ lesson: level1Lesson1 });
  }

  if (id === "level-1-lesson-2") {
    return NextResponse.json({ lesson: level1Lesson2 });
  }

  // Return lesson 1 for level-0-lesson-1, latest, or default
  return NextResponse.json({ lesson: level0Lesson1 });
}

