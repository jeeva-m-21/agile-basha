"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export interface MatchPair {
  leftId: string;
  leftText: string;
  leftHelper?: string;
  rightId: string;
  rightText: string;
  rightHelper?: string;
}

export interface MatchExerciseProps {
  pairs: MatchPair[];
  onMatchesChange: (matched: Array<{ leftId: string; rightId: string }>) => void;
  disabled?: boolean;
}

export function MatchExercise({
  pairs,
  onMatchesChange,
  disabled = false,
}: MatchExerciseProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Array<{ leftId: string; rightId: string }>>([]);
  const [mismatched, setMismatched] = useState<{ leftId: string; rightId: string } | null>(null);

  // Derive left and right item lists (right list can be shuffled)
  const leftItems = React.useMemo(() => pairs.map((p) => ({
    id: p.leftId,
    text: p.leftText,
    helper: p.leftHelper,
  })), [pairs]);

  // Shuffled right items (deterministic pseudo-shuffle or reversed to avoid 1:1 row alignment)
  const rightItems = React.useMemo(() => {
    return [...pairs]
      .map((p) => ({
        id: p.rightId,
        text: p.rightText,
        helper: p.rightHelper,
        matchTargetLeftId: p.leftId,
      }))
      .reverse();
  }, [pairs]);

  const handleSelectLeft = (leftId: string) => {
    if (disabled || matchedPairs.some((m) => m.leftId === leftId)) return;
    if (mismatched) return;

    if (selectedLeft === leftId) {
      setSelectedLeft(null);
      return;
    }

    setSelectedLeft(leftId);

    if (selectedRight) {
      checkPair(leftId, selectedRight);
    }
  };

  const handleSelectRight = (rightId: string) => {
    if (disabled || matchedPairs.some((m) => m.rightId === rightId)) return;
    if (mismatched) return;

    if (selectedRight === rightId) {
      setSelectedRight(null);
      return;
    }

    setSelectedRight(rightId);

    if (selectedLeft) {
      checkPair(selectedLeft, rightId);
    }
  };

  const checkPair = (leftId: string, rightId: string) => {
    const isMatch = pairs.some((p) => p.leftId === leftId && p.rightId === rightId);

    if (isMatch) {
      const nextMatched = [...matchedPairs, { leftId, rightId }];
      setMatchedPairs(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      onMatchesChange(nextMatched);
    } else {
      setMismatched({ leftId, rightId });
      setTimeout(() => {
        setMismatched(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <div className="space-y-4" data-testid="match-exercise">
      {/* Progress pill */}
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink-2)] px-1">
        <span>Tap matching pairs</span>
        <span
          data-testid="match-progress"
          className="px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)]"
        >
          {matchedPairs.length} / {pairs.length} matched
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Left Column (e.g. Sanskrit letters/words) */}
        <div className="space-y-2.5">
          {leftItems.map((item) => {
            const isMatched = matchedPairs.some((m) => m.leftId === item.id);
            const isSelected = selectedLeft === item.id;
            const isFailed = mismatched?.leftId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                data-testid={`match-left-${item.id}`}
                disabled={disabled || isMatched}
                onClick={() => handleSelectLeft(item.id)}
                className={`w-full min-h-[56px] px-3 py-2 rounded-[14px] text-center font-sanskrit font-semibold text-lg border-2 transition-all flex flex-col items-center justify-center cursor-pointer select-none ${
                  isMatched
                    ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--tulsi)] opacity-70 cursor-default"
                    : isFailed
                    ? "bg-[var(--sindoor-tint)] border-[var(--sindoor)] text-[var(--sindoor)] animate-shake"
                    : isSelected
                    ? "bg-[var(--neel-tint)] border-[var(--neel)] text-[var(--neel-edge)] shadow-xs scale-[1.02]"
                    : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink)] shadow-[0_2px_0_var(--line-strong)] hover:border-[var(--neel)] active:translate-y-[1px]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{item.text}</span>
                  {isMatched && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                {item.helper && (
                  <span className="text-[10px] font-mono font-normal text-[var(--ink-3)]">
                    {item.helper}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column (e.g. Meanings / IAST) */}
        <div className="space-y-2.5">
          {rightItems.map((item) => {
            const isMatched = matchedPairs.some((m) => m.rightId === item.id);
            const isSelected = selectedRight === item.id;
            const isFailed = mismatched?.rightId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                data-testid={`match-right-${item.id}`}
                disabled={disabled || isMatched}
                onClick={() => handleSelectRight(item.id)}
                className={`w-full min-h-[56px] px-3 py-2 rounded-[14px] text-center font-medium text-sm sm:text-base border-2 transition-all flex flex-col items-center justify-center cursor-pointer select-none ${
                  isMatched
                    ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--tulsi)] opacity-70 cursor-default"
                    : isFailed
                    ? "bg-[var(--sindoor-tint)] border-[var(--sindoor)] text-[var(--sindoor)] animate-shake"
                    : isSelected
                    ? "bg-[var(--neel-tint)] border-[var(--neel)] text-[var(--neel-edge)] shadow-xs scale-[1.02]"
                    : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink)] shadow-[0_2px_0_var(--line-strong)] hover:border-[var(--neel)] active:translate-y-[1px]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{item.text}</span>
                  {isMatched && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                {item.helper && (
                  <span className="text-[10px] font-normal text-[var(--ink-3)]">
                    {item.helper}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
