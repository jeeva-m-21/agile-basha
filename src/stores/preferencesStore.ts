import { create } from "zustand";

export interface PreferencesState {
  learnIn: "en" | "ta";
  script: "devanagari" | "tamil" | "iast";
  helperLine: "off" | "roman" | "tamil";
  goals: string[];
  level: "beginner" | "some";
  dailyGoalMin: number;
  theme: "system" | "light" | "dark";
  highContrast: boolean;
  reducedMotion: boolean;
  textSize: "normal" | "large" | "xlarge";
  onboardingCompleted: boolean;

  setLearnIn: (lang: "en" | "ta") => void;
  setScript: (script: "devanagari" | "tamil" | "iast") => void;
  setHelperLine: (helper: "off" | "roman" | "tamil") => void;
  setGoals: (goals: string[]) => void;
  toggleGoal: (goal: string) => void;
  setLevel: (level: "beginner" | "some") => void;
  setDailyGoalMin: (mins: number) => void;
  setTheme: (theme: "system" | "light" | "dark") => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setTextSize: (size: "normal" | "large" | "xlarge") => void;
  completeOnboarding: () => Promise<void>;
  loadPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  learnIn: "en",
  script: "devanagari",
  helperLine: "roman",
  goals: ["gita", "mantras"],
  level: "beginner",
  dailyGoalMin: 10,
  theme: "system",
  highContrast: false,
  reducedMotion: false,
  textSize: "normal",
  onboardingCompleted: false,

  setLearnIn: (learnIn) => {
    set({ learnIn });
    if (typeof window !== "undefined") {
      localStorage.setItem("learn_in", learnIn);
      document.documentElement.lang = learnIn;
    }
  },

  setScript: (script) => {
    set({ script });
    if (typeof window !== "undefined") {
      localStorage.setItem("sanskrit_script", script);
    }
  },

  setHelperLine: (helperLine) => {
    set({ helperLine });
    if (typeof window !== "undefined") {
      localStorage.setItem("helper_line", helperLine);
    }
  },

  setGoals: (goals) => {
    set({ goals });
    if (typeof window !== "undefined") {
      localStorage.setItem("user_goals", JSON.stringify(goals));
    }
  },

  toggleGoal: (goal) => {
    const current = get().goals;
    const exists = current.includes(goal);
    const updated = exists ? current.filter((g) => g !== goal) : [...current, goal];
    get().setGoals(updated);
  },

  setLevel: (level) => {
    set({ level });
    if (typeof window !== "undefined") {
      localStorage.setItem("user_level", level);
    }
  },

  setDailyGoalMin: (dailyGoalMin) => {
    set({ dailyGoalMin });
    if (typeof window !== "undefined") {
      localStorage.setItem("daily_goal_min", String(dailyGoalMin));
    }
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      if (theme !== "system") {
        document.documentElement.setAttribute("data-theme", theme);
      }
    }
  },

  setHighContrast: (highContrast) => {
    set({ highContrast });
    if (typeof window !== "undefined") {
      localStorage.setItem("high_contrast", String(highContrast));
      if (highContrast) {
        document.documentElement.setAttribute("data-contrast", "high");
      } else {
        document.documentElement.removeAttribute("data-contrast");
      }
    }
  },

  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion });
    if (typeof window !== "undefined") {
      localStorage.setItem("reduced_motion", String(reducedMotion));
      if (reducedMotion) {
        document.documentElement.setAttribute("data-reduced-motion", "reduce");
      } else {
        document.documentElement.removeAttribute("data-reduced-motion");
      }
    }
  },

  setTextSize: (textSize) => {
    set({ textSize });
    if (typeof window !== "undefined") {
      localStorage.setItem("text_size", textSize);
      if (textSize !== "normal") {
        document.documentElement.setAttribute("data-text-size", textSize);
      } else {
        document.documentElement.removeAttribute("data-text-size");
      }
    }
  },

  completeOnboarding: async () => {
    set({ onboardingCompleted: true });
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding_completed", "true");
    }

    try {
      const state = get();
      await fetch("/api/onboarding/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnIn: state.learnIn,
          script: state.script,
          helperLine: state.helperLine,
          goals: state.goals,
          level: state.level,
          dailyGoalMin: state.dailyGoalMin,
          theme: state.theme,
        }),
      });
    } catch {
      // Non-blocking for offline/first visits
    }
  },

  loadPreferences: () => {
    if (typeof window === "undefined") return;

    const learnIn = (localStorage.getItem("learn_in") as "en" | "ta") || "en";
    const script =
      (localStorage.getItem("sanskrit_script") as "devanagari" | "tamil" | "iast") ||
      "devanagari";
    const helperLine =
      (localStorage.getItem("helper_line") as "off" | "roman" | "tamil") || "roman";
    const level = (localStorage.getItem("user_level") as "beginner" | "some") || "beginner";
    const dailyGoalMin = Number(localStorage.getItem("daily_goal_min")) || 10;
    const completed = localStorage.getItem("onboarding_completed") === "true";
    const highContrast = localStorage.getItem("high_contrast") === "true";
    const reducedMotion = localStorage.getItem("reduced_motion") === "true";
    const textSize =
      (localStorage.getItem("text_size") as "normal" | "large" | "xlarge") || "normal";

    if (highContrast) {
      document.documentElement.setAttribute("data-contrast", "high");
    } else {
      document.documentElement.removeAttribute("data-contrast");
    }

    if (reducedMotion) {
      document.documentElement.setAttribute("data-reduced-motion", "reduce");
    } else {
      document.documentElement.removeAttribute("data-reduced-motion");
    }

    if (textSize !== "normal") {
      document.documentElement.setAttribute("data-text-size", textSize);
    } else {
      document.documentElement.removeAttribute("data-text-size");
    }

    let goals = ["gita", "mantras"];
    try {
      const storedGoals = localStorage.getItem("user_goals");
      if (storedGoals) goals = JSON.parse(storedGoals);
    } catch {}

    set({
      learnIn,
      script,
      helperLine,
      level,
      dailyGoalMin,
      goals,
      highContrast,
      reducedMotion,
      textSize,
      onboardingCompleted: completed,
    });
  },
}));
