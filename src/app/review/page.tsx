"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AudioButton } from "@/components/sanskrit/AudioButton";
import { LessonProgressBar } from "@/components/lesson/LessonProgressBar";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { useAudio } from "@/hooks/useAudio";
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Star,
  Eye,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ReviewItem } from "@/lib/srs/sm2";
import { reviewStore } from "@/lib/srs/storage";

export default function ReviewPage() {
  const router = useRouter();
  const { language } = useTranslation();
  const preferences = usePreferencesStore();
  const audio = useAudio();

  const [items, setItems] = useState<ReviewItem[]>(() => reviewStore.getDueItems());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState({
    reviewed: 0,
    known: 0,
    reset: 0,
  });

  const isTamil = language === "ta";

  useEffect(() => {
    preferences.loadPreferences();

    fetch("/api/review")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) {
          setItems(data.items);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const currentItem: ReviewItem | undefined = items[currentIndex];
  const totalItems = items.length;

  const handleRate = async (quality: number) => {
    if (!currentItem) return;

    try {
      await fetch("/api/review/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: currentItem.id,
          quality,
          action: "rate",
        }),
      });
    } catch {}

    setStats((prev) => ({ ...prev, reviewed: prev.reviewed + 1 }));
    advanceNext();
  };

  const handleKnowThis = async () => {
    if (!currentItem) return;

    try {
      await fetch("/api/review/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: currentItem.id,
          quality: 5,
          action: "know_this",
        }),
      });
    } catch {}

    setStats((prev) => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      known: prev.known + 1,
    }));
    advanceNext();
  };

  const handleReset = async () => {
    if (!currentItem) return;

    try {
      await fetch("/api/review/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: currentItem.id,
          quality: 0,
          action: "reset",
        }),
      });
    } catch {}

    setStats((prev) => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      reset: prev.reset + 1,
    }));
    advanceNext();
  };

  const advanceNext = () => {
    audio.stop();
    setIsRevealed(false);
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-[var(--haldi)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--ink-2)]">
            {isTamil ? "மீள்பார்வை ஏற்றப்படுகிறது..." : "Loading review queue..."}
          </p>
        </div>
      </div>
    );
  }

  // Empty queue
  if (!currentItem && !isCompleted) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
        <header className="p-4 border-b border-[var(--line)]">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <h1 className="font-bold text-lg">
              {isTamil ? "மீள்பார்வை" : "Review"}
            </h1>
            <button
              onClick={() => router.push("/home")}
              className="text-xs font-bold text-[var(--ink-2)] hover:text-[var(--ink)]"
            >
              ✕ Close
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-[20px] bg-[var(--tulsi-tint)] text-[var(--tulsi)] border-2 border-[var(--tulsi)] flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold">
            {isTamil ? "அனைத்து மீள்பார்வையும் முடிந்தது!" : "All caught up!"}
          </h2>
          <p className="text-sm text-[var(--ink-2)] max-w-xs">
            {isTamil
              ? "இன்றைய மீள்பார்வை வரிசை காலியாக உள்ளது. புதிய பாடங்களைக் கற்க தொடங்குங்கள்!"
              : "No items are due for review right now. Come back tomorrow or continue your next lesson!"}
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full mt-4"
            onClick={() => router.push("/home")}
          >
            {isTamil ? "முகப்பிற்குத் திரும்பு" : "Return to Home"}
          </Button>
        </main>
      </div>
    );
  }

  // Session Completed Summary
  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] animate-fadeIn">
        <header className="w-full bg-[var(--surface)] border-b border-[var(--line)] sticky top-0 z-20">
          <div className="max-w-md mx-auto px-4">
            <LessonProgressBar
              currentStep={totalItems}
              totalSteps={totalItems}
              onClose={() => router.push("/home")}
            />
          </div>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col justify-between">
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[var(--tulsi-tint)] text-[var(--tulsi)] border-2 border-[var(--tulsi)] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--mayura)]">
                Spaced Repetition
              </span>
              <h1 className="text-2xl font-bold mt-1 text-[var(--ink)]">
                {isTamil ? "மீள்பார்வை நிறைவுற்றது!" : "Review Session Complete!"}
              </h1>
              <p className="text-xs text-[var(--ink-2)] mt-1">
                {isTamil
                  ? "நினைவாற்றல் இடைவெளி விதிகளின்படி உங்கள் அடுத்த மீள்பார்வை திட்டமிடப்பட்டது."
                  : "Items have been scheduled based on the SM-2 spaced repetition curve."}
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-[16px] bg-[var(--surface)] border border-[var(--line)] text-center shadow-xs">
                <div className="text-2xl font-bold text-[var(--ink)]">{stats.reviewed}</div>
                <div className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wider mt-0.5">
                  Reviewed
                </div>
              </div>
              <div className="p-3.5 rounded-[16px] bg-[var(--tulsi-tint)] border border-[var(--tulsi)] text-center shadow-xs">
                <div className="text-2xl font-bold text-[var(--tulsi)]">{stats.known}</div>
                <div className="text-[11px] font-semibold text-[var(--tulsi-ink)] uppercase tracking-wider mt-0.5">
                  Mastered
                </div>
              </div>
              <div className="p-3.5 rounded-[16px] bg-[var(--surface-2)] border border-[var(--line)] text-center shadow-xs">
                <div className="text-2xl font-bold text-[var(--ink-2)]">{stats.reset}</div>
                <div className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wider mt-0.5">
                  Reset
                </div>
              </div>
            </div>

            <Card variant="flat" className="p-4 text-left space-y-1.5 border border-[var(--line)]">
              <div className="text-xs font-bold text-[var(--mayura)] uppercase tracking-wider">
                {isTamil ? "அடுத்த மீள்பார்வை" : "Next Schedule"}
              </div>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                {isTamil
                  ? "நன்றாக நினைவிருந்த உருப்படிகள் 4 முதல் 14 நாட்கள் கழித்து மீண்டும் கேட்கப்படும்."
                  : "Items rated 'Good' or 'Easy' will return in 4 to 14 days. Weak items return tomorrow."}
              </p>
            </Card>
          </div>

          <div className="pt-6">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-lg shadow-sm"
              onClick={() => router.push("/home")}
              data-testid="review-finish-btn"
            >
              <span>{isTamil ? "முகப்பிற்குத் திரும்பு" : "Back to Home"}</span>
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Active Flashcard / Review Item
  const displaySanskrit =
    preferences.script === "tamil" ? currentItem.tamilScript : currentItem.sanskrit;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* Top Header with Progress Bar and Close (✕) */}
      <header className="w-full bg-[var(--surface)] border-b border-[var(--line)] sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4">
          <LessonProgressBar
            currentStep={currentIndex + 1}
            totalSteps={totalItems}
            onClose={() => {
              audio.stop();
              router.push("/home");
            }}
          />
        </div>
      </header>

      {/* Main Review Body */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header Controls: Item Type & Fast-Action Buttons */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--mayura)] border border-[var(--line)]">
              {currentItem.itemType} · #{currentIndex + 1} of {totalItems}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="review-know-this-btn"
                onClick={handleKnowThis}
                className="text-xs font-semibold text-[var(--tulsi)] hover:text-[var(--tulsi-ink)] flex items-center gap-1 px-2.5 py-1 rounded-[10px] bg-[var(--tulsi-tint)] border border-[var(--tulsi)] cursor-pointer transition-colors"
                title="Mark as known (fast-forward schedule)"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{isTamil ? "நன்றாகத் தெரியும்" : "I know this"}</span>
              </button>

              <button
                type="button"
                data-testid="review-reset-btn"
                onClick={handleReset}
                className="text-xs font-semibold text-[var(--ink-3)] hover:text-[var(--sindoor)] flex items-center gap-1 px-2 py-1 rounded-[10px] bg-[var(--surface-2)] border border-[var(--line)] cursor-pointer transition-colors"
                title="Reset to day 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Prompt Card */}
          <Card
            variant="flat"
            className="p-6 text-center border-2 border-[var(--line-strong)] bg-[var(--surface)] shadow-xs space-y-4 min-h-[220px] flex flex-col items-center justify-center"
            data-testid="review-card"
          >
            <div
              lang="sa"
              data-testid="review-sanskrit-prompt"
              className="text-4xl sm:text-5xl font-sanskrit font-bold text-[var(--ink)] tracking-wide"
            >
              {displaySanskrit}
            </div>

            {/* Helper line if enabled */}
            {preferences.helperLine !== "off" && (
              <div className="text-sm font-mono font-medium text-[var(--ink-3)]">
                {currentItem.iast}
              </div>
            )}

            {/* Audio Button */}
            <div className="pt-1">
              <AudioButton
                onPlay={() =>
                  audio.playSingle(
                    currentItem.soundToPlay || currentItem.iast,
                    currentItem.isLongVowel ?? false
                  )
                }
                isPlaying={audio.isPlaying}
                isSlow={audio.isSlow}
                onToggleSlow={audio.toggleSlow}
              />
            </div>
          </Card>

          {/* Answer Card / Revelation */}
          {isRevealed ? (
            <Card
              variant="highlight"
              className="p-5 text-center space-y-2 animate-fadeIn border-2 border-[var(--neel)] bg-[var(--neel-tint)]"
              data-testid="review-answer-card"
            >
              <div className="text-base font-bold text-[var(--ink)]">
                {isTamil ? currentItem.meaningTa : currentItem.meaningEn}
              </div>
              {currentItem.explanationEn && (
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  {isTamil ? currentItem.explanationTa : currentItem.explanationEn}
                </p>
              )}
            </Card>
          ) : (
            <button
              type="button"
              data-testid="review-reveal-btn"
              onClick={() => setIsRevealed(true)}
              className="w-full h-14 rounded-[14px] bg-[var(--surface-2)] border-2 border-dashed border-[var(--line-strong)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--neel)] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <Eye className="w-4 h-4" />
              <span>{isTamil ? "பொருளைக் காண்க" : "Show Meaning & Grammar"}</span>
            </button>
          )}
        </div>

        {/* Bottom Actions: Self-Assessment Rating Buttons */}
        <div className="pt-6">
          {isRevealed ? (
            <div className="space-y-2">
              <div className="text-center text-xs font-semibold text-[var(--ink-3)] uppercase tracking-wider">
                How well did you recall?
              </div>
              <div className="grid grid-cols-4 gap-2">
                {/* 1. Again (Quality 1) */}
                <button
                  type="button"
                  data-testid="rate-again-btn"
                  onClick={() => handleRate(1)}
                  className="h-14 rounded-[14px] flex flex-col items-center justify-center p-1 bg-[var(--sindoor-tint)] border-2 border-[var(--sindoor)] text-[var(--sindoor)] font-bold cursor-pointer hover:brightness-105 active:translate-y-[1px]"
                >
                  <span className="text-sm">Again</span>
                  <span className="text-[10px] font-normal opacity-80">1 d</span>
                </button>

                {/* 2. Hard (Quality 3) */}
                <button
                  type="button"
                  data-testid="rate-hard-btn"
                  onClick={() => handleRate(3)}
                  className="h-14 rounded-[14px] flex flex-col items-center justify-center p-1 bg-[var(--haldi-tint)] border-2 border-[var(--haldi)] text-[var(--ink)] font-bold cursor-pointer hover:brightness-105 active:translate-y-[1px]"
                >
                  <span className="text-sm">Hard</span>
                  <span className="text-[10px] font-normal opacity-80">2 d</span>
                </button>

                {/* 3. Good (Quality 4) */}
                <button
                  type="button"
                  data-testid="rate-good-btn"
                  onClick={() => handleRate(4)}
                  className="h-14 rounded-[14px] flex flex-col items-center justify-center p-1 bg-[var(--neel-tint)] border-2 border-[var(--neel)] text-[var(--neel-edge)] font-bold cursor-pointer hover:brightness-105 active:translate-y-[1px]"
                >
                  <span className="text-sm">Good</span>
                  <span className="text-[10px] font-normal opacity-80">4 d</span>
                </button>

                {/* 4. Easy (Quality 5) */}
                <button
                  type="button"
                  data-testid="rate-easy-btn"
                  onClick={() => handleRate(5)}
                  className="h-14 rounded-[14px] flex flex-col items-center justify-center p-1 bg-[var(--tulsi-tint)] border-2 border-[var(--tulsi)] text-[var(--tulsi)] font-bold cursor-pointer hover:brightness-105 active:translate-y-[1px]"
                >
                  <span className="text-sm">Easy</span>
                  <span className="text-[10px] font-normal opacity-80">7+ d</span>
                </button>
              </div>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-xs"
              onClick={() => setIsRevealed(true)}
            >
              <span>{isTamil ? "விடையை சரிபார்க்க" : "Check Recall"}</span>
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
