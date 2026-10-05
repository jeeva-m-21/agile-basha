"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WeeklySummaryCard } from "@/components/progress/WeeklySummaryCard";
import { computeProgressSummary, ProgressSummary } from "@/lib/progress/skills";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { User, Globe, Type, Clock, ShieldCheck, Flame, BookCheck, RefreshCw } from "lucide-react";

export default function MePage() {
  const preferences = usePreferencesStore();
  const { language, setLanguage } = useTranslation();
  const isTamil = language === "ta";

  const [progress, setProgress] = useState<ProgressSummary>(() => computeProgressSummary());

  useEffect(() => {
    preferences.loadPreferences();
    fetch("/api/progress/summary")
      .then((res) => res.json())
      .then((data) => {
        if (data?.stats) {
          setProgress(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="max-w-md w-full mx-auto px-4 py-5 space-y-5">
      {/* Profile Header */}
      <div className="flex items-center gap-3.5 p-4 rounded-[16px] bg-[var(--surface)] border border-[var(--line)]">
        <div className="w-14 h-14 rounded-full bg-[var(--surface-2)] text-[var(--ink)] flex items-center justify-center font-bold text-xl border-2 border-[var(--line-strong)]">
          <User className="w-7 h-7 text-[var(--ink-2)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--ink)]">
            {isTamil ? "என் கணக்கு" : "My Profile"}
          </h1>
          <p className="text-xs text-[var(--ink-2)]">
            {isTamil ? "விருப்பத்தேர்வுகள் & முன்னேற்றம்" : "Learner Settings & Progress"}
          </p>
        </div>
      </div>

      {/* Vocabulary Count Card per SPEC §13.1 */}
      <Card
        variant="flat"
        className="p-4 border-2 border-[var(--line-strong)] bg-[var(--surface)] space-y-3"
        data-testid="vocabulary-count-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookCheck className="w-5 h-5 text-[var(--tulsi)]" />
            <div>
              <div className="font-bold text-sm text-[var(--ink)]">
                {isTamil ? "சொற்களஞ்சியம் (Vocabulary)" : "Vocabulary Count"}
              </div>
              <div className="text-xs text-[var(--ink-2)]">
                {progress.stats.wordsLearned} of {progress.stats.vocabularyCount} words mastered
              </div>
            </div>
          </div>

          {progress.stats.wordsDueForReview > 0 && (
            <a
              href="/review"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--haldi-tint)] text-[var(--ink)] border border-[var(--haldi)] text-xs font-bold hover:brightness-105"
            >
              <RefreshCw className="w-3 h-3 text-[var(--haldi-edge)]" />
              <span>{progress.stats.wordsDueForReview} due</span>
            </a>
          )}
        </div>
      </Card>

      {/* Weekly Summary Card per SPEC §13.1 & §13.2 */}
      <WeeklySummaryCard
        minutesPracticed={progress.stats.minutesPracticedWeek}
        wordsLearned={progress.stats.wordsLearned}
        lessonsCompleted={progress.stats.lessonsCompletedWeek}
        daysActive={progress.stats.daysActiveWeek}
        streakDays={progress.stats.streakDays}
        restDayProtected={progress.stats.restDayProtected}
        isTamil={isTamil}
      />

      {/* Settings Section */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
          {isTamil ? "அமைப்புகள் (Settings)" : "Learning Settings"}
        </div>

        {/* 1. Interface Language Switcher */}
        <Card variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
              <Globe className="w-4 h-4 text-[var(--neel)]" />
              <span>{isTamil ? "பயிலும் மொழி" : "Learn In Language"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                preferences.setLearnIn("en");
                setLanguage("en");
              }}
              className={`py-2 px-3 rounded-[10px] text-xs font-bold border transition-colors ${
                language === "en"
                  ? "bg-[var(--neel)] text-white border-[var(--neel)]"
                  : "bg-[var(--surface-2)] text-[var(--ink)] border-[var(--line-strong)]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => {
                preferences.setLearnIn("ta");
                setLanguage("ta");
              }}
              className={`py-2 px-3 rounded-[10px] text-xs font-bold border transition-colors ${
                language === "ta"
                  ? "bg-[var(--neel)] text-white border-[var(--neel)]"
                  : "bg-[var(--surface-2)] text-[var(--ink)] border-[var(--line-strong)]"
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>
        </Card>

        {/* 2. Sanskrit Display Script */}
        <Card variant="flat" className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
            <Type className="w-4 h-4 text-[var(--haldi-edge)]" />
            <span>{isTamil ? "சமஸ்கிருத எழுத்து வடிவம்" : "Show Sanskrit in"}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-xs">
            {[
              { id: "devanagari" as const, label: "Devanāgarī" },
              { id: "tamil" as const, label: "தமிழ் வடிவம்" },
              { id: "iast" as const, label: "IAST Roman" },
            ].map((scr) => (
              <button
                key={scr.id}
                type="button"
                onClick={() => preferences.setScript(scr.id)}
                className={`py-2 px-1 rounded-[10px] text-center font-bold border transition-colors ${
                  preferences.script === scr.id
                    ? "bg-[var(--neel)] text-white border-[var(--neel)]"
                    : "bg-[var(--surface-2)] text-[var(--ink)] border-[var(--line-strong)]"
                }`}
              >
                {scr.label}
              </button>
            ))}
          </div>
        </Card>

        {/* 3. Daily Goal */}
        <Card variant="flat" className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
            <Clock className="w-4 h-4 text-[var(--tulsi)]" />
            <span>{isTamil ? "தினசரி நேரம்" : "Daily Goal"}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-xs">
            {[5, 10, 20].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => preferences.setDailyGoalMin(mins)}
                className={`py-2 px-2 rounded-[10px] text-center font-bold border transition-colors ${
                  preferences.dailyGoalMin === mins
                    ? "bg-[var(--neel)] text-white border-[var(--neel)]"
                    : "bg-[var(--surface-2)] text-[var(--ink)] border-[var(--line-strong)]"
                }`}
              >
                {mins} {isTamil ? "நிமிடம்" : "min"}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
