"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SanskritText } from "@/components/sanskrit/SanskritText";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { Flame, BookOpen, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  const preferences = usePreferencesStore();
  const { t } = useTranslation();

  useEffect(() => {
    preferences.loadPreferences();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* Top App Bar */}
      <header className="w-full border-b border-[var(--line)] bg-[var(--surface)] sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-[var(--ink)]">
              Haṃsa
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--agni)] font-bold text-xs border border-[var(--line-strong)]">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>1</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Home Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 space-y-4">
        {/* Next Lesson Card (The one Haldi CTA on Home) */}
        <Card variant="flat" className="p-5 border-2 border-[var(--line-strong)] shadow-xs">
          <div className="text-xs uppercase font-bold tracking-wider text-[var(--mayura)] mb-1">
            {preferences.level === "beginner" ? "Level 0 · Sounds & Script" : "Level 1 · First Sentences"}
          </div>

          <h2 className="text-xl font-bold text-[var(--ink)] mb-1">
            Lesson 1: First Five Sounds
          </h2>

          <p className="text-xs text-[var(--ink-2)] mb-4">
            Estimated time: {preferences.dailyGoalMin} min · 5 sounds & reading drill
          </p>

          <Link href="/lesson/level-0-lesson-1" className="block w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-xs"
              data-testid="home-start-lesson-cta"
            >
              Start Lesson 1
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </Link>
        </Card>

        {/* Quick Review Card */}
        <Card variant="flat" className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-2)] text-[var(--haldi-edge)] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--ink)]">Daily Review</div>
              <div className="text-xs text-[var(--ink-2)]">Your first reviews appear tomorrow</div>
            </div>
          </div>
          <span className="text-xs font-semibold text-[var(--ink-3)]">0 due</span>
        </Card>

        {/* Today's Reading Suggestion */}
        <Card variant="flat" className="p-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[var(--mayura)]">
            <BookOpen className="w-4 h-4" />
            <span>Today&apos;s Reading</span>
          </div>

          <div className="py-2">
            <SanskritText script={preferences.script} size="body" helperText="om śāntiḥ śāntiḥ śāntiḥ">
              ॐ शान्तिः शान्तिः शान्तिः
            </SanskritText>
          </div>

          <div className="text-center text-xs text-[var(--ink-2)] mt-1">
            &ldquo;Om Peace, Peace, Peace&rdquo;
          </div>
        </Card>
      </main>
    </div>
  );
}
