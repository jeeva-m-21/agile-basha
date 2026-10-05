"use client";

import React from "react";
import { TokenAnalysis } from "@/lib/reader/dictionary";

export interface TokenChipProps {
  token: TokenAnalysis;
  script?: "devanagari" | "tamil" | "iast";
  isSelected?: boolean;
  showHelper?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TokenChip({
  token,
  script = "devanagari",
  isSelected = false,
  showHelper = true,
  onClick,
  className = "",
}: TokenChipProps) {
  const displayText =
    script === "tamil" ? token.tamil : script === "iast" ? token.iast : token.word;

  return (
    <button
      type="button"
      data-testid={`token-chip-${token.index}`}
      aria-label={`Sanskrit word: ${token.word} (${token.iast}), meaning: ${token.meaningEn}`}
      aria-pressed={isSelected}
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center px-3.5 py-1.5 rounded-full border-2 transition-all duration-[140ms] cursor-pointer select-none text-left ${
        isSelected
          ? "bg-[var(--neel-tint)] border-[var(--neel)] text-[var(--neel-edge)] shadow-xs -translate-y-[2px]"
          : token.isKnown
          ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--tulsi-ink)] hover:brightness-95"
          : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--neel)] shadow-xs"
      } ${className}`}
    >
      <span lang="sa" className="font-sanskrit font-bold text-lg leading-tight">
        {displayText}
      </span>
      {showHelper && (
        <span className="text-[10px] font-mono font-medium text-[var(--ink-3)] -mt-0.5">
          {token.iast}
        </span>
      )}
    </button>
  );
}
