"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, Trophy, Check, ArrowRight } from "lucide-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onContinue: () => void;
  title: string;
  subtitle?: string;
  isTamil?: boolean;
}

export function CelebrationModal({
  isOpen,
  onContinue,
  title,
  subtitle,
  isTamil = false,
}: CelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      data-testid="celebration-modal"
    >
      <Card
        variant="flat"
        className="w-full max-w-sm p-6 bg-[var(--surface)] border-2 border-[var(--line-strong)] text-center space-y-4 shadow-2xl animate-scaleUp"
      >
        {/* Gentle chime / visual badge per SPEC §13.3 */}
        <div className="w-16 h-16 rounded-full bg-[var(--primary-tint)] text-[var(--primary)] border-2 border-[var(--primary)] mx-auto flex items-center justify-center shadow-md animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--tulsi)] block">
            {isTamil ? "வெற்றி! பாடம் நிறைவுற்றது" : "Lesson Complete!"}
          </span>
          <h2 className="text-xl font-bold text-[var(--ink)]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[var(--ink-2)]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Milestone Badge */}
        <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center gap-2 text-xs font-semibold text-[var(--ink)]">
          <Sparkles className="w-4 h-4 text-[var(--haldi-edge)]" />
          <span>
            {isTamil ? "+10 புதிய சொற்கள் நினைவில் பதிந்தது" : "Vocabulary & Progress Updated"}
          </span>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onContinue}
          className="w-full font-bold shadow-xs text-sm"
          data-testid="celebration-continue-btn"
        >
          <span>{isTamil ? "தொடர்க" : "Continue"}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Card>
    </div>
  );
}
