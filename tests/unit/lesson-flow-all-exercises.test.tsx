import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LessonPage from "@/app/lesson/[id]/page";
import { I18nProvider } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    id: "level-0-lesson-2",
  }),
}));

describe("Lesson 2 Engine Loop (All Sprint 6 Exercises)", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    usePreferencesStore.setState({
      learnIn: "en",
      script: "devanagari",
      helperLine: "roman",
      dailyGoalMin: 10,
    });
  });

  const renderLesson = () => {
    return render(
      <I18nProvider>
        <LessonPage />
      </I18nProvider>
    );
  };

  it("walks through See It, Notice It, Rule, and executes all 4 new exercise types", async () => {
    renderLesson();

    // 1. See It -> Continue
    const continueBtn = screen.getByTestId("lesson-continue-btn");
    fireEvent.click(continueBtn);

    // 2. Notice It -> Continue
    await waitFor(() => {
      expect(screen.getByText(/observe its role/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("lesson-continue-btn"));

    // 3. Rule -> Continue
    await waitFor(() => {
      expect(screen.getByText(/word order in sanskrit/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("lesson-continue-btn"));

    // 4. Exercise 1: Fill the Blank
    await waitFor(() => {
      expect(screen.getByTestId("fill-blank-exercise")).toBeInTheDocument();
    });

    const opt1 = screen.getByTestId("option-card-opt-1"); // "वनम्"
    fireEvent.click(opt1);
    expect(screen.getByTestId("blank-slot")).toHaveTextContent("वनम्");

    // Check Fill Blank
    fireEvent.click(screen.getByTestId("lesson-check-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("feedback-sheet")).toBeInTheDocument();
      expect(screen.getAllByText(/correct!/i).length).toBeGreaterThanOrEqual(1);
    });
    fireEvent.click(screen.getByTestId("feedback-continue-btn"));

    // 5. Exercise 2: Match Pairs
    await waitFor(() => {
      expect(screen.getByTestId("match-exercise")).toBeInTheDocument();
    });

    // Match all 4 pairs
    fireEvent.click(screen.getByTestId("match-left-p1-l"));
    fireEvent.click(screen.getByTestId("match-right-p1-r"));

    fireEvent.click(screen.getByTestId("match-left-p2-l"));
    fireEvent.click(screen.getByTestId("match-right-p2-r"));

    fireEvent.click(screen.getByTestId("match-left-p3-l"));
    fireEvent.click(screen.getByTestId("match-right-p3-r"));

    fireEvent.click(screen.getByTestId("match-left-p4-l"));
    fireEvent.click(screen.getByTestId("match-right-p4-r"));

    // Check Match
    const checkBtn = screen.getByTestId("lesson-check-btn");
    expect(checkBtn).not.toBeDisabled();
    fireEvent.click(checkBtn);

    await waitFor(() => {
      expect(screen.getByTestId("feedback-sheet")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("feedback-continue-btn"));

    // 6. Exercise 3: Build Sentence with Word Tiles (Flexible Word Order)
    await waitFor(() => {
      expect(screen.getByTestId("build-sentence-exercise")).toBeInTheDocument();
    });

    // Tap word tiles in alternative valid order: "वनम्" -> "रामः" -> "गच्छति"
    fireEvent.click(screen.getByTestId("word-tile-tile-2"));
    fireEvent.click(screen.getByTestId("word-tile-tile-1"));
    fireEvent.click(screen.getByTestId("word-tile-tile-3"));

    // Check Build Sentence
    fireEvent.click(screen.getByTestId("lesson-check-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("feedback-sheet")).toBeInTheDocument();
      expect(screen.getAllByText(/correct!/i).length).toBeGreaterThanOrEqual(1);
      // Alternative word order notice is present in feedback sheet
      expect(screen.getByTestId("feedback-also-correct")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("feedback-continue-btn"));

    // 7. Exercise 4: Transliterate
    await waitFor(() => {
      expect(screen.getByTestId("transliterate-exercise")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("option-card-opt-1")); // "gacchati"
    fireEvent.click(screen.getByTestId("lesson-check-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("feedback-sheet")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("feedback-continue-btn"));

    // 8. Recap screen
    await waitFor(() => {
      expect(screen.getByText(/lesson 2 complete!/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("lesson-continue-btn"));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });
});
