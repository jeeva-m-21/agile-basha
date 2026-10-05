"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation, type Language } from "@/i18n/provider";
import { User, Settings, Globe, Type, Clock, ShieldCheck, Flame } from "lucide-react";

export default function MePage() {
  const preferences = usePreferencesStore();
  const { language, setLanguage } = useTranslation();
  const isTamil = language === "ta";

  useEffect(() => {
    preferences.loadPreferences();
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
            {isTamil ? "விருப்பத்தேர்வுகள் & முன்னேற்றம்" : "Learner Settings & Preferences"}
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card variant="flat" className="p-3.5 text-center">
          <div className="text-2xl font-bold text-[var(--ink)]">0</div>
          <div className="text-xs text-[var(--ink-2)] mt-0.5">
            {isTamil ? "கற்ற சொற்கள்" : "Words Learned"}
          </div>
        </Card>
        <Card variant="flat" className="p-3.5 text-center">
          <div className="text-2xl font-bold text-[var(--agni)] flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-current" />
            1
          </div>
          <div className="text-xs text-[var(--ink-2)] mt-0.5">
            {isTamil ? "தொடர் நாட்கள் (Streak)" : "Day Streak"}
          </div>
        </Card>
      </div>

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
