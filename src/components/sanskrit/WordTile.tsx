"use client";

import React from "react";

export interface WordTileProps {
  id: string;
  text: string;
  helper?: string;
  location?: "bank" | "answer";
  position?: number;
  isSelected?: boolean;
  isGhost?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  className?: string;
}

export function WordTile({
  id,
  text,
  helper,
  location = "bank",
  position,
  isSelected = false,
  isGhost = false,
  disabled = false,
  onClick,
  onMoveLeft,
  onMoveRight,
  canMoveLeft = false,
  canMoveRight = false,
  className = "",
}: WordTileProps) {
  if (isGhost) {
    return (
      <div
        data-testid={`tile-ghost-${id}`}
        aria-hidden="true"
        className={`min-w-[60px] h-[48px] px-3.5 rounded-[14px] border-2 border-dashed border-[var(--line)] bg-transparent flex items-center justify-center opacity-40 select-none ${className}`}
      >
        <span className="invisible text-base font-medium">{text}</span>
      </div>
    );
  }

  const ariaLabel = `Word tile, ${text}${helper ? ` (${helper})` : ""}, in ${
    location === "bank" ? "bank" : `answer line at position ${(position ?? 0) + 1}`
  }`;

  return (
    <div className="relative inline-flex items-center group">
      <button
        type="button"
        data-testid={`word-tile-${id}`}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        onKeyDown={(e) => {
          if (disabled) return;
          if (location === "answer") {
            if (e.key === "ArrowLeft" && canMoveLeft && onMoveLeft) {
              e.preventDefault();
              onMoveLeft();
            } else if (e.key === "ArrowRight" && canMoveRight && onMoveRight) {
              e.preventDefault();
              onMoveRight();
            }
          }
        }}
        className={`min-w-[60px] h-[48px] px-4 py-1.5 rounded-[14px] font-semibold text-lg flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-[220ms] ease-out ${
          location === "answer"
            ? "bg-[var(--neel-tint)] border-2 border-[var(--neel)] text-[var(--neel-edge)] shadow-[0_3px_0_var(--neel-edge)] active:translate-y-[2px] active:shadow-none"
            : isSelected
            ? "bg-[var(--haldi-tint)] border-2 border-[var(--haldi)] text-[var(--ink)] shadow-[0_3px_0_var(--haldi-edge)]"
            : "bg-[var(--surface)] border-2 border-[var(--line-strong)] text-[var(--ink)] shadow-[0_3px_0_var(--line-strong)] hover:border-[var(--neel)] hover:shadow-[0_3px_0_var(--neel)] active:translate-y-[2px] active:shadow-none"
        } ${disabled ? "opacity-60 cursor-not-allowed active:translate-y-0" : ""} ${className}`}
      >
        <span lang="sa" className="leading-tight tracking-wide font-sanskrit">
          {text}
        </span>
        {helper && (
          <span className="text-[10px] font-normal text-[var(--ink-3)] leading-none -mt-0.5">
            {helper}
          </span>
        )}
      </button>

      {/* Accessible Reorder controls for answer line when focused or on hover */}
      {location === "answer" && !disabled && (canMoveLeft || canMoveRight) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden group-hover:flex group-focus-within:flex items-center gap-1 bg-[var(--surface-2)] border border-[var(--line)] rounded-full px-1 py-0.5 shadow-xs z-10">
          {canMoveLeft && (
            <button
              type="button"
              data-testid={`tile-move-left-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                onMoveLeft?.();
              }}
              title="Move left"
              className="text-[10px] font-bold px-1 hover:text-[var(--neel)]"
            >
              ←
            </button>
          )}
          {canMoveRight && (
            <button
              type="button"
              data-testid={`tile-move-right-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                onMoveRight?.();
              }}
              title="Move right"
              className="text-[10px] font-bold px-1 hover:text-[var(--neel)]"
            >
              →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
