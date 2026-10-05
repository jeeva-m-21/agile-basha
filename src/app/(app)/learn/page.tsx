"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { curriculumLevels } from "@/lib/curriculum/data";
import { useTranslation } from "@/i18n/provider";
import { Lock, CheckCircle2, PlayCircle } from "lucide-react";

export default function LearnPage() {
  const { language } = useTranslation();
  const isTamil = language === "ta";

  return (
    <main className="max-w-md w-full mx-auto px-4 py-5 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">
          {isTamil ? "பாடத்திட்டம்" : "Course Map"}
        </h1>
        <p className="text-xs text-[var(--ink-2)] mt-0.5">
          {isTamil ? "படிநிலைகள் மற்றும் பாடங்கள்" : "Structured levels from sounds to classical literature"}
        </p>
      </div>

      <div className="space-y-6">
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
    </main>
  );
}
