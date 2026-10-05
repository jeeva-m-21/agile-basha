"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SanskritInput } from "@/components/reader/SanskritInput";
import { TokenChip } from "@/components/reader/TokenChip";
import { WordDetailSheet } from "@/components/reader/WordDetailSheet";
import { analyzeSentence, SentenceAnalysisResult, TokenAnalysis } from "@/lib/reader/dictionary";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { BookOpen, Sparkles, BookMarked, Check } from "lucide-react";

export default function ReadPage() {
  const preferences = usePreferencesStore();
  const { language } = useTranslation();
  const isTamil = language === "ta";

  const [analysis, setAnalysis] = useState<SentenceAnalysisResult>(() =>
    analyzeSentence("रामः वनं गच्छति")
  );
  const [selectedToken, setSelectedToken] = useState<TokenAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reader/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data?.analysis) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis(analyzeSentence(text));
      }
    } catch {
      // Local fallback
      setAnalysis(analyzeSentence(text));
    } finally {
      setIsLoading(false);
      setSelectedToken(null);
    }
  };

  const displayText =
    preferences.script === "tamil"
      ? analysis.transliterationTamil
      : preferences.script === "iast"
      ? analysis.transliterationIast
      : analysis.transliterationDevanagari;

  return (
    <main className="max-w-md w-full mx-auto px-4 py-5 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">
          {isTamil ? "வாசிப்பு (Reader)" : "Reader"}
        </h1>
        <p className="text-xs text-[var(--ink-2)] mt-0.5">
          {isTamil
            ? "சொல்-சொல்லாகப் பொருளுணரும் இடைமுகம் (Tap to understand)"
            : "Tap-to-understand Sanskrit with word-by-word grammar breakdown"}
        </p>
      </div>

      {/* 1. Sanskrit Input with script detection & typing helper */}
      <Card variant="flat" className="p-4 bg-[var(--surface)] border-2 border-[var(--line-strong)]">
        <SanskritInput
          initialValue="रामः वनं गच्छति"
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          isTamil={isTamil}
        />
      </Card>

      {/* 2. Reader Analysis Display */}
      {analysis && (
        <div className="space-y-4 animate-fadeIn" data-testid="reader-analysis-container">
          {/* Main Verse / Sentence Card */}
          <Card
            variant="flat"
            className="p-5 border-2 border-[var(--line-strong)] bg-[var(--surface)] shadow-xs space-y-3"
          >
            <div
              lang="sa"
              data-testid="reader-sanskrit-display"
              className="text-2xl sm:text-3xl font-sanskrit font-bold text-[var(--ink)] leading-relaxed"
            >
              {displayText}
            </div>

            {/* Helper Transliteration */}
            {preferences.helperLine !== "off" && preferences.script !== "iast" && (
              <div className="text-xs font-mono text-[var(--ink-3)]">
                {analysis.transliterationIast}
              </div>
            )}

            {/* Translation & AI Label per SPEC §10.1 */}
            <div className="pt-2 border-t border-[var(--line)] space-y-1.5">
              <p className="text-sm font-medium text-[var(--ink-2)] italic leading-relaxed">
                &ldquo;{isTamil ? analysis.translationTa : analysis.translationEn}&rdquo;
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)]">
                  AI-assisted translation
                </span>
              </div>
            </div>
          </Card>

          {/* 3. Word Token Chips with Knowledge Counter */}
          <Card
            variant="flat"
            className="p-4 bg-[var(--surface)] border-2 border-[var(--line-strong)] space-y-3"
            data-testid="token-chips-card"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-wider">
                {isTamil ? "சொல் வாரியாக (Tap a word):" : "Word by Word (Tap a word):"}
              </div>
              <div
                data-testid="words-known-counter"
                className="text-xs font-semibold text-[var(--tulsi)] flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>
                  {isTamil
                    ? `${analysis.totalWords}-ல் ${analysis.knownWords} சொற்கள் தெரியும்`
                    : `You know ${analysis.knownWords} of ${analysis.totalWords} words`}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1" data-testid="token-chips-list">
              {analysis.tokens.map((token) => (
                <TokenChip
                  key={token.id}
                  token={token}
                  script={preferences.script}
                  isSelected={selectedToken?.id === token.id}
                  showHelper={preferences.helperLine !== "off"}
                  onClick={() => setSelectedToken(token)}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 4. Progressive Disclosure Word Detail Sheet */}
      {selectedToken && (
        <WordDetailSheet
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
          script={preferences.script}
          isTamil={isTamil}
        />
      )}
    </main>
  );
}
