"use client";

import React from "react";
import { Volume2, Snail } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AudioButtonProps {
  onPlay: () => void;
  isPlaying?: boolean;
  isSlow?: boolean;
  onToggleSlow?: () => void;
  showSlowToggle?: boolean;
  className?: string;
  size?: "default" | "sm";
}

export function AudioButton({
  onPlay,
  isPlaying = false,
  isSlow = false,
  onToggleSlow,
  showSlowToggle = true,
  className,
  size = "default",
}: AudioButtonProps) {
  const isSm = size === "sm";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {/* Primary 64px speaker circle button per DESIGN.md §6.6 */}
      <button
        type="button"
        onClick={onPlay}
        disabled={isPlaying}
        aria-label={isPlaying ? "Audio playing" : "Play pronunciation audio"}
        className={cn(
          "rounded-full bg-[var(--neel)] text-white flex items-center justify-center border-b-[4px] border-b-[var(--neel-edge)] active:translate-y-[3px] active:border-b-[1px] transition-all shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--neel)] select-none",
          isSm ? "w-12 h-12" : "w-16 h-16",
          isPlaying && "brightness-110 shadow-lg animate-pulse"
        )}
        data-testid="audio-play-btn"
      >
        {isPlaying ? (
          /* Animated waveform bars */
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:0ms] h-4" />
            <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:150ms] h-6" />
            <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:300ms] h-5" />
            <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:450ms] h-3" />
          </div>
        ) : (
          <Volume2 className={cn(isSm ? "w-6 h-6" : "w-8 h-8")} />
        )}
      </button>

      {/* 44px turtle slow-speed companion per DESIGN.md §6.6 */}
      {showSlowToggle && onToggleSlow && (
        <button
          type="button"
          onClick={onToggleSlow}
          aria-pressed={isSlow}
          aria-label={isSlow ? "Slow speed enabled" : "Enable slow speed"}
          className={cn(
            "w-11 h-11 rounded-full border-2 transition-all flex items-center justify-center select-none active:translate-y-[2px]",
            isSlow
              ? "bg-[var(--surface-2)] border-[var(--haldi-edge)] text-[var(--haldi-edge)] shadow-xs"
              : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
          )}
          data-testid="audio-slow-btn"
        >
          <Snail className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
