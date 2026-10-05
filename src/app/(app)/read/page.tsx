"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SanskritInput } from "@/components/reader/SanskritInput";
import { TokenChip } from "@/components/reader/TokenChip";
import { WordDetailSheet } from "@/components/reader/WordDetailSheet";
import { TextLibrary } from "@/components/reader/TextLibrary";
import { analyzeSentence, SentenceAnalysisResult, TokenAnalysis } from "@/lib/reader/dictionary";
import { CuratedText } from "@/lib/reader/texts";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { BookOpen, Sparkles, BookMarked, Check, PenTool } from "lucide-react";

export default function ReadPage() {
  const preferences = usePreferencesStore();
  const { language } = useTranslation();
  const isTamil = language === "ta";

  const [activeTab, setActiveTab] = useState<"custom" | "library">("custom");
  const [inputText, setInputText] = useState("रामः वनं गच्छति");
  const [analysis, setAnalysis] = useState<SentenceAnalysisResult>(() =>
    analyzeSentence("रामः वनं गच्छति")
  );
  const [selectedToken, setSelectedToken] = useState<TokenAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTranslator, setCurrentTranslator] = useState<string | null>("Human Reviewed");
  const [isAiTranslated, setIsAiTranslated] = useState(false);

  const handleAnalyze = async (text: string, curatedMeta?: { translator?: string; isAi?: boolean }) => {
    setIsLoading(true);
    setInputText(text);
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
      if (curatedMeta) {
        setCurrentTranslator(curatedMeta.translator || null);
        setIsAiTranslated(curatedMeta.isAi ?? false);
      } else {
        setCurrentTranslator(null);
        setIsAiTranslated(true);
      }
    }
  };

  const handleSelectCuratedText = (item: CuratedText) => {
    setInputText(item.sanskrit);
    setActiveTab("custom");
    handleAnalyze(item.sanskrit, {
      translator: item.translator,
      isAi: item.isAiTranslated,
    });
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

      {/* Mode Switcher: Custom Input vs Library */}
      <div className="flex border-b border-[var(--line)] gap-4">
        <button
          onClick={() => setActiveTab("custom")}
          className={`flex items-center gap-1.5 pb-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "custom"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]"
          }`}
          data-testid="tab-custom-input"
        >
          <PenTool className="w-4 h-4" />
          <span>{isTamil ? "சொந்த வாசகம்" : "Custom Text"}</span>
        </button>

        <button
          onClick={() => setActiveTab("library")}
          className={`flex items-center gap-1.5 pb-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "library"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]"
          }`}
          data-testid="tab-curated-library"
        >
          <BookMarked className="w-4 h-4" />
          <span>{isTamil ? "செவ்வியல் நூலகம்" : "Curated Library"}</span>
        </button>
      </div>

      {/* Tab 1: Curated Library View */}
      {activeTab === "library" && (
        <TextLibrary onSelectText={handleSelectCuratedText} isTamil={isTamil} />
      )}

      {/* Tab 2: Custom Sanskrit Input */}
      {activeTab === "custom" && (
        <Card variant="flat" className="p-4 bg-[var(--surface)] border-2 border-[var(--line-strong)]">
          <SanskritInput
            initialValue={inputText}
            onAnalyze={(text) => handleAnalyze(text)}
            isLoading={isLoading}
            isTamil={isTamil}
          />
        </Card>
      )}

      {/* Reader Analysis Display */}
      {activeTab === "custom" && analysis && (
        <div className="space-y-4 animate-fadeIn" data-testid="reader-analysis-container">
          {/* Main Verse / Sentence Card */}
          <Card
            variant="flat"
            className="p-5 border-2 border-[var(--line-strong)] bg-[var(--surface)] shadow-xs space-y-3"
          >
            <div
              lang="sa"
              data-testid="reader-sanskrit-display"
              className="text-2xl sm:text-3xl font-sanskrit font-bold text-[var(--ink)] leading-relaxed whitespace-pre-line"
            >
              {displayText}
            </div>

            {/* Helper Transliteration */}
            {preferences.helperLine !== "off" && preferences.script !== "iast" && (
              <div className="text-xs font-mono text-[var(--ink-3)] whitespace-pre-line">
                {analysis.transliterationIast}
              </div>
            )}

            {/* Translation & Attribution Label per SPEC §10.1 */}
            <div className="pt-2 border-t border-[var(--line)] space-y-1.5">
              <p className="text-sm font-medium text-[var(--ink-2)] italic leading-relaxed">
                &ldquo;{isTamil ? analysis.translationTa : analysis.translationEn}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                {isAiTranslated || (!currentTranslator && analysis.isAiAssisted) ? (
                  <span
                    data-testid="ai-translation-badge"
                    className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[var(--primary)]" />
                    AI-assisted translation
                  </span>
                ) : (
                  <span
                    data-testid="human-translation-badge"
                    className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--tulsi)] border border-[var(--line)] flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    {currentTranslator || "Curated translation"}
                  </span>
                )}
              </div>
            </div>
          </Card>

          {/* Word Token Chips with Knowledge Counter */}
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

      {/* Progressive Disclosure Word Detail Sheet */}
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
