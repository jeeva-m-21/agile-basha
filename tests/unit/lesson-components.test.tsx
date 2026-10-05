import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LessonProgressBar } from "@/components/lesson/LessonProgressBar";
import { OptionCard } from "@/components/lesson/OptionCard";
import { FeedbackSheet } from "@/components/lesson/FeedbackSheet";

describe("LessonProgressBar", () => {
  it("renders with proper percentage width and handles close", () => {
    const handleClose = vi.fn();
    render(
      <LessonProgressBar currentStep={3} totalSteps={6} onClose={handleClose} />
    );

    const progressBar = screen.getByTestId("lesson-progress-bar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");

    const exitBtn = screen.getByTestId("lesson-exit-btn");
    fireEvent.click(exitBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});

describe("OptionCard", () => {
  it("renders unselected, selected, correct, and incorrect states", () => {
    const handleSelect = vi.fn();
    const { rerender } = render(
      <OptionCard
        id="opt-1"
        text="अ"
        helper="a"
        isSelected={false}
        onSelect={handleSelect}
      />
    );

    const card = screen.getByTestId("option-card-opt-1");
    expect(card).toBeInTheDocument();
    expect(screen.getByText("अ")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();

    fireEvent.click(card);
    expect(handleSelect).toHaveBeenCalled();

    // Rerender as selected
    rerender(
      <OptionCard
        id="opt-1"
        text="अ"
        helper="a"
        isSelected={true}
        onSelect={handleSelect}
      />
    );
    expect(card.className).toContain("bg-[var(--neel-tint)]");

    // Rerender as correct
    rerender(
      <OptionCard
        id="opt-1"
        text="अ"
        helper="a"
        isSelected={true}
        status="correct"
        onSelect={handleSelect}
      />
    );
    expect(card.className).toContain("bg-[var(--tulsi-tint)]");

    // Rerender as incorrect
    rerender(
      <OptionCard
        id="opt-1"
        text="अ"
        helper="a"
        isSelected={true}
        status="incorrect"
        onSelect={handleSelect}
      />
    );
    expect(card.className).toContain("bg-[var(--sindoor-tint)]");
  });
});

describe("FeedbackSheet", () => {
  it("renders correct variant with tulsi styling and calls onContinue", () => {
    const handleContinue = vi.fn();
    render(
      <FeedbackSheet
        isCorrect={true}
        explanation="That is correct!"
        onContinue={handleContinue}
      />
    );

    const sheet = screen.getByTestId("feedback-sheet");
    expect(sheet.className).toContain("bg-[var(--tulsi-tint)]");
    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(screen.getByText("That is correct!")).toBeInTheDocument();

    const continueBtn = screen.getByTestId("feedback-continue-btn");
    fireEvent.click(continueBtn);
    expect(handleContinue).toHaveBeenCalled();
  });

  it("renders incorrect variant with sindoor styling", () => {
    const handleContinue = vi.fn();
    render(
      <FeedbackSheet
        isCorrect={false}
        explanation="The correct answer is ā."
        onContinue={handleContinue}
      />
    );

    const sheet = screen.getByTestId("feedback-sheet");
    expect(sheet.className).toContain("bg-[var(--sindoor-tint)]");
    expect(screen.getByText("Not yet")).toBeInTheDocument();
    expect(screen.getByText("The correct answer is ā.")).toBeInTheDocument();
  });
});
