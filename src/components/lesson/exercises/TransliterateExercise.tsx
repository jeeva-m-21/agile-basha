"use client";

import React from "react";
import { OptionCard } from "../OptionCard";

export interface TransliterateOption {
  id: string;
  text: string;
  helper?: string;
  script?: string;
}

export interface TransliterateExerciseProps {
  sourceText: string;
  sourceScriptLabel: string;
  targetScriptLabel: string;
  options: TransliterateOption[];
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  status?: "idle" | "correct" | "incorrect";
  correctOptionId?: string;
  disabled?: boolean;
}

export function TransliterateExercise({
  sourceText,
  sourceScriptLabel,
  targetScriptLabel,
  options,
  selectedOptionId,
  onSelectOption,
  status = "idle",
  correctOptionId,
  disabled = false,
}: TransliterateExerciseProps) {
  return (
    <div className="space-y-6" data-testid="transliterate-exercise">
      {/* Source Prompt Card */}
      <div className="p-6 bg-[var(--surface)] border-2 border-[var(--line-strong)] rounded-[18px] text-center shadow-xs space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--mayura)] uppercase tracking-wider">
          <span>{sourceScriptLabel}</span>
          <span>→</span>
          <span>{targetScriptLabel}</span>
        </div>

        <div
          lang="sa"
          data-testid="transliterate-source"
          className="text-3xl sm:text-4xl font-sanskrit font-bold text-[var(--ink)] tracking-wider py-1"
        >
          {sourceText}
        </div>
      </div>

      {/* Target Options */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-wider">
          Choose the matching {targetScriptLabel} transliteration:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            let optStatus: "idle" | "correct" | "incorrect" = "idle";
            if (status !== "idle") {
              if (opt.id === correctOptionId) {
                optStatus = "correct";
              } else if (opt.id === selectedOptionId) {
                optStatus = "incorrect";
              }
            }

            return (
              <OptionCard
                key={opt.id}
                id={opt.id}
                text={opt.text}
                helper={opt.helper}
                isSelected={selectedOptionId === opt.id}
                status={optStatus}
                onSelect={() => !disabled && onSelectOption(opt.id)}
                disabled={disabled}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
