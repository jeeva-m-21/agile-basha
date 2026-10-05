"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LevelProgressBar } from "@/components/progress/LevelProgressBar";
import { SkillMap } from "@/components/progress/SkillMap";
import { curriculumLevels } from "@/lib/curriculum/data";
import { computeProgressSummary, ProgressSummary } from "@/lib/progress/skills";
import { useTranslation } from "@/i18n/provider";
import { Lock, PlayCircle, Map, Layers } from "lucide-react";

export default function LearnPage() {
  const { language } = useTranslation();
  const isTamil = language === "ta";

  const [activeTab, setActiveTab] = useState<"skills" | "curriculum">("skills");
  const [progress, setProgress] = useState<ProgressSummary>(() => computeProgressSummary());

  useEffect(() => {
    fetch("/api/progress/summary")
      .then((res) => res.json())
      .then((data) => {
        if (data?.skills) {
          setProgress(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="max-w-md w-full mx-auto px-4 py-5 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">
          {isTamil ? "கற்றல் & பாடத்திட்டம்" : "Learn & Progress"}
        </h1>
        <p className="text-xs text-[var(--ink-2)] mt-0.5">
          {isTamil
            ? "திறன் வரைபடம் மற்றும் படிப்படியான பாடங்கள்"
            : "Visual skill map and structured progression from sounds to texts"}
        </p>
      </div>

      {/* Tabs: Skill Map vs Curriculum Units */}
      <div className="flex border-b border-[var(--line)] gap-4" data-testid="learn-tabs">
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-1.5 pb-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "skills"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]"
          }`}
          data-testid="tab-skill-map"
        >
          <Map className="w-4 h-4" />
          <span>{isTamil ? "திறன் வரைபடம்" : "Skill Map"}</span>
        </button>

        <button
          onClick={() => setActiveTab("curriculum")}
          className={`flex items-center gap-1.5 pb-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "curriculum"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]"
          }`}
          data-testid="tab-curriculum-units"
        >
          <Layers className="w-4 h-4" />
          <span>{isTamil ? "படிநிலைகள் & பாடங்கள்" : "Course Units"}</span>
        </button>
      </div>

      {/* Tab 1: Skill Map & Level Progress Bar */}
      {activeTab === "skills" && (
        <div className="space-y-5">
          <LevelProgressBar
            level={progress.currentLevel}
            levelName={isTamil ? progress.levelNameTa : progress.levelNameEn}
            progressPercent={progress.levelProgressPercent}
            youCanNow={isTamil ? progress.youCanNowTa : progress.youCanNowEn}
            isTamil={isTamil}
          />

          <SkillMap skills={progress.skills} isTamil={isTamil} />
        </div>
      )}

      {/* Tab 2: Structured Curriculum Units */}
      {activeTab === "curriculum" && (
        <div className="space-y-6" data-testid="curriculum-units-container">
          {curriculumLevels.map((lvl) => {
            const isCurrent = lvl.orderNum === 0;

            return (
              <div key={lvl.id} className="space-y-3">
                <div className="p-3.5 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line-strong)]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--mayura)]">
                    {isTamil ? `நிலை ${lvl.orderNum}` : `Level ${lvl.orderNum}`}
                  </div>
                  <h2 className="text-lg font-bold text-[var(--ink)]">
                    {isTamil ? lvl.titleTa : lvl.titleEn}
                  </h2>
                  <p className="text-xs text-[var(--ink-2)] mt-1">
                    {isTamil ? lvl.outcomeTa : lvl.outcomeEn}
                  </p>
                </div>

                {/* Units and Lessons */}
                {lvl.units.length > 0 ? (
                  <div className="space-y-2 pl-2">
                    {lvl.units.map((unit) => (
                      <div key={unit.id} className="space-y-2">
                        <div className="text-xs font-bold text-[var(--ink-3)] uppercase">
                          {isTamil ? unit.titleTa : unit.titleEn}
                        </div>

                        <div className="space-y-2">
                          {unit.lessons.map((lesson, idx) => {
                            const isUnlocked = isCurrent && idx === 0;

                            return (
                              <Card
                                key={lesson.id}
                                variant="flat"
                                className={`p-3.5 flex items-center justify-between ${
                                  isUnlocked
                                    ? "border-2 border-[var(--haldi-edge)] bg-[var(--surface)]"
                                    : "bg-[var(--surface)] opacity-80"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                                      isUnlocked
                                        ? "bg-[var(--haldi)] text-[var(--ink)] shadow-xs"
                                        : "bg-[var(--line)] text-[var(--ink-3)]"
                                    }`}
                                  >
                                    {isUnlocked ? (
                                      <PlayCircle className="w-5 h-5 fill-current" />
                                    ) : (
                                      <Lock className="w-4 h-4" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-sm text-[var(--ink)]">
                                      {isTamil ? lesson.titleTa : lesson.titleEn}
                                    </div>
                                    <div className="text-[11px] text-[var(--ink-2)]">
                                      {lesson.estMinutes} min · {isTamil ? lesson.goalTa : lesson.goalEn}
                                    </div>
                                  </div>
                                </div>

                                {isUnlocked && (
                                  <Link href={`/lesson/${lesson.id}`}>
                                    <Button size="sm" variant="primary" className="h-9 px-3 text-xs">
                                      {isTamil ? "தொடங்கு" : "Start"}
                                    </Button>
                                  </Link>
                                )}
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[var(--ink-3)] italic pl-2">
                    {isTamil ? "விரைவில் வரும்" : "Unlocks as you progress through Level 0"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
