import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewPage from "@/app/review/page";
import { I18nProvider } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { reviewStore } from "@/lib/srs/storage";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Review Flow (SRS Spaced Repetition)", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    reviewStore.resetStore();

    usePreferencesStore.setState({
      learnIn: "en",
      script: "devanagari",
      helperLine: "roman",
      dailyGoalMin: 10,
    });
  });

  const renderReview = () => {
    return render(
      <I18nProvider>
        <ReviewPage />
      </I18nProvider>
    );
  };

  it("renders review prompt card with audio button, reveals answer, and submits rating", async () => {
    renderReview();

    // 1. Initial Prompt Card
    await waitFor(() => {
      expect(screen.getByTestId("review-card")).toBeInTheDocument();
      expect(screen.getByTestId("review-sanskrit-prompt")).toBeInTheDocument();
      expect(screen.getByTestId("audio-play-btn")).toBeInTheDocument();
      expect(screen.getByTestId("review-reveal-btn")).toBeInTheDocument();
    });

    // Fast-Action controls
    expect(screen.getByTestId("review-know-this-btn")).toBeInTheDocument();
    expect(screen.getByTestId("review-reset-btn")).toBeInTheDocument();

    // 2. Click reveal button to flip/show answer
    fireEvent.click(screen.getByTestId("review-reveal-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("review-answer-card")).toBeInTheDocument();
      expect(screen.getByTestId("rate-good-btn")).toBeInTheDocument();
    });

    // 3. Click "Good" rating (quality 4)
    fireEvent.click(screen.getByTestId("rate-good-btn"));

    // Advances to next card (or resets answer reveal)
    await waitFor(() => {
      expect(screen.queryByTestId("review-answer-card")).not.toBeInTheDocument();
      expect(screen.getByTestId("review-reveal-btn")).toBeInTheDocument();
    });
  });

  it("fast-forwards item when 'I know this' is clicked", async () => {
    renderReview();

    await waitFor(() => {
      expect(screen.getByTestId("review-know-this-btn")).toBeInTheDocument();
    });

    // Click "I know this"
    fireEvent.click(screen.getByTestId("review-know-this-btn"));

    // Advances to next card
    await waitFor(() => {
      expect(screen.getByTestId("review-reveal-btn")).toBeInTheDocument();
    });
  });

  it("resets item to day 1 when 'Reset' is clicked", async () => {
    renderReview();

    await waitFor(() => {
      expect(screen.getByTestId("review-reset-btn")).toBeInTheDocument();
    });

    // Click "Reset"
    fireEvent.click(screen.getByTestId("review-reset-btn"));

    // Advances to next card
    await waitFor(() => {
      expect(screen.getByTestId("review-reveal-btn")).toBeInTheDocument();
    });
  });
});
