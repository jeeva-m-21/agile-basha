"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SanskritText } from "@/components/sanskrit/SanskritText";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { ArrowRight, Sparkles, BookOpen, ChevronRight, ShieldCheck } from "lucide-react";

interface TodayData {
  nextLesson: {
    id: string;
    levelTitle: string;
    title: string;
    goal: string;
    estMinutes: number;
    unitTitle: string;
  };
  review: {
    dueCount: number;
    estMinutes: number;
    messageEn: string;
    messageTa: string;
  };
  reading: {
    id: string;
    title: string;
    sanskrit: string;
    tamilScript: string;
    transliteration: string;
    translationEn: string;
    translationTa: string;
  };
  streak: {
    current: number;
    longest: number;
    restDayAvailable: boolean;
    restDayUsed: boolean;
  };
  weekProgress: {
    daysActive: number;
    weeklyGoalDays: number;
  };
}

export default function HomePage() {
  const preferences = usePreferencesStore();
  const { language } = useTranslation();
  const [data, setData] = useState<TodayData | null>(null);

  useEffect(() => {
    preferences.loadPreferences();

    fetch("/api/today")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {
        // Fallback static data
        setData({
          nextLesson: {
            id: "level-0-lesson-1",
            levelTitle: language === "ta" ? "நிலை 0 — ஒலிகளும் எழுத்துக்களும்" : "Level 0 — Sounds and Script",
            title: language === "ta" ? "முதல் ஐந்து ஒலிகள் (அ, ஆ, இ, ஈ, உ)" : "First Five Sounds (a, ā, i, ī, u)",
            goal: language === "ta" ? "குறில், நெடில் உயிர் ஒலிகளை அறிவோம்" : "Recognize and pronounce short/long vowel pairs",
            estMinutes: preferences.dailyGoalMin || 10,
            unitTitle: language === "ta" ? "உயிர் எழுத்துக்கள்" : "The Vowels",
          },
          review: {
            dueCount: 0,
            estMinutes: 0,
            messageEn: "Your first reviews appear tomorrow.",
            messageTa: "உங்கள் முதல் மீள்பார்வை நாளை தோன்றும்.",
          },
          reading: {
            id: "subhashita-1",
            title: "Subhāṣita",
            sanskrit: "विद्या ददाति विनयं विनयाद्याति पात्रताम् ।",
            tamilScript: "வித்³யா த³தா³தி விநயம் விநயாத்³யாதி பாத்ரதாம் ।",
            transliteration: "vidyā dadāti vinayaṃ vinayādyāti pātratām |",
            translationEn: "Knowledge gives humility; from humility comes worthiness.",
            translationTa: "கல்வி பணிவைத் தருகிறது; பணிவு தகுதியைத் தருகிறது.",
          },
          streak: {
            current: 1,
            longest: 1,
            restDayAvailable: true,
            restDayUsed: false,
          },
          weekProgress: {
            daysActive: 1,
            weeklyGoalDays: 5,
          },
        });
      });
  }, [language, preferences.dailyGoalMin]);

  const isTamil = language === "ta";

  return (
    <main className="max-w-md w-full mx-auto px-4 py-5 space-y-4">
      {/* Welcome & Today Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--ink)]">
            {isTamil ? "இன்றைய பயிற்சி" : "Today"}
          </h1>
          <p className="text-xs text-[var(--ink-2)]">
            {isTamil ? "உங்கள் தினசரி இலக்கு: " : "Daily commitment: "}
            <span className="font-semibold">{preferences.dailyGoalMin} {isTamil ? "நிமிடம்" : "min"}</span>
          </p>
        </div>

        {/* Rest Day Safe Badge */}
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--tulsi-ink)] bg-[var(--tulsi-tint)] px-2.5 py-1 rounded-full border border-[var(--tulsi)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--tulsi)]" />
          <span>{isTamil ? "ஓய்வு நாள் பாதுகாப்பு" : "Rest day active"}</span>
        </div>
      </div>

      {/* 1. Continue Card (The ONE Haldi Primary Action on the Screen) */}
      <Card
        variant="flat"
        className="p-5 border-2 border-[var(--line-strong)] bg-[var(--surface)] shadow-xs"
        data-testid="home-continue-card"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--mayura)]">
            {data?.nextLesson.levelTitle || (isTamil ? "நிலை 0 — ஒலிகள்" : "Level 0 — Sounds")}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-2)] border border-[var(--line)]">
            {data?.nextLesson.estMinutes || 10} min
          </span>
        </div>

        <h2 className="text-xl font-bold text-[var(--ink)] leading-snug mb-1">
          {data?.nextLesson.title || (isTamil ? "பாடம் 1: முதல் ஐந்து ஒலிகள்" : "Lesson 1: First Five Sounds")}
        </h2>

        <p className="text-xs text-[var(--ink-2)] mb-5">
          {data?.nextLesson.goal || (isTamil ? "குறில், நெடில் உயிர் ஒலிகளைப் பயிலுங்கள்" : "Master short and long vowel sounds with pronunciation guides.")}
        </p>

        <Link href={`/lesson/${data?.nextLesson.id || "level-0-lesson-1"}`} className="block w-full">
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-xs"
            data-testid="home-start-lesson-cta"
          >
            {isTamil ? "பாடத்தைத் தொடங்கு" : "Start lesson"}
            <ArrowRight className="w-5 h-5 ml-1.5" />
          </Button>
        </Link>
      </Card>

      {/* 2. Review Card (Secondary Action) */}
      <Link href="/review" className="block">
        <Card
          variant="flat"
          className="p-4 flex items-center justify-between hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
          data-testid="home-review-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-2)] text-[var(--haldi-edge)] flex items-center justify-center font-bold border border-[var(--line-strong)] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-[15px] text-[var(--ink)] flex items-center gap-2">
                <span>{isTamil ? "தினசரி மீள்பார்வை" : "Daily Review"}</span>
                {data && data.review.dueCount > 0 && (
                  <span
                    data-testid="home-review-due-badge"
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--haldi-tint)] text-[var(--ink)] border border-[var(--haldi)]"
                  >
                    {data.review.dueCount} {isTamil ? "உள்ளது" : "due"}
                  </span>
                )}
              </div>
              <div className="text-xs text-[var(--ink-2)]">
                {data?.review.dueCount === 0
                  ? isTamil
                    ? data.review.messageTa
                    : data.review.messageEn
                  : `${data?.review.dueCount} ${isTamil ? "சொற்கள் மீள்பார்வைக்கு உள்ளன" : "items due (≈4 min)"}`}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--ink-3)]" />
        </Card>
      </Link>

      {/* 3. Today's Reading Card */}
      <Link href="/read" className="block">
        <Card
          variant="flat"
          className="p-5 hover:border-[var(--neel)] transition-colors cursor-pointer"
          data-testid="home-reading-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--mayura)] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>{isTamil ? "இன்றைய ஸ்லோகம்" : "Today's Verse"}</span>
            </div>
            <span className="text-xs text-[var(--ink-3)]">
              {isTamil ? "வாசிக்க →" : "Read →"}
            </span>
          </div>

          <div className="py-2">
            <SanskritText
              script={preferences.script}
              size="body"
              helperText={
                preferences.helperLine !== "off"
                  ? data?.reading.transliteration
                  : undefined
              }
            >
              {preferences.script === "tamil"
                ? data?.reading.tamilScript
                : data?.reading.sanskrit}
            </SanskritText>
          </div>

          <div className="text-center text-xs text-[var(--ink-2)] mt-2 italic">
            &ldquo;{isTamil ? data?.reading.translationTa : data?.reading.translationEn}&rdquo;
          </div>
        </Card>
      </Link>

      {/* 4. Weekly Goal Progress */}
      <Card variant="flat" className="p-4 bg-[var(--surface)] text-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-[var(--ink)]">
            {isTamil ? "வாராந்திர முன்னேற்றம்" : "Weekly Momentum"}
          </span>
          <span className="font-semibold text-[var(--ink-2)]">
            {data?.weekProgress.daysActive || 1} / {data?.weekProgress.weeklyGoalDays || 5} {isTamil ? "நாட்கள்" : "days"}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
            const active = idx < (data?.weekProgress.daysActive || 1);
            return (
              <div
                key={idx}
                className={`h-7 rounded-[8px] flex items-center justify-center font-bold text-[11px] transition-colors ${
                  active
                    ? "bg-[var(--tulsi)] text-white"
                    : "bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)]"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </Card>
    </main>
  );
}
