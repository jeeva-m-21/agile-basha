export interface SyllableTiming {
  text: string;
  iast: string;
  tamil?: string;
  isLong: boolean;
  durationMs: number;
}

// Standard formant frequencies (Hz) for Sanskrit vowels
export const vowelFormants: Record<
  string,
  { f1: number; f2: number; basePitch: number }
> = {
  a: { f1: 730, f2: 1090, basePitch: 140 },
  ā: { f1: 730, f2: 1090, basePitch: 140 },
  i: { f1: 270, f2: 2290, basePitch: 155 },
  ī: { f1: 270, f2: 2290, basePitch: 155 },
  u: { f1: 300, f2: 870, basePitch: 130 },
  ū: { f1: 300, f2: 870, basePitch: 130 },
};

/**
 * Calculates syllable duration based on Sanskrit prosody (mātrā):
 * 1 mātrā (short / hrasva) = ~350ms
 * 2 mātrās (long / dīrgha) = ~700ms
 * Slow speed multiplier = 1.4x
 */
export function getSyllableDuration(isLong: boolean, isSlow: boolean = false): number {
  const base = isLong ? 700 : 350;
  return isSlow ? Math.round(base * 1.4) : base;
}

/**
 * Play a phonetic sound using Web Audio API formants when available.
 * Gracefully silent in environments without Web Audio (e.g. testing / SSR).
 */
export function playPhoneticSound(
  vowel: string,
  isLong: boolean,
  isSlow: boolean = false
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.AudioContext && !(window as any).webkitAudioContext) {
      setTimeout(resolve, getSyllableDuration(isLong, isSlow));
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const duration = getSyllableDuration(isLong, isSlow) / 1000;

      const norm = vowel.toLowerCase();
      const formant = vowelFormants[norm] || vowelFormants.a;

      // Base oscillator
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(formant.basePitch, ctx.currentTime);

      // Formant filter 1
      const filter1 = ctx.createBiquadFilter();
      filter1.type = "bandpass";
      filter1.frequency.setValueAtTime(formant.f1, ctx.currentTime);
      filter1.Q.setValueAtTime(4.0, ctx.currentTime);

      // Formant filter 2
      const filter2 = ctx.createBiquadFilter();
      filter2.type = "bandpass";
      filter2.frequency.setValueAtTime(formant.f2, ctx.currentTime);
      filter2.Q.setValueAtTime(5.0, ctx.currentTime);

      // Gain envelope
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + duration - 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(filter1);
      osc.connect(filter2);
      filter1.connect(gainNode);
      filter2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      osc.onended = () => {
        ctx.close();
        resolve();
      };
    } catch {
      setTimeout(resolve, getSyllableDuration(isLong, isSlow));
    }
  });
}
