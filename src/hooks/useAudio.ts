"use client";

import { useState, useRef, useCallback } from "react";
import {
  type SyllableTiming,
  playPhoneticSound,
  getSyllableDuration,
} from "@/lib/audio/phonetics";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [activeSyllableIndex, setActiveSyllableIndex] = useState<number | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsPlaying(false);
    setActiveSyllableIndex(null);
  }, []);

  const toggleSlow = useCallback(() => {
    setIsSlow((prev) => !prev);
  }, []);

  const playSyllables = useCallback(
    async (syllables: SyllableTiming[]) => {
      stop();

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsPlaying(true);

      try {
        for (let i = 0; i < syllables.length; i++) {
          if (controller.signal.aborted) break;

          setActiveSyllableIndex(i);
          const syllable = syllables[i];

          // Play sound and wait for duration
          await playPhoneticSound(syllable.iast || syllable.text, syllable.isLong, isSlow);

          // Small pause between distinct syllables (80ms)
          if (i < syllables.length - 1 && !controller.signal.aborted) {
            await new Promise((r) => setTimeout(r, 80));
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsPlaying(false);
          setActiveSyllableIndex(null);
          abortControllerRef.current = null;
        }
      }
    },
    [isSlow, stop]
  );

  const playSingle = useCallback(
    async (text: string, isLong: boolean = false) => {
      stop();

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsPlaying(true);
      setActiveSyllableIndex(0);

      try {
        await playPhoneticSound(text, isLong, isSlow);
      } finally {
        setIsPlaying(false);
        setActiveSyllableIndex(null);
        abortControllerRef.current = null;
      }
    },
    [isSlow, stop]
  );

  return {
    isPlaying,
    isSlow,
    activeSyllableIndex,
    playSyllables,
    playSingle,
    toggleSlow,
    stop,
  };
}
