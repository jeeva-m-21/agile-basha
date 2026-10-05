"use client";

import React from "react";
import { WordTile } from "@/components/sanskrit/WordTile";
import { RotateCcw } from "lucide-react";

export interface WordTileItem {
  id: string;
  text: string;
  helper?: string;
}

export interface BuildSentenceExerciseProps {
  tiles: WordTileItem[];
  selectedTileIds: string[];
  onSelectedTilesChange: (ids: string[]) => void;
  disabled?: boolean;
  promptTranslation?: string;
  status?: "idle" | "correct" | "incorrect";
  alsoCorrectNotice?: string;
}

export function BuildSentenceExercise({
  tiles,
  selectedTileIds,
  onSelectedTilesChange,
  disabled = false,
  promptTranslation,
  status = "idle",
  alsoCorrectNotice,
}: BuildSentenceExerciseProps) {
  const handleTileClickInBank = (tileId: string) => {
    if (disabled) return;
    if (selectedTileIds.includes(tileId)) return;
    onSelectedTilesChange([...selectedTileIds, tileId]);
  };

  const handleTileClickInAnswer = (tileId: string) => {
    if (disabled) return;
    onSelectedTilesChange(selectedTileIds.filter((id) => id !== tileId));
  };

  const handleMoveLeft = (index: number) => {
    if (disabled || index <= 0) return;
    const next = [...selectedTileIds];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onSelectedTilesChange(next);
  };

  const handleMoveRight = (index: number) => {
    if (disabled || index >= selectedTileIds.length - 1) return;
    const next = [...selectedTileIds];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onSelectedTilesChange(next);
  };

  const handleClear = () => {
    if (disabled) return;
    onSelectedTilesChange([]);
  };

  return (
    <div className="space-y-5" data-testid="build-sentence-exercise">
      {/* Target translation prompt if provided */}
      {promptTranslation && (
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--ink-2)] italic">
            &ldquo;{promptTranslation}&rdquo;
          </p>
        </div>
      )}

      {/* Answer Line (Top) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink-3)] px-1">
          <span>Your sentence:</span>
          {selectedTileIds.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-[var(--ink-3)] hover:text-[var(--ink)] text-xs font-medium cursor-pointer"
              data-testid="clear-sentence-btn"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div
          data-testid="answer-line"
          aria-label="Sentence answer line"
          className={`min-h-[72px] p-3 rounded-[18px] border-2 flex flex-wrap items-center gap-2 transition-all ${
            status === "correct"
              ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)]"
              : status === "incorrect"
              ? "bg-[var(--sindoor-tint)] border-[var(--sindoor)]"
              : selectedTileIds.length > 0
              ? "bg-[var(--surface)] border-[var(--line-strong)] shadow-xs"
              : "border-dashed border-[var(--line-strong)] bg-[var(--surface-2)]"
          }`}
        >
          {selectedTileIds.length === 0 ? (
            <span className="text-xs text-[var(--ink-3)] select-none mx-auto py-2">
              Tap words from below to build the sentence
            </span>
          ) : (
            selectedTileIds.map((tileId, index) => {
              const tile = tiles.find((t) => t.id === tileId);
              if (!tile) return null;

              return (
                <WordTile
                  key={`answer-${tile.id}`}
                  id={tile.id}
                  text={tile.text}
                  helper={tile.helper}
                  location="answer"
                  position={index}
                  disabled={disabled}
                  onClick={() => handleTileClickInAnswer(tile.id)}
                  canMoveLeft={index > 0}
                  canMoveRight={index < selectedTileIds.length - 1}
                  onMoveLeft={() => handleMoveLeft(index)}
                  onMoveRight={() => handleMoveRight(index)}
                />
              );
            })
          )}
        </div>

        {/* Alternative word order notice per SPEC §8.2 */}
        {alsoCorrectNotice && (
          <div
            data-testid="also-correct-notice"
            className="text-xs text-[var(--tulsi)] font-medium px-1 flex items-center gap-1"
          >
            <span>💡</span>
            <span>{alsoCorrectNotice}</span>
          </div>
        )}
      </div>

      {/* Word Bank (Bottom) */}
      <div className="space-y-2 pt-2 border-t border-[var(--line)]">
        <div className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-wider px-1">
          Word Bank:
        </div>
        <div
          data-testid="word-bank"
          className="flex flex-wrap items-center justify-center gap-2.5 p-3 rounded-[16px] bg-[var(--surface-2)] border border-[var(--line)]"
        >
          {tiles.map((tile) => {
            const isPlaced = selectedTileIds.includes(tile.id);

            return (
              <WordTile
                key={`bank-${tile.id}`}
                id={tile.id}
                text={tile.text}
                helper={tile.helper}
                location="bank"
                isGhost={isPlaced}
                disabled={disabled || isPlaced}
                onClick={() => handleTileClickInBank(tile.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
