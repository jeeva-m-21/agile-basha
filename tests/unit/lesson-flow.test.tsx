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
    id: "level-0-lesson-1",
  }),
}));

describe("Lesson Engine Loop", () => {
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

  it("renders Step 1 (See It) with primary Sanskrit hero display", () => {
    renderLesson();
    expect(screen.getByText(/see the first five sounds/i)).toBeInTheDocument();
    expect(screen.getByText("अ आ इ ई उ")).toBeInTheDocument();
    expect(screen.getByTestId("lesson-continue-btn")).toBeInTheDocument();
  });

  it("advances to Step 2 (Notice It) and allows tapping tokens to inspect phonetic details", async () => {
    renderLesson();

    // Advance to Step 2
    fireEvent.click(screen.getByTestId("lesson-continue-btn"));

    await waitFor(() => {
      expect(screen.getByText(/notice the pattern/i)).toBeInTheDocument();
    });

    // Tap token 'अ'
    const tokenA = screen.getByTestId("notice-token-अ");
    fireEvent.click(tokenA);

    await waitFor(() => {
      expect(screen.getByText("Short vowel (Hrasva)")).toBeInTheDocument();
    });
  });

  it("advances through Rule to Exercise, enables Check only after selection, and shows FeedbackSheet", async () => {
    renderLesson();

    // Step 1 -> Step 2
    fireEvent.click(screen.getByTestId("lesson-continue-btn"));
    await waitFor(() => {
      expect(screen.getByText(/notice the pattern/i)).toBeInTheDocument();
    });

    // Step 2 -> Step 3 (Rule)
    fireEvent.click(screen.getByTestId("lesson-continue-btn"));
    await waitFor(() => {
      expect(screen.getByText(/short \(hrasva\) vs\. long \(dīrgha\)/i)).toBeInTheDocument();
    });

    // Step 3 -> Step 4 (Exercise 1)
    fireEvent.click(screen.getByTestId("lesson-continue-btn"));
    await waitFor(() => {
      expect(screen.getByText(/which letter makes the long 'ā' sound\?/i)).toBeInTheDocument();
    });

    // Check button should initially be disabled
    const checkBtn = screen.getByTestId("lesson-check-btn");
    expect(checkBtn).toBeDisabled();

    // Select correct option 'आ' (opt-2)
    const opt2 = screen.getByTestId("option-card-opt-2");
    fireEvent.click(opt2);
    expect(checkBtn).not.toBeDisabled();

    // Click Check
    fireEvent.click(checkBtn);

    // Feedback sheet should appear
    await waitFor(() => {
      expect(screen.getByTestId("feedback-sheet")).toBeInTheDocument();
      expect(screen.getAllByText(/correct!/i).length).toBeGreaterThanOrEqual(1);
    });

    // Continue to next exercise
    fireEvent.click(screen.getByTestId("feedback-continue-btn"));
    await waitFor(() => {
      expect(screen.getByText(/which letter represents the short sound 'i'\?/i)).toBeInTheDocument();
    });
  });

  it("completes the lesson and navigates back to Home upon completion", async () => {
    renderLesson();

    // Advance through the steps to reach Step 7 (Recap)
    for (let i = 0; i < 6; i++) {
      const btn = screen.queryByTestId("lesson-continue-btn");
      if (btn) {
        fireEvent.click(btn);
      } else {
        // In an exercise step
        const options = screen.getAllByRole("button");
        const opt = options.find((o) => o.getAttribute("data-testid")?.startsWith("option-card-"));
        if (opt) fireEvent.click(opt);
        const check = screen.getByTestId("lesson-check-btn");
        fireEvent.click(check);
        await waitFor(() => {
          expect(screen.getByTestId("feedback-continue-btn")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId("feedback-continue-btn"));
      }
    }

    await waitFor(() => {
      expect(screen.getByText("Lesson Complete!")).toBeInTheDocument();
      expect(screen.getByText(/you can now read and pronounce/i)).toBeInTheDocument();
    });

    // Click finish button
    fireEvent.click(screen.getByTestId("lesson-continue-btn"));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });
});
