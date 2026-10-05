"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AudioButton } from "@/components/sanskrit/AudioButton";
import { GrammarDetailModal } from "@/components/dictionary/GrammarDetailModal";
import { searchDictionary, analyzeWordForm, FormAnalysisDetail } from "@/lib/dictionary/analyzer";
import { DictionaryEntry, DICTIONARY_ENTRIES } from "@/lib/dictionary/data";
import { SEEDED_GRAMMAR_RULES, GrammarRuleItem, getGrammarRuleBySlug } from "@/lib/dictionary/grammar-rules";
import { useTranslation } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { Search, Book, Sparkles, BookOpen, ExternalLink, ArrowRight, X } from "lucide-react";

export default function DictionaryPage() {
  const { language } = useTranslation();
  const preferences = usePreferencesStore();
  const isTamil = language === "ta";

  const [activeTab, setActiveTab] = useState<"dictionary" | "form">("dictionary");
  const [query, setQuery] = useState("शिव");
  const [formInput, setFormInput] = useState("गच्छति");
  const [dictResults, setDictResults] = useState<DictionaryEntry[]>(() => searchDictionary("शिव"));
  const [formResult, setFormResult] = useState<FormAnalysisDetail | null>(() => analyzeWordForm("गच्छति"));
  const [selectedGrammarRule, setSelectedGrammarRule] = useState<GrammarRuleItem | null>(null);

  // Search dictionary when query changes
  useEffect(() => {
    if (query.trim()) {
      setDictResults(searchDictionary(query));
    } else {
      setDictResults(DICTIONARY_ENTRIES);
    }
  }, [query]);

  // Analyze word form when form input changes
  useEffect(() => {
    if (formInput.trim()) {
      setFormResult(analyzeWordForm(formInput));
    } else {
      setFormResult(null);
    }
  }, [formInput]);

  const quickExamples = ["शिव", "shiva", "சிவ", "गच्छति", "रामेण", "विद्या"];

  return (
    <main className="max-w-md w-full mx-auto px-4 py-5 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">
          {isTamil ? "அகராதி & இலக்கணம்" : "Dictionary & Grammar"}
        </h1>
        <p className="text-xs text-[var(--ink-2)] mt-0.5">
          {isTamil
            ? "எந்த எழுத்து வடிவிலும் தேடலாம் (தேவநாகரி, தமிழ், ஆங்கிலம்)"
            : "Search in any script: Devanāgarī, Tamil, IAST, or English meaning"}
        </p>
      </div>

      {/* Two Clearly Separated Tabs per SPEC §11.1 */}
      <div className="flex border-b border-[var(--line)] gap-4" data-testid="dictionary-tabs">
        <button
          onClick={() => setActiveTab("dictionary")}
          className={`flex items-center gap-1.5 pb-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "dictionary"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]"
          }`}
          data-testid="tab-dictionary"
        >
          <Book className="w-4 h-4" />
          <span>{isTamil ? "அகராதி (பொருள்)" : "Dictionary (Meanings)"}</span>
        </button>

        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center gap-1.5 pb-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "form"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]"
          }`}
          data-testid="tab-form-analysis"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isTamil ? "வடிவ ஆய்வு (இலக்கணம்)" : "Form Analysis"}</span>
        </button>
      </div>

      {/* Tab 1: Dictionary Search & Results */}
      {activeTab === "dictionary" && (
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-3)]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isTamil ? "தேடுக: shiva, சிவ, சிவபெருமான், வனம்..." : "Search: shiva, rāma, forest, gam..."}
              className="w-full pl-10 pr-9 py-2.5 rounded-[14px] bg-[var(--surface)] border-2 border-[var(--line-strong)] text-sm font-medium text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] transition-all"
              data-testid="dictionary-search-input"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-[var(--ink-3)] uppercase tracking-wider shrink-0">
              {isTamil ? "உதாரணம்:" : "Try:"}
            </span>
            {quickExamples.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--primary)] border border-[var(--line)] whitespace-nowrap"
                data-testid={`quick-chip-${ex}`}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Search Results List */}
          <div className="space-y-3" data-testid="dictionary-results-list">
            {dictResults.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--ink-3)]">
                {isTamil ? "சொற்கள் எதுவும் காணப்படவில்லை" : "No dictionary entries found"}
              </div>
            ) : (
              dictResults.map((entry) => (
                <Card
                  key={entry.id}
                  variant="flat"
                  className="p-4 border-2 border-[var(--line-strong)] bg-[var(--surface)] space-y-3"
                  data-testid={`dict-card-${entry.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span
                          lang="sa"
                          className="text-2xl font-sanskrit font-bold text-[var(--ink)]"
                          data-testid={`headword-${entry.id}`}
                        >
                          {entry.headword}
                        </span>
                        <span className="text-xs font-mono text-[var(--ink-3)]">
                          {entry.iast}
                        </span>
                        <span className="text-xs text-[var(--ink-3)]">
                          • {entry.tamil}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)]">
                          {entry.partOfSpeech}
                        </span>
                        {entry.gender && (
                          <span className="text-[10px] text-[var(--ink-3)] capitalize">
                            {entry.gender}
                          </span>
                        )}
                        {entry.stemEnding && (
                          <span className="text-[10px] text-[var(--ink-3)] font-mono">
                            stem: {entry.stemEnding}
                          </span>
                        )}
                      </div>
                    </div>

                    <AudioButton text={entry.headword} size="sm" showSlowToggle={false} />
                  </div>

                  {/* Meanings */}
                  <div className="pt-2 border-t border-[var(--line)] space-y-1">
                    <div className="text-sm font-semibold text-[var(--ink)]">
                      {isTamil ? entry.meaningsTa.join("; ") : entry.meaningsEn.join("; ")}
                    </div>
                    {/* Secondary language meaning */}
                    <div className="text-xs text-[var(--ink-2)] italic">
                      {isTamil ? entry.meaningsEn.join("; ") : entry.meaningsTa.join("; ")}
                    </div>
                  </div>

                  {/* Root / Etymology if present */}
                  {entry.root && (
                    <div className="p-2.5 rounded-[10px] bg-[var(--surface-2)] text-xs text-[var(--ink-2)] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--ink)]">
                          {isTamil ? "தாது / வேர்ச்சொல்: " : "Root: "}
                        </span>
                        <span lang="sa" className="font-sanskrit font-bold">
                          √{entry.root.rootDeva} ({entry.root.rootIast})
                        </span>
                        <span> — {entry.root.rootMeaning}</span>
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  {entry.examples && entry.examples.length > 0 && (
                    <div className="text-xs space-y-1 bg-[var(--surface-2)] p-2.5 rounded-[10px]">
                      <div lang="sa" className="font-sanskrit font-bold text-[var(--ink)]">
                        {entry.examples[0].sanskrit}
                      </div>
                      <div className="text-[var(--ink-2)] italic">
                        &ldquo;{isTamil ? entry.examples[0].translationTa : entry.examples[0].translationEn}&rdquo;
                      </div>
                    </div>
                  )}

                  {/* Footer: Dictionary Source & Link back to Lesson */}
                  <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--ink-3)]">
                    <span>{entry.source}</span>
                    {entry.relatedLessonId && (
                      <a
                        href={`/${entry.relatedLessonId.replace("-", "/")}`}
                        className="font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                        data-testid={`link-lesson-${entry.id}`}
                      >
                        <span>{entry.relatedLessonTitle || "Go to Lesson"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Form Analysis (வடிவ ஆய்வு) */}
      {activeTab === "form" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-wider">
              {isTamil ? "ஆய்வு செய்ய வேண்டிய சொல் வடிவம்:" : "Enter Sanskrit Word Form to Analyze:"}
            </label>
            <input
              type="text"
              value={formInput}
              onChange={(e) => setFormInput(e.target.value)}
              placeholder="e.g. gacchati, गच्छति, rāmeṇa, रामेण, vanam..."
              className="w-full px-3.5 py-2.5 rounded-[14px] bg-[var(--surface)] border-2 border-[var(--line-strong)] text-base font-sanskrit text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] transition-all"
              data-testid="form-analysis-input"
            />
          </div>

          {/* Quick Form Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {["गच्छति", "रामेण", "वनम्", "शिवः", "विद्या"].map((wf) => (
              <button
                key={wf}
                onClick={() => setFormInput(wf)}
                className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--primary)] border border-[var(--line)] whitespace-nowrap font-sanskrit"
              >
                {wf}
              </button>
            ))}
          </div>

          {/* Form Analysis Result Card */}
          {formResult && (
            <Card
              variant="flat"
              className="p-5 border-2 border-[var(--line-strong)] bg-[var(--surface)] space-y-4 animate-fadeIn"
              data-testid="form-analysis-result-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div lang="sa" className="text-3xl font-sanskrit font-bold text-[var(--ink)]">
                    {formResult.surfaceWord}
                  </div>
                  <div className="text-xs font-mono text-[var(--ink-3)]">
                    {formResult.surfaceIast} • {formResult.surfaceTamil}
                  </div>
                </div>
                <AudioButton text={formResult.surfaceWord} size="sm" showSlowToggle={false} />
              </div>

              {/* Grammar breakdown pills */}
              <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] space-y-2">
                <div className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-wider">
                  {isTamil ? "இலக்கணப் பகுப்பாய்வு (Grammar):" : "Grammar Breakdown:"}
                </div>
                <div className="text-sm font-bold text-[var(--ink)]">
                  {isTamil ? formResult.grammarTa : formResult.grammarEn}
                </div>
                <div className="text-xs text-[var(--ink-2)] italic">
                  {isTamil ? formResult.grammarEn : formResult.grammarTa}
                </div>
              </div>

              {/* Base Stem / Lemma */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-[10px] bg-[var(--surface-2)]">
                  <span className="text-[var(--ink-3)] block font-medium">
                    {isTamil ? "அடிப்படை வடிவம் (Lemma):" : "Base Lemma / Root:"}
                  </span>
                  <span lang="sa" className="text-base font-sanskrit font-bold text-[var(--ink)]">
                    {formResult.baseLemma}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--ink-3)] block">
                    {formResult.baseIast}
                  </span>
                </div>

                <div className="p-3 rounded-[10px] bg-[var(--surface-2)]">
                  <span className="text-[var(--ink-3)] block font-medium">
                    {isTamil ? "சொல் வகை (POS):" : "Word Class:"}
                  </span>
                  <span className="text-sm font-bold text-[var(--ink)] uppercase">
                    {formResult.partOfSpeech}
                  </span>
                  <span className="text-[11px] text-[var(--ink-3)] block">
                    {formResult.meaningEn}
                  </span>
                </div>
              </div>

              {/* Link to Grammar Rule Reference */}
              {formResult.grammarRule && (
                <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedGrammarRule(formResult.grammarRule!)}
                    className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1.5"
                    data-testid="view-grammar-rule-btn"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {isTamil
                        ? `இலக்கண விதியைக் காண்க: ${formResult.grammarRule.titleTa}`
                        : `View Rule: ${formResult.grammarRule.titleEn}`}
                    </span>
                  </button>
                </div>
              )}

              {/* Link to Lesson */}
              {formResult.relatedLessonId && (
                <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
                  <span className="text-[var(--ink-3)]">
                    {isTamil ? "கற்பிக்கப்பட்ட பாடம்:" : "Taught in:"}
                  </span>
                  <a
                    href={`/${formResult.relatedLessonId.replace("-", "/")}`}
                    className="font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                    data-testid="form-lesson-link"
                  >
                    <span>{formResult.relatedLessonTitle || "Open Lesson"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Grammar Reference Section */}
      <div className="space-y-3 pt-3 border-t border-[var(--line)]">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
            {isTamil ? "இலக்கணக் குறிப்புகள் (Grammar Reference)" : "Grammar Reference"}
          </div>
          <span className="text-[11px] text-[var(--ink-3)]">
            {SEEDED_GRAMMAR_RULES.length} {isTamil ? "விதிகள்" : "rules"}
          </span>
        </div>

        <div className="space-y-2" data-testid="grammar-reference-list">
          {SEEDED_GRAMMAR_RULES.map((rule) => (
            <Card
              key={rule.id}
              variant="interactive"
              className="p-3.5 flex items-center justify-between"
              onClick={() => setSelectedGrammarRule(rule)}
              data-testid={`grammar-rule-card-${rule.slug}`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)]">
                    {rule.category.toUpperCase()}
                  </span>
                  <span lang="sa" className="text-xs font-sanskrit font-bold text-[var(--ink)]">
                    {rule.sanskritTerm}
                  </span>
                </div>
                <div className="text-sm font-bold text-[var(--ink)]">
                  {isTamil ? rule.titleTa : rule.titleEn}
                </div>
              </div>

              <div className="text-[var(--ink-3)]">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal for viewing grammar rule */}
      {selectedGrammarRule && (
        <GrammarDetailModal
          rule={selectedGrammarRule}
          onClose={() => setSelectedGrammarRule(null)}
          isTamil={isTamil}
        />
      )}
    </main>
  );
}
