import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingPage from "@/app/onboarding/page";
import { I18nProvider } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Onboarding Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    usePreferencesStore.setState({
      learnIn: "en",
      script: "devanagari",
      helperLine: "roman",
      goals: ["gita"],
      level: "beginner",
      dailyGoalMin: 10,
    });
  });

  const renderOnboarding = () => {
    return render(
      <I18nProvider>
        <OnboardingPage />
      </I18nProvider>
    );
  };

  it("renders Step 1 (Language) with English and Tamil options", () => {
    renderOnboarding();
    expect(screen.getByText(/i'd like to learn in…/i)).toBeInTheDocument();
    expect(screen.getByTestId("lang-option-en")).toBeInTheDocument();
    expect(screen.getByTestId("lang-option-ta")).toBeInTheDocument();
  });

  it("advances to Step 2 (Script) and updates Sanskrit live preview", async () => {
    renderOnboarding();

    // Select Tamil learning language and click Continue
    fireEvent.click(screen.getByTestId("lang-option-ta"));
    fireEvent.click(screen.getByTestId("onboarding-continue-btn"));

    // Step 2 should appear
    await waitFor(() => {
      expect(screen.getByText(/சமஸ்கிருத எழுத்து வடிவம்/i)).toBeInTheDocument();
    });

    // Preview should display Devanagari by default (in preview and option button)
    expect(screen.getAllByText("रामः").length).toBeGreaterThanOrEqual(1);

    // Click Tamil script option
    fireEvent.click(screen.getByTestId("script-option-tamil"));
    // Live preview and option should now display Tamil script
    expect(screen.getAllByText("ராமஃ").length).toBeGreaterThanOrEqual(1);
  });

  it("navigates through all 6 steps to the completion screen", async () => {
    renderOnboarding();

    // Step 1 -> Step 2
    fireEvent.click(screen.getByTestId("onboarding-continue-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("script-option-devanagari")).toBeInTheDocument();
    });

    // Step 2 -> Step 3
    fireEvent.click(screen.getByTestId("onboarding-continue-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("helper-option-roman")).toBeInTheDocument();
    });

    // Step 3 -> Step 4
    fireEvent.click(screen.getByTestId("onboarding-continue-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("goal-option-gita")).toBeInTheDocument();
    });

    // Step 4 -> Step 5
    fireEvent.click(screen.getByTestId("onboarding-continue-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("level-option-beginner")).toBeInTheDocument();
    });

    // Step 5 -> Step 6
    fireEvent.click(screen.getByTestId("onboarding-continue-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("time-option-10")).toBeInTheDocument();
    });

    // Step 6 -> Step 7 (Done)
    fireEvent.click(screen.getByTestId("onboarding-continue-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("onboarding-start-lesson-btn")).toBeInTheDocument();
    });

    // Click Start Lesson 1 -> routes to /home
    fireEvent.click(screen.getByTestId("onboarding-start-lesson-btn"));
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  it("allows navigating backward using the Back button", async () => {
    renderOnboarding();

    // Move to step 2
    fireEvent.click(screen.getByTestId("onboarding-continue-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("script-option-devanagari")).toBeInTheDocument();
    });

    // Click back button
    fireEvent.click(screen.getByTestId("onboarding-back-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("lang-option-en")).toBeInTheDocument();
    });
  });
});
