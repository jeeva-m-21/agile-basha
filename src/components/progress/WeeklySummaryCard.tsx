"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Clock, BookCheck, Flame, Shield, Calendar } from "lucide-react";

interface WeeklySummaryCardProps {
  minutesPracticed: number;
  wordsLearned: number;
  lessonsCompleted: number;
  daysActive: number;
  streakDays: number;
  restDayProtected?: boolean;
  isTamil?: boolean;
}

export function WeeklySummaryCard({
  minutesPracticed,
  wordsLearned,
  lessonsCompleted,
  daysActive,
  streakDays,
  restDayProtected = true,
  isTamil = false,
}: WeeklySummaryCardProps) {
  return (
    <Card
      variant="flat"
      className="p-4 border-2 border-[var(--line-strong)] bg-[var(--surface)] space-y-4"
      data-testid="weekly-summary-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--primary)]" />
          <h2 className="text-sm font-bold text-[var(--ink)]">
            {isTamil ? "வாராந்திர சாதனைகள் (Weekly Summary)" : "Weekly Summary"}
          </h2>
        </div>

        {/* Protected streak badge per SPEC §13.2 */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)] text-xs font-bold"
          data-testid="streak-badge-summary"
        >
          <Flame className="w-3.5 h-3.5 text-[var(--agni)] fill-current" />
          <span>{streakDays} days</span>
          {restDayProtected && (
            <span
              className="text-[10px] text-[var(--tulsi)] flex items-center gap-0.5 ml-1"
              title="1 protected rest day active this week"
            >
              <Shield className="w-3 h-3" />
              Protected
            </span>
          )}
        </div>
      </div>

      {/* 3 Metric Stats Grid per SPEC §13.1 */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Minutes Practiced */}
        <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] space-y-1">
          <div className="flex items-center justify-center text-[var(--primary)]">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-[var(--ink)]" data-testid="metric-minutes">
            {minutesPracticed}
          </div>
          <div className="text-[10px] text-[var(--ink-3)] font-medium leading-tight">
            {isTamil ? "நிமிடங்கள்" : "Min Practiced"}
          </div>
        </div>

        {/* Words Learned */}
        <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] space-y-1">
          <div className="flex items-center justify-center text-[var(--tulsi)]">
            <BookCheck className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-[var(--ink)]" data-testid="metric-words">
            {wordsLearned}
          </div>
          <div className="text-[10px] text-[var(--ink-3)] font-medium leading-tight">
            {isTamil ? "சொற்கள்" : "Words Learned"}
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] space-y-1">
          <div className="flex items-center justify-center text-[var(--mayura)]">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-[var(--ink)]" data-testid="metric-lessons">
            {lessonsCompleted}
          </div>
          <div className="text-[10px] text-[var(--ink-3)] font-medium leading-tight">
            {isTamil ? "பாடங்கள்" : "Lessons Done"}
          </div>
        </div>
      </div>
    </Card>
  );
}
