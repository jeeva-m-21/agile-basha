"use client";

import React, { useState } from "react";
import { TokenAnalysis } from "@/lib/reader/dictionary";
import { AudioButton } from "@/components/sanskrit/AudioButton";
import { useAudio } from "@/hooks/useAudio";
import { X, Bookmark, BookmarkCheck, Sparkles, ChevronRight, HelpCircle } from "lucide-react";

export interface WordDetailSheetProps {
  token: TokenAnalysis;
  onClose: () => void;
  script?: "devanagari" | "tamil" | "iast";
  isTamil?: boolean;
}

export function WordDetailSheet({
  token,
  onClose,
  script = "devanagari",
  isTamil = false,
}: WordDetailSheetProps) {
  const audio = useAudio();
  const [isSaved, setIsSaved] = useState(false);
  const [isRuleExpanded, setIsRuleExpanded] = useState(false);

  const displaySanskrit =
    script === "tamil" ? token.tamil : script === "iast" ? token.iast : token.word;

  return (
    <div
      role="dialog"
      aria-label="Word grammar breakdown"
      data-testid="word-detail-sheet"
      className="fixed bottom-0 left-0 right-0 z-30 p-5 sm:p-6 bg-[var(--surface)] border-t-2 border-[var(--line-strong)] rounded-t-[24px] shadow-2xl animate-slideUp max-h-[85vh] overflow-y-auto"
    >
      <div className="max-w-md mx-auto space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                token.ambiguityStatus === "clear"
                  ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--tulsi-ink)]"
                  : token.ambiguityStatus === "ambiguous"
                  ? "bg-[var(--sindoor-tint)] border-[var(--sindoor)] text-[var(--sindoor-ink)]"
                  : "bg-[var(--surface-2)] border-[var(--line)] text-[var(--ink-2)]"
              }`}
            >
              {token.ambiguityStatus === "clear"
                ? "Clear reading"
                : token.ambiguityStatus === "ambiguous"
                ? "Ambiguous reading"
                : "Possible reading"}
            </span>

            {token.isKnown && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--haldi-tint)] text-[var(--ink)] border border-[var(--haldi)]">
                {isTamil ? "நீங்கள் கற்ற சொல்" : "Learned"}
              </span>
            )}
          </div>

          <button
            type="button"
            data-testid="close-detail-sheet-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink)] cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Word Hero & Audio */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
          <div>
            <h2
              lang="sa"
              data-testid="detail-word-sanskrit"
              className="text-3xl font-sanskrit font-bold text-[var(--ink)]"
            >
              {displaySanskrit}
            </h2>
            <div className="text-xs font-mono text-[var(--ink-3)] mt-0.5">
              {token.iast} · base: <span className="font-semibold text-[var(--ink)]">{token.baseForm}</span> ({token.baseIast})
            </div>
          </div>

          <AudioButton
            onPlay={() => audio.playSingle(token.iast, false)}
            isPlaying={audio.isPlaying}
            isSlow={audio.isSlow}
            onToggleSlow={audio.toggleSlow}
          />
        </div>

        {/* 1. Simple Meaning */}
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--mayura)]">
            {isTamil ? "பொருள் (Meaning)" : "Meaning"}
          </div>
          <p
            data-testid="detail-meaning"
            className="text-base font-bold text-[var(--ink)] leading-snug"
          >
            {isTamil ? token.meaningTa : token.meaningEn}
          </p>
        </div>

        {/* 2. Grammatical Form */}
        <div className="p-3.5 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line)] space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-3)]">
            {isTamil ? "இலக்கண பகுப்பாய்வு" : "Grammatical Analysis"}
          </div>
          <p
            data-testid="detail-grammar"
            className="text-xs font-medium text-[var(--ink)] leading-relaxed"
          >
            {isTamil ? token.grammarTa : token.grammarEn}
          </p>
        </div>

        {/* 3. Sanskrit Rule (Progressive Disclosure) */}
        {token.ruleEn && (
          <div className="border border-[var(--line)] rounded-[14px] p-3 space-y-1.5 bg-[var(--surface)]">
            <button
              type="button"
              onClick={() => setIsRuleExpanded(!isRuleExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-[var(--ink-2)] hover:text-[var(--ink)] cursor-pointer"
            >
              <span>{isTamil ? "இலக்கண விதி (Sanskrit Rule)" : "Sanskrit Rule"}</span>
              <span className="text-[11px] text-[var(--neel)] font-semibold">
                {isRuleExpanded ? "Hide" : "Show full rule"}
              </span>
            </button>

            {isRuleExpanded && (
              <p
                data-testid="detail-rule"
                className="text-xs text-[var(--ink-2)] leading-relaxed pt-1 animate-fadeIn border-t border-[var(--line)]"
              >
                {isTamil ? token.ruleTa : token.ruleEn}
              </p>
            )}
          </div>
        )}

        {/* Actions: Save Word & Ask Tutor */}
        <div className="pt-2 flex items-center gap-2.5">
          <button
            type="button"
            data-testid="save-word-btn"
            onClick={() => setIsSaved(!isSaved)}
            className={`flex-1 h-12 rounded-[14px] font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
              isSaved
                ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--tulsi-ink)]"
                : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--neel)]"
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-[var(--tulsi)]" />
                <span>{isTamil ? "சேமிக்கப்பட்டது!" : "Saved to Vocabulary"}</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>{isTamil ? "சொல்லை சேமி" : "Save Word"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
