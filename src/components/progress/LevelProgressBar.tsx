"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";

interface LevelProgressBarProps {
  level: number;
  levelName: string;
  progressPercent: number;
  youCanNow: string;
  isTamil?: boolean;
}

export function LevelProgressBar({
  level,
  levelName,
  progressPercent,
  youCanNow,
  isTamil = false,
}: LevelProgressBarProps) {
  return (
    <Card
      variant="flat"
      className="p-4 border-2 border-[var(--line-strong)] bg-[var(--surface)] space-y-3"
      data-testid="level-progress-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--primary-tint)] text-[var(--primary)] flex items-center justify-center font-bold text-sm border border-[var(--primary)]">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-wider">
              {isTamil ? `நிலை ${level}` : `Level ${level}`}
            </div>
            <div className="font-bold text-sm text-[var(--ink)]">
              {levelName}
            </div>
          </div>
        </div>

        <span className="text-xs font-bold text-[var(--primary)] px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--line)]">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-[var(--surface-2)] h-3 rounded-full overflow-hidden border border-[var(--line)] p-0.5">
        <div
          className="bg-gradient-to-r from-[var(--primary)] to-[var(--mayura)] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(5, Math.min(100, progressPercent))}%` }}
          data-testid="progress-bar-fill"
        />
      </div>

      {/* "You can now..." statement per SPEC §13.1 */}
      <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[var(--haldi-edge)] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)] block">
            {isTamil ? "இப்போது உங்களால் முடியும்:" : "You can now:"}
          </span>
          <p className="text-xs font-medium text-[var(--ink)] leading-snug">
            {youCanNow}
          </p>
        </div>
      </div>
    </Card>
  );
}
