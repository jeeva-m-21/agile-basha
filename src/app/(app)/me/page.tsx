"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WeeklySummaryCard } from "@/components/progress/WeeklySummaryCard";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";
import { computeProgressSummary, ProgressSummary } from "@/lib/progress/skills";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import {
  User,
  Globe,
  Type,
  Clock,
  ShieldCheck,
  Flame,
  BookCheck,
  RefreshCw,
  Eye,
  Sliders,
  Download,
  Trash2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function MePage() {
  const preferences = usePreferencesStore();
  const { language, setLanguage } = useTranslation();
  const isTamil = language === "ta";

  const [progress, setProgress] = useState<ProgressSummary>(() => computeProgressSummary());
  const [isExporting, setIsExporting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/account/export");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `basha-learning-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await fetch("/api/account/reset", { method: "POST" });
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      preferences.loadPreferences();
      setProgress(computeProgressSummary());
      setShowResetModal(false);
      setResetSuccessNotice(
        isTamil
          ? "உங்கள் கற்றல் தரவுகள் அனைத்தும் மீட்டமைக்கப்பட்டன."
          : "All learning data has been successfully reset."
      );
    } catch (e) {
      console.error("Reset error:", e);
    } finally {
      setIsResetting(false);
    }
  };

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

      {/* PWA Install Prompt Banner */}
      <InstallPromptBanner />

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

        {/* 4. Accessibility & Display per SPEC §16 */}
        <Card variant="flat" className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
            <Eye className="w-4 h-4 text-[var(--mayura)]" />
            <span>{isTamil ? "அணுகல்தன்மை & காட்சி" : "Accessibility & Display"}</span>
          </div>

          {/* Text Size Adjustment */}
          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-[var(--ink-2)]">
              {isTamil ? "எழுத்து அளவு (Text Size)" : "Text Size"}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "normal" as const, label: isTamil ? "இயல்பான" : "Normal (100%)" },
                { id: "large" as const, label: isTamil ? "பெரியது" : "Large (112%)" },
                { id: "xlarge" as const, label: isTamil ? "மிகப் பெரியது" : "X-Large (125%)" },
              ].map((size) => (
                <button
                  key={size.id}
                  type="button"
                  data-testid={`text-size-${size.id}`}
                  onClick={() => preferences.setTextSize(size.id)}
                  className={`py-2 px-1 rounded-[10px] text-center font-bold border transition-colors ${
                    preferences.textSize === size.id
                      ? "bg-[var(--neel)] text-white border-[var(--neel)]"
                      : "bg-[var(--surface-2)] text-[var(--ink)] border-[var(--line-strong)]"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-[var(--line)]">
            <div>
              <div className="text-xs font-semibold text-[var(--ink)]">
                {isTamil ? "உயர் மாறுபாடு பயன்முறை" : "High Contrast Mode"}
              </div>
              <div className="text-[11px] text-[var(--ink-3)]">
                {isTamil ? "எழுத்துக்கள் தெளிவாகத் தெரிய உதவும்" : "Maximizes contrast for clear readability"}
              </div>
            </div>
            <button
              type="button"
              data-testid="high-contrast-toggle"
              onClick={() => preferences.setHighContrast(!preferences.highContrast)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                preferences.highContrast
                  ? "bg-[var(--neel)] text-white"
                  : "bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)]"
              }`}
            >
              {preferences.highContrast ? (isTamil ? "இயக்கப்பட்டது" : "ON") : (isTamil ? "முடக்கப்பட்டது" : "OFF")}
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-[var(--line)]">
            <div>
              <div className="text-xs font-semibold text-[var(--ink)]">
                {isTamil ? "குறைக்கப்பட்ட அசைவு" : "Reduced Motion"}
              </div>
              <div className="text-[11px] text-[var(--ink-3)]">
                {isTamil ? "அனிமேஷன்களைக் குறைக்கும்" : "Minimizes animations and screen movement"}
              </div>
            </div>
            <button
              type="button"
              data-testid="reduced-motion-toggle"
              onClick={() => preferences.setReducedMotion(!preferences.reducedMotion)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                preferences.reducedMotion
                  ? "bg-[var(--neel)] text-white"
                  : "bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)]"
              }`}
            >
              {preferences.reducedMotion ? (isTamil ? "இயக்கப்பட்டது" : "ON") : (isTamil ? "முடக்கப்பட்டது" : "OFF")}
            </button>
          </div>
        </Card>

        {/* 5. Account, Data & Privacy per SPEC §15 */}
        <Card variant="flat" className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
            <ShieldCheck className="w-4 h-4 text-[var(--tulsi)]" />
            <span>{isTamil ? "தரவு & தனியுரிமை" : "Data & Privacy"}</span>
          </div>

          <p className="text-xs text-[var(--ink-2)] leading-relaxed">
            {isTamil
              ? "பாஷா எந்தவொரு பயனர் தரவையும் விற்காது. உங்கள் வாசிப்பு வரலாறு மற்றும் கற்றல் முன்னேற்றம் உங்களுக்கே சொந்தமானது."
              : "Bhāṣā never sells learner data. Your study history and vocabulary progress belong entirely to you."}
          </p>

          {resetSuccessNotice && (
            <div className="p-2.5 rounded-xl bg-[var(--tulsi-tint)] border border-[var(--tulsi)] text-xs text-[var(--tulsi)] font-medium">
              {resetSuccessNotice}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              data-testid="export-data-btn"
              className="w-full text-xs justify-center"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-[var(--neel)]" />
              {isExporting
                ? isTamil
                  ? "பதிவிறக்குகிறது..."
                  : "Exporting..."
                : isTamil
                ? "கற்றல் தரவை ஏற்றுமதி செய் (JSON)"
                : "Export Learning Data (JSON)"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResetModal(true)}
              data-testid="reset-data-btn"
              className="w-full text-xs justify-center text-[var(--sindoor)] hover:bg-[var(--sindoor-tint)]"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              {isTamil ? "அனைத்து முன்னேற்றத்தையும் மீட்டமை" : "Reset / Delete Learning Progress"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          data-testid="reset-confirm-modal"
        >
          <Card
            variant="flat"
            className="w-full max-w-sm p-5 bg-[var(--surface)] border-2 border-[var(--sindoor)]/40 rounded-2xl space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-2.5 text-[var(--sindoor)]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-base">
                {isTamil ? "முன்னேற்றத்தை மீட்டமைக்கவா?" : "Reset All Learning Data?"}
              </h3>
            </div>

            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              {isTamil
                ? "இது உங்கள் கற்ற பாடங்கள், நினைவாற்றல் சொற்கள் மற்றும் தொடர் சாதனைத் தரவுகள் அனைத்தையும் அழிக்கும். இதை திரும்பப் பெற முடியாது."
                : "This will permanently delete all mastered skills, review flashcards, and streak records. This action cannot be undone."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResetModal(false)}
                className="text-xs"
              >
                {isTamil ? "ரத்து" : "Cancel"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleResetData}
                disabled={isResetting}
                data-testid="confirm-reset-btn"
                className="text-xs bg-[var(--sindoor)] hover:bg-[var(--sindoor-ink)] border-[var(--sindoor-ink)]"
              >
                {isResetting
                  ? isTamil
                    ? "மீட்டமைக்கிறது..."
                    : "Resetting..."
                  : isTamil
                  ? "ஆம், மீட்டமை"
                  : "Yes, Reset Everything"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
