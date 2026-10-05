"use client";

import React from "react";
import { Volume2, Snail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/hooks/useAudio";

export interface AudioButtonProps {
  onPlay?: () => void;
  text?: string;
  isPlaying?: boolean;
  isSlow?: boolean;
  onToggleSlow?: () => void;
  showSlowToggle?: boolean;
  className?: string;
  size?: "default" | "sm";
}

export function AudioButton({
  onPlay,
  text,
  isPlaying: externalIsPlaying,
  isSlow: externalIsSlow,
  onToggleSlow: externalOnToggleSlow,
  showSlowToggle = true,
  className,
  size = "default",
}: AudioButtonProps) {
  const internalAudio = useAudio();

  const handlePlay = onPlay
    ? onPlay
    : () => {
        if (text) {
          internalAudio.playSingle(text, externalIsSlow ?? internalAudio.isSlow);
        }
      };

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalAudio.isPlaying;
  const isSlow = externalIsSlow !== undefined ? externalIsSlow : internalAudio.isSlow;
  const handleToggleSlow = externalOnToggleSlow ?? internalAudio.toggleSlow;

  const isSm = size === "sm";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {/* Speaker circle button */}
      <button
        type="button"
        onClick={handlePlay}
        disabled={isPlaying}
        aria-label={isPlaying ? "Audio playing" : "Play pronunciation audio"}
        className={cn(
          "rounded-full bg-[var(--neel)] text-white flex items-center justify-center border-b-[3px] border-b-[var(--neel-edge)] active:translate-y-[2px] active:border-b-[1px] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neel)] select-none",
          isSm ? "w-9 h-9" : "w-16 h-16",
          isPlaying && "brightness-110 shadow-lg animate-pulse"
        )}
        data-testid="audio-play-btn"
      >
        {isPlaying ? (
          /* Animated waveform bars */
          <div className="flex items-center gap-0.5" aria-hidden="true">
            <span className="w-0.5 bg-white rounded-full animate-bounce [animation-delay:0ms] h-3" />
            <span className="w-0.5 bg-white rounded-full animate-bounce [animation-delay:150ms] h-4" />
            <span className="w-0.5 bg-white rounded-full animate-bounce [animation-delay:300ms] h-3" />
          </div>
        ) : (
          <Volume2 className={cn(isSm ? "w-4 h-4" : "w-8 h-8")} />
        )}
      </button>

      {/* Optional turtle slow-speed companion */}
      {showSlowToggle && (
        <button
          type="button"
          onClick={handleToggleSlow}
          aria-pressed={isSlow}
          aria-label={isSlow ? "Slow speed enabled" : "Enable slow speed"}
          className={cn(
            "rounded-full border-2 transition-all flex items-center justify-center select-none active:translate-y-[2px]",
            isSm ? "w-8 h-8" : "w-11 h-11",
            isSlow
              ? "bg-[var(--surface-2)] border-[var(--haldi-edge)] text-[var(--haldi-edge)] shadow-xs"
              : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
          )}
          data-testid="audio-slow-btn"
        >
          <Snail className={cn(isSm ? "w-4 h-4" : "w-5 h-5")} />
        </button>
      )}
    </div>
  );
}
