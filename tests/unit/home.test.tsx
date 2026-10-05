import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "@/app/(app)/home/page";
import { I18nProvider } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";

// Mock fetch
const mockTodayResponse = {
  nextLesson: {
    id: "level-0-lesson-1",
    levelTitle: "Level 0 — Sounds and Script",
    title: "First Five Sounds (a, ā, i, ī, u)",
    goal: "Recognize and pronounce short and long vowel pairs",
    estMinutes: 10,
    unitTitle: "The Vowels",
  },
  review: {
    dueCount: 0,
    estMinutes: 0,
    messageEn: "Your first reviews appear tomorrow.",
    messageTa: "உங்கள் முதல் மீள்பார்வை நாளை தோன்றும்.",
  },
  reading: {
    id: "subhashita-1",
    title: "Subhāṣita",
    sanskrit: "विद्या ददाति विनयं विनयाद्याति पात्रताम् ।",
    tamilScript: "வித்³யா த³தா³தி விநயம் விநயாத்³யாதி பாத்ரதாம் ।",
    transliteration: "vidyā dadāti vinayaṃ vinayādyāti pātratām |",
    translationEn: "Knowledge gives humility; from humility comes worthiness.",
    translationTa: "கல்வி பணிவைத் தருகிறது; பணிவு தகுதியைத் தருகிறது.",
  },
  streak: {
    current: 1,
    longest: 1,
    restDayAvailable: true,
    restDayUsed: false,
  },
  weekProgress: {
    daysActive: 3,
    weeklyGoalDays: 5,
  },
};

describe("Home Screen", () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferencesStore.setState({
      learnIn: "en",
      script: "devanagari",
      helperLine: "roman",
      goals: ["gita"],
      level: "beginner",
      dailyGoalMin: 10,
    });

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockTodayResponse),
      })
    );
  });

  it("renders Continue card with the primary action button to start lesson", async () => {
    render(
      <I18nProvider>
        <HomePage />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("home-continue-card")).toBeInTheDocument();
      const startBtn = screen.getByTestId("home-start-lesson-cta");
      expect(startBtn).toBeInTheDocument();
      expect(startBtn).toHaveTextContent(/start lesson/i);
    });
  });

  it("renders Review card and Today's Reading verse card", async () => {
    render(
      <I18nProvider>
        <HomePage />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("home-review-card")).toBeInTheDocument();
      expect(screen.getByTestId("home-reading-card")).toBeInTheDocument();
      expect(
        screen.getByText("विद्या ददाति विनयं विनयाद्याति पात्रताम् ।")
      ).toBeInTheDocument();
    });
  });

  it("displays weekly momentum with active days tracker", async () => {
    render(
      <I18nProvider>
        <HomePage />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/weekly momentum/i)).toBeInTheDocument();
      expect(screen.getByText(/3 \/ 5 days/i)).toBeInTheDocument();
    });
  });
});
