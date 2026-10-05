import { NextResponse } from "next/server";
import { curriculumLevels } from "@/lib/curriculum/data";
import { memoryDb } from "@/lib/db/client";
import { getStartOfWeek } from "@/lib/progress/streak";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "guest-user-default";

  const preferences = memoryDb.getPreferences(userId) || {
    learnIn: "en",
    script: "devanagari",
    dailyGoalMin: 10,
    level: "beginner",
  };

  // Determine next lesson based on learner's level
  const level0 = curriculumLevels[0];
  const firstUnit = level0.units[0];
  const firstLesson = firstUnit.lessons[0];

  const nextLesson = {
    id: firstLesson.id,
    levelTitle: preferences.learnIn === "ta" ? level0.titleTa : level0.titleEn,
    title: preferences.learnIn === "ta" ? firstLesson.titleTa : firstLesson.titleEn,
    goal: preferences.learnIn === "ta" ? firstLesson.goalTa : firstLesson.goalEn,
    estMinutes: preferences.dailyGoalMin || 10,
    unitTitle: preferences.learnIn === "ta" ? firstUnit.titleTa : firstUnit.titleEn,
  };

  // Today's reading verse
  const reading = {
    id: "subhashita-1",
    title: "Subhāṣita",
    sanskrit: "विद्या ददाति विनयं विनयाद्याति पात्रताम् ।",
    tamilScript: "வித்³யா த³தா³தி விநயம் விநயாத்³யாதி பாத்ரதாம் ।",
    transliteration: "vidyā dadāti vinayaṃ vinayādyāti pātratām |",
    translationEn: "Knowledge gives humility; from humility comes worthiness.",
    translationTa: "கல்வி பணிவைத் தருகிறது; பணிவு தகுதியைத் தருகிறது.",
  };

  // Streak state
  const todayStr = new Date().toISOString().split("T")[0];
  const currentWeekStart = getStartOfWeek(new Date());

  const streak = {
    current: 1,
    longest: 4,
    restDayAvailable: true,
    restDayUsed: false,
    lastActiveDate: todayStr,
    restDayWeekStart: currentWeekStart,
  };

  const weekProgress = {
    daysActive: 3,
    weeklyGoalDays: 5,
  };

  const review = {
    dueCount: 0,
    estMinutes: 0,
    messageEn: "Your first reviews appear tomorrow.",
    messageTa: "உங்கள் முதல் மீள்பார்வை நாளை தோன்றும்.",
  };

  return NextResponse.json({
    nextLesson,
    review,
    reading,
    streak,
    weekProgress,
    preferences,
  });
}
