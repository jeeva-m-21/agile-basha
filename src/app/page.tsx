"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SanskritText, type SanskritScript } from "@/components/sanskrit/SanskritText";
import { BookOpen, Sparkles, Volume2, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const [activeScript, setActiveScript] = useState<SanskritScript>("devanagari");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const heroExamples: Record<
    SanskritScript,
    { text: string; helper: string; translationEn: string; translationTa: string }
  > = {
    devanagari: {
      text: "रामः वनं गच्छति ।",
      helper: "rāmaḥ vanaṃ gacchati |",
      translationEn: "Rāma goes to the forest.",
      translationTa: "ராமன் காட்டிற்குச் செல்கிறான்.",
    },
    tamil: {
      text: "ராமஃ வநம் க³ச்ச²தி ।",
      helper: "rāmaḥ vanaṃ gacchati |",
      translationEn: "Rāma goes to the forest.",
      translationTa: "ராமன் காட்டிற்குச் செல்கிறான்.",
    },
    iast: {
      text: "rāmaḥ vanaṃ gacchati |",
      helper: "रामः वनं गच्छति ।",
      translationEn: "Rāma goes to the forest.",
      translationTa: "ராமன் காட்டிற்குச் செல்கிறான்.",
    },
  };

  const wordBreakdowns = [
    {
      word: "रामः",
      iast: "rāmaḥ",
      role: "The doer (Subject, Nominative / प्रथमा)",
      roleTa: "செய்பவர் (பெயர் வேற்றுமை)",
    },
    {
      word: "वनम्",
      iast: "vanam",
      role: "Destination (Object, Accusative / द्वितीया)",
      roleTa: "செல்லும் இடம் (இரண்டாம் வேற்றுமை)",
    },
    {
      word: "गच्छति",
      iast: "gacchati",
      role: "Action (Verb: goes, 3rd person singular / प्रथमपुरुषः)",
      roleTa: "வினைச்சொல் (செல்கிறான்)",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* Top Navigation */}
      <header className="w-full border-b border-[var(--line)] bg-[var(--surface)] sticky top-0 z-30 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line-strong)] flex items-center justify-center font-bold text-xl text-[var(--ink)] font-serif">
              हं
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-[var(--ink)]">
                  Haṃsa
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--mayura-tint)] text-[var(--mayura)] font-semibold border border-[var(--mayura)]">
                  ஹம்ஸ
                </span>
              </div>
              <p className="text-xs text-[var(--ink-2)] hidden sm:block">
                Sanskrit Learning Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/onboarding">
              <Button size="sm" variant="primary" className="hidden sm:inline-flex text-sm h-10 min-h-0">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center">
        {/* Promise Statement Hero */}
        <section className="text-center max-w-2xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--line-strong)] text-xs font-semibold text-[var(--ink-2)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[var(--haldi-edge)]" />
            Learn in English or தமிழ்
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--ink)] mb-4 leading-tight">
            Learn to read, understand, and speak Sanskrit step by step.
          </h1>

          <p className="text-lg sm:text-xl text-[var(--ink-2)] leading-relaxed">
            In the language you already think in. Real texts, honest explanations, and no memorization fear.
          </p>
        </section>

        {/* Hero Sanskrit Interactive Showcase */}
        <section className="w-full max-w-xl mb-10">
          <Card variant="flat" className="p-6 sm:p-8 bg-[var(--surface)] shadow-sm">
            {/* Script Selector Tabs */}
            <div className="flex justify-center gap-1.5 p-1 bg-[var(--surface-2)] rounded-[var(--r-control)] border border-[var(--line)] mb-6 text-sm">
              <button
                type="button"
                onClick={() => setActiveScript("devanagari")}
                className={`flex-1 py-1.5 px-3 rounded-[10px] font-semibold transition-all ${
                  activeScript === "devanagari"
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
                aria-pressed={activeScript === "devanagari"}
              >
                Devanāgarī
              </button>
              <button
                type="button"
                onClick={() => setActiveScript("tamil")}
                className={`flex-1 py-1.5 px-3 rounded-[10px] font-semibold transition-all ${
                  activeScript === "tamil"
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
                aria-pressed={activeScript === "tamil"}
              >
                தமிழ் வடிவம்
              </button>
              <button
                type="button"
                onClick={() => setActiveScript("iast")}
                className={`flex-1 py-1.5 px-3 rounded-[10px] font-semibold transition-all ${
                  activeScript === "iast"
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
                aria-pressed={activeScript === "iast"}
              >
                Roman (IAST)
              </button>
            </div>

            {/* The Hero Sanskrit Display */}
            <div className="py-2">
              <SanskritText
                script={activeScript}
                size="hero"
                helperText={heroExamples[activeScript].helper}
              >
                {heroExamples[activeScript].text}
              </SanskritText>

              {/* Translations */}
              <div className="mt-6 pt-4 border-t border-[var(--line)] flex flex-col gap-1 text-center">
                <p className="text-[17px] text-[var(--ink)] font-medium">
                  {heroExamples[activeScript].translationEn}
                </p>
                <p className="text-[15px] text-[var(--ink-2)]" lang="ta">
                  {heroExamples[activeScript].translationTa}
                </p>
              </div>
            </div>

            {/* Tap-to-discover words preview */}
            <div className="mt-6">
              <div className="text-xs uppercase font-bold text-[var(--ink-3)] tracking-wider mb-2 text-center">
                Tap a word to see how it works
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {wordBreakdowns.map((wb) => (
                  <button
                    key={wb.word}
                    type="button"
                    onClick={() =>
                      setSelectedWord(selectedWord === wb.word ? null : wb.word)
                    }
                    className={`px-3 py-1.5 rounded-[12px] text-base font-semibold border-2 transition-all ${
                      selectedWord === wb.word
                        ? "bg-[var(--neel-tint)] border-[var(--neel)] text-[var(--neel-edge)]"
                        : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    {wb.word}
                  </button>
                ))}
              </div>

              {selectedWord && (
                <div className="mt-4 p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line-strong)] text-sm text-center animate-fadeIn">
                  <div className="font-bold text-[var(--ink)]">
                    {wordBreakdowns.find((w) => w.word === selectedWord)?.iast}
                  </div>
                  <div className="text-[var(--ink-2)] mt-0.5">
                    {wordBreakdowns.find((w) => w.word === selectedWord)?.role}
                  </div>
                  <div className="text-[var(--mayura)] text-xs mt-1" lang="ta">
                    {wordBreakdowns.find((w) => w.word === selectedWord)?.roleTa}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Primary Call to Actions */}
        <section className="w-full max-w-sm flex flex-col gap-3.5 mb-14 text-center">
          <Link href="/onboarding" className="w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-lg shadow-sm"
              data-testid="start-learning-cta"
            >
              Start learning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <Link href="/read" className="w-full">
            <Button
              variant="secondary"
              size="lg"
              className="w-full text-lg"
              data-testid="try-reading-cta"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Try reading a verse
            </Button>
          </Link>

          <p className="text-xs text-[var(--ink-3)] mt-1">
            Free to start · No account needed for first lesson
          </p>
        </section>

        {/* Core Pillars / Value Props */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Card variant="flat" className="p-5 flex flex-col">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--mayura-tint)] text-[var(--mayura)] flex items-center justify-center font-bold mb-3 border border-[var(--mayura)]">
              வ
            </div>
            <h3 className="font-bold text-lg text-[var(--ink)] mb-1">
              The Tamil & English Bridge
            </h3>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed">
              Connect Sanskrit cases with Tamil வேற்றுமை (ai, al, ku...) or English prepositions. Learn using concepts you already know.
            </p>
          </Card>

          <Card variant="flat" className="p-5 flex flex-col">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-2)] text-[var(--haldi-edge)] flex items-center justify-center font-bold mb-3 border border-[var(--line-strong)]">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[var(--ink)] mb-1">
              Pure Human Audio
            </h3>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed">
              Real recorded pronunciation with synchronized syllable-by-syllable highlighting. Perfect your visargas, aspirates, and retroflexes.
            </p>
          </Card>

          <Card variant="flat" className="p-5 flex flex-col">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--tulsi-tint)] text-[var(--tulsi)] flex items-center justify-center font-bold mb-3 border border-[var(--tulsi)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[var(--ink)] mb-1">
              Tap-to-Understand Reader
            </h3>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed">
              Read Bhagavad Gītā, Subhāṣitas, and Stotras from day one with automatic sandhi splitting and word-by-word grammar breakdown.
            </p>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--line)] py-8 px-4 text-center bg-[var(--surface)] text-[var(--ink-3)] text-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Haṃsa — Sanskrit Learning Platform</p>
          <div className="flex gap-4 text-xs">
            <span>Human-authored curriculum</span>
            <span>·</span>
            <span>English & தமிழ்</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
