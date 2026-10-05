"use client";

import React from "react";
import { type SyllableTiming } from "@/lib/audio/phonetics";
import { cn } from "@/lib/utils";

export interface SyllableHighlightProps {
  syllables: SyllableTiming[];
  activeIndex: number | null;
  script?: "devanagari" | "tamil" | "iast";
  showHelper?: boolean;
  className?: string;
  onSyllableClick?: (index: number) => void;
}

export function SyllableHighlight({
  syllables,
  activeIndex,
  script = "devanagari",
  showHelper = true,
  className,
  onSyllableClick,
}: SyllableHighlightProps) {
  const langTag =
    script === "devanagari"
      ? "sa-Deva"
      : script === "tamil"
      ? "sa-Taml"
      : "sa-Latn";

  return (
    <div
      className={cn("flex flex-col items-center justify-center text-center", className)}
      data-testid="syllable-highlight-container"
    >
      {/* Primary Sanskrit Syllables */}
      <div
        lang={langTag}
        className="flex items-center justify-center flex-wrap gap-2 text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.5]"
      >
        {syllables.map((s, idx) => {
          const isActive = activeIndex === idx;
          const displayChar =
            script === "tamil" ? s.tamil || s.text : script === "iast" ? s.iast : s.text;

          return (
            <span
              key={idx}
              onClick={() => onSyllableClick?.(idx)}
              className={cn(
                "px-2.5 py-1 rounded-[12px] transition-all duration-[140ms] cursor-pointer select-text",
                isActive
                  ? "bg-[var(--neel-tint)] text-[var(--neel-edge)] shadow-xs scale-105 ring-2 ring-[var(--neel)]"
                  : "text-[var(--ink)] hover:bg-[var(--surface-2)]"
              )}
              data-testid={`syllable-${idx}`}
              data-active={isActive ? "true" : "false"}
            >
              {displayChar}
            </span>
          );
        })}
      </div>

      {/* Helper Line Transliteration Mirroring Highlight */}
      {showHelper && (
        <div
          lang="sa-Latn"
          className="flex items-center justify-center flex-wrap gap-2 mt-2 text-base font-normal text-[var(--ink-2)]"
        >
          {syllables.map((s, idx) => {
            const isActive = activeIndex === idx;

            return (
              <span
                key={idx}
                className={cn(
                  "px-2 py-0.5 rounded-[8px] transition-all duration-[140ms]",
                  isActive && "bg-[var(--surface-2)] text-[var(--ink)] font-semibold"
                )}
                data-testid={`syllable-helper-${idx}`}
              >
                {s.iast}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
