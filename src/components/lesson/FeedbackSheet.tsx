import React from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface FeedbackSheetProps {
  isCorrect: boolean;
  explanation: string;
  onContinue: () => void;
  continueText?: string;
}

export function FeedbackSheet({
  isCorrect,
  explanation,
  onContinue,
  continueText,
}: FeedbackSheetProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-0 left-0 right-0 z-30 p-5 sm:p-6 rounded-t-[24px] border-t-2 shadow-lg transition-transform animate-slideUp ${
        isCorrect
          ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--tulsi-ink)]"
          : "bg-[var(--sindoor-tint)] border-[var(--sindoor)] text-[var(--sindoor-ink)]"
      }`}
      data-testid="feedback-sheet"
    >
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              isCorrect ? "bg-[var(--tulsi)] text-white" : "bg-[var(--sindoor)] text-white"
            }`}
          >
            {isCorrect ? (
              <Check className="w-5 h-5 stroke-[3]" />
            ) : (
              <X className="w-5 h-5 stroke-[3]" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight">
              {isCorrect ? "Correct!" : "Not yet"}
            </h3>
            <p className="text-sm font-medium mt-1 leading-relaxed text-[var(--ink)]">
              {explanation}
            </p>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={onContinue}
            className={`w-full h-14 rounded-[14px] font-bold text-lg text-white flex items-center justify-center gap-2 border-b-[4px] active:translate-y-[3px] active:border-b-[1px] transition-all shadow-sm ${
              isCorrect
                ? "bg-[var(--tulsi)] border-[var(--tulsi-ink)] hover:brightness-105"
                : "bg-[var(--sindoor)] border-[var(--sindoor-ink)] hover:brightness-105"
            }`}
            data-testid="feedback-continue-btn"
          >
            <span>{continueText || (isCorrect ? "Continue" : "Got it")}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
