"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { detectScript, transliterate, ScriptType } from "@/lib/reader/transliterate";
import { Sparkles, ArrowRight, Languages } from "lucide-react";

export interface SanskritInputProps {
  initialValue?: string;
  onAnalyze: (text: string) => void;
  isLoading?: boolean;
  isTamil?: boolean;
}

export function SanskritInput({
  initialValue = "",
  onAnalyze,
  isLoading = false,
  isTamil = false,
}: SanskritInputProps) {
  const [text, setText] = useState(initialValue);
  const detected = detectScript(text);

  // Live transliteration helper preview
  const livePreview = React.useMemo(() => {
    if (!text.trim()) return "";
    if (detected === "devanagari") {
      return transliterate(text, "iast");
    }
    return transliterate(text, "devanagari");
  }, [text, detected]);

  const sampleTexts = [
    { label: "Rāma Sentence", text: "रामः वनं गच्छति" },
    { label: "Subhāṣita", text: "विद्या ददाति विनयम्" },
    { label: "Gītā 1.1", text: "धर्मक्षेत्रे कुरुक्षेत्रे" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-testid="sanskrit-input-form">
      <div>
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <label htmlFor="sanskrit-input" className="text-xs font-bold text-[var(--ink-2)]">
            {isTamil ? "சமஸ்கிருத வாசகத்தை உள்ளிடுக அல்லது ஒட்டுக:" : "Paste or type Sanskrit:"}
          </label>
          <span
            data-testid="script-detected-badge"
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)]"
          >
            {detected}
          </span>
        </div>

        <div className="relative">
          <textarea
            id="sanskrit-input"
            data-testid="sanskrit-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder={
              isTamil
                ? "எ.கா: ராம: வநம் கச்சதி அல்லது rāmaḥ vanaṃ gacchati..."
                : "e.g. rāmaḥ vanaṃ gacchati or रामः वनं गच्छति..."
            }
            className="w-full p-3.5 rounded-[14px] border-2 border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-3)] font-sanskrit text-lg focus:outline-none focus:border-[var(--neel)] transition-all resize-none shadow-xs"
          />
        </div>

        {/* Live Typing Helper Preview per DESIGN.md §6.14 */}
        {livePreview && (
          <div
            data-testid="typing-helper-preview"
            className="flex items-center gap-1.5 text-xs text-[var(--ink-3)] px-1 mt-1 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--mayura)]" />
            <span>Preview:</span>
            <span className="font-semibold text-[var(--ink-2)]">{livePreview}</span>
          </div>
        )}
      </div>

      {/* Sample Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] font-semibold text-[var(--ink-3)] mr-1">
          {isTamil ? "மாதிரிகள்:" : "Samples:"}
        </span>
        {sampleTexts.map((sample) => (
          <button
            key={sample.label}
            type="button"
            data-testid={`sample-${sample.label.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => {
              setText(sample.text);
              onAnalyze(sample.text);
            }}
            className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-2)] hover:bg-[var(--haldi-tint)] text-[var(--ink)] border border-[var(--line)] font-medium cursor-pointer transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Analyze Button (Haldi Primary) */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading || !text.trim()}
        className="w-full text-base font-bold shadow-xs mt-1"
        data-testid="analyze-btn"
      >
        <span>{isLoading ? (isTamil ? "ஆராய்கிறது..." : "Analyzing...") : (isTamil ? "ஆராய்க (Analyze)" : "Analyze Sentence")}</span>
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>
    </form>
  );
}
