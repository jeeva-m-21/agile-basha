import React from "react";

export interface LessonProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
}

export function LessonProgressBar({
  currentStep,
  totalSteps,
  onClose,
}: LessonProgressBarProps) {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="w-full flex items-center gap-3 py-2 px-1">
      <button
        type="button"
        onClick={onClose}
        className="p-2 -ml-2 rounded-full text-[var(--ink-2)] hover:bg-[var(--surface-2)] transition-colors"
        aria-label="Exit lesson"
        data-testid="lesson-exit-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Pill-shaped progress bar per DESIGN.md §6.4 */}
      <div
        className="flex-1 h-3.5 bg-[var(--line)] rounded-full overflow-hidden relative shadow-inner"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        data-testid="lesson-progress-bar"
      >
        <div
          className="h-full bg-[var(--tulsi)] rounded-full transition-all duration-[360ms] ease-[var(--ease-standard)] relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle top highlight strip for depth */}
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
