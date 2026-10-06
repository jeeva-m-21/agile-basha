import { describe, it, expect } from "vitest";
import { level1Lesson1, level1Lesson2 } from "@/lib/curriculum/lessonLevel1";
import { curriculumLevels } from "@/lib/curriculum/data";
import { GET as getLesson } from "@/app/api/lessons/[id]/route";

describe("Level 1 Curriculum Content & API", () => {
  it("level1Lesson1 follows 7-step pedagogical structure", () => {
    expect(level1Lesson1.id).toBe("level-1-lesson-1");
    expect(level1Lesson1.steps.length).toBeGreaterThanOrEqual(5);

    const stepTypes = level1Lesson1.steps.map((s) => s.type);
    expect(stepTypes).toContain("see_it");
    expect(stepTypes).toContain("notice_it");
    expect(stepTypes).toContain("rule");
    expect(stepTypes).toContain("exercise");
    expect(stepTypes).toContain("recap");
  });

  it("level1Lesson2 teaches accusative case with exercise types", () => {
    expect(level1Lesson2.id).toBe("level-1-lesson-2");
    expect(level1Lesson2.titleEn).toContain("Accusative");

    const exerciseStep = level1Lesson2.steps.find((s) => s.type === "exercise");
    expect(exerciseStep).toBeDefined();
    expect(exerciseStep?.content.exerciseType).toBe("fill_blank");
  });

  it("curriculumLevels contains Level 1 with Unit 1 and lessons", () => {
    const level1 = curriculumLevels.find((l) => l.id === "level-1");
    expect(level1).toBeDefined();
    expect(level1?.units.length).toBeGreaterThan(0);
    expect(level1?.units[0].lessons.length).toBe(2);
    expect(level1?.units[0].lessons[0].id).toBe("level-1-lesson-1");
    expect(level1?.units[0].lessons[1].id).toBe("level-1-lesson-2");
  });

  it("GET /api/lessons/[id] correctly retrieves level-1 lessons", async () => {
    const req1 = new Request("http://localhost/api/lessons/level-1-lesson-1");
    const res1 = await getLesson(req1, {
      params: Promise.resolve({ id: "level-1-lesson-1" }),
    });
    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1.lesson.id).toBe("level-1-lesson-1");

    const req2 = new Request("http://localhost/api/lessons/level-1-lesson-2");
    const res2 = await getLesson(req2, {
      params: Promise.resolve({ id: "level-1-lesson-2" }),
    });
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.lesson.id).toBe("level-1-lesson-2");
  });
});
