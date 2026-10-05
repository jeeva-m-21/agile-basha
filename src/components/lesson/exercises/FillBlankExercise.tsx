"use client";

import React from "react";
import { OptionCard } from "../OptionCard";

export interface FillBlankOption {
  id: string;
  text: string;
  helper?: string;
}

export interface FillBlankExerciseProps {
  sentenceBefore: string;
  sentenceAfter: string;
  options: FillBlankOption[];
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  status?: "idle" | "correct" | "incorrect";
  correctOptionId?: string;
  disabled?: boolean;
  script?: "devanagari" | "tamil" | "iast";
}

export function FillBlankExercise({
  sentenceBefore,
  sentenceAfter,
  options,
  selectedOptionId,
  onSelectOption,
  status = "idle",
  correctOptionId,
  disabled = false,
  script = "devanagari",
}: FillBlankExerciseProps) {
  const selectedOption = options.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-6" data-testid="fill-blank-exercise">
      {/* Sentence Preview Card with Interactive Blank Slot */}
      <div className="p-6 bg-[var(--surface)] border-2 border-[var(--line-strong)] rounded-[18px] text-center shadow-xs">
        <div
          lang="sa"
          className="text-2xl sm:text-3xl font-sanskrit font-semibold text-[var(--ink)] flex flex-wrap items-center justify-center gap-2 leading-relaxed"
        >
          {sentenceBefore && <span>{sentenceBefore}</span>}

          {/* Blank Slot */}
          <span
            data-testid="blank-slot"
            className={`min-w-[70px] px-3 py-1 rounded-[12px] border-2 text-center transition-all duration-[200ms] ${
              status === "correct"
                ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--tulsi)]"
                : status === "incorrect"
                ? "bg-[var(--sindoor-tint)] border-[var(--sindoor)] text-[var(--sindoor)]"
                : selectedOption
                ? "bg-[var(--neel-tint)] border-[var(--neel)] text-[var(--neel-edge)] shadow-xs"
                : "border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-3)]"
            }`}
          >
            {selectedOption ? selectedOption.text : "______"}
          </span>

          {sentenceAfter && <span>{sentenceAfter}</span>}
        </div>

        {selectedOption?.helper && (
          <div className="text-xs text-[var(--ink-3)] mt-2 font-mono">
            {selectedOption.helper}
          </div>
        )}
      </div>

      {/* Choice Options */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-wider">
          Choose the correct word:
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
