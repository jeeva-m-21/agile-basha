"use client";

import React, { useState } from "react";
import { SkillNode, SkillState } from "@/lib/progress/skills";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles, Lock, ArrowRight, X, ChevronDown } from "lucide-react";

interface SkillMapProps {
  skills: Array<SkillNode & { state: SkillState }>;
  isTamil?: boolean;
}

export function SkillMap({ skills, isTamil = false }: SkillMapProps) {
  const [selectedSkill, setSelectedSkill] = useState<(SkillNode & { state: SkillState }) | null>(null);

  return (
    <div className="space-y-4" data-testid="skill-map-container">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">
          {isTamil ? "திறன் வரைபடம் (Skill Map)" : "Skill Map"}
        </h2>
        <div className="flex items-center gap-3 text-[11px] text-[var(--ink-3)]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--tulsi)]" />
            {isTamil ? "தேர்ச்சி" : "Mastered"}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            {isTamil ? "பயிற்சியில்" : "In Progress"}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--ink-3)]" />
            {isTamil ? "பூட்டப்பட்டது" : "Locked"}
          </span>
        </div>
      </div>

      {/* Vertical Interactive Node Graph */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-9 before:top-4 before:bottom-4 before:w-0.5 before:bg-[var(--line)]">
        {skills.map((skill, index) => {
          const isMastered = skill.state === "mastered";
          const isInProgress = skill.state === "in_progress";
          const isLocked = skill.state === "locked";

          return (
            <div
              key={skill.id}
              className="relative flex items-center gap-4 cursor-pointer group"
              onClick={() => setSelectedSkill(skill)}
              data-testid={`skill-node-${skill.id}`}
            >
              {/* Circular State Badge */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                  isMastered
                    ? "bg-[var(--tulsi)] text-white ring-4 ring-[var(--surface)]"
                    : isInProgress
                    ? "bg-[var(--primary)] text-white ring-4 ring-[var(--primary-tint)] animate-pulse"
                    : "bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)] ring-4 ring-[var(--surface)]"
                }`}
              >
                {isMastered ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isInProgress ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Node Card */}
              <Card
                variant="flat"
                className={`flex-1 p-3.5 border transition-all ${
                  isMastered
                    ? "border-[var(--line-strong)] bg-[var(--surface)] hover:border-[var(--tulsi)]"
                    : isInProgress
                    ? "border-2 border-[var(--primary)] bg-[var(--surface)] shadow-xs"
                    : "border-[var(--line)] bg-[var(--surface-2)] opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">
                        Lvl {skill.level} • {skill.category}
                      </span>
                      <span lang="sa" className="text-xs font-sanskrit font-bold text-[var(--ink-2)]">
                        {skill.sanskrit}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                      {isTamil ? skill.titleTa : skill.titleEn}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[var(--ink-3)] group-hover:text-[var(--primary)] transition-colors shrink-0" />
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn"
          data-testid="skill-detail-modal"
        >
          <Card
            variant="flat"
            className="w-full max-w-sm p-5 bg-[var(--surface)] border-2 border-[var(--line-strong)] space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)]">
                  Level {selectedSkill.level}
                </span>
                <span lang="sa" className="text-sm font-sanskrit font-bold text-[var(--ink)]">
                  {selectedSkill.sanskrit}
                </span>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-[var(--ink-3)] hover:text-[var(--ink)]"
                data-testid="close-skill-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[var(--ink)]">
                {isTamil ? selectedSkill.titleTa : selectedSkill.titleEn}
              </h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                {isTamil ? selectedSkill.youCanNowTa : selectedSkill.youCanNowEn}
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-xs font-semibold capitalize text-[var(--ink-3)]">
                State: {selectedSkill.state.replace("_", " ")}
              </span>

              {selectedSkill.lessonId && (
                <a
                  href={`/${selectedSkill.lessonId.replace("-", "/")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--primary)] text-white text-xs font-bold hover:brightness-105 shadow-xs"
                  data-testid="skill-lesson-btn"
                >
                  <span>{isTamil ? "பாடத்திற்குச் செல்" : "Go to Lesson"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
