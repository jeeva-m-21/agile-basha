import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlacementQuizModal } from "@/components/placement/PlacementQuizModal";
import { TranslationProvider } from "@/i18n/provider";

function renderWithProviders(ui: React.ReactElement) {
  return render(<TranslationProvider initialLanguage="en">{ui}</TranslationProvider>);
}

describe("PlacementQuizModal Component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = renderWithProviders(
      <PlacementQuizModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders active question and options when open", () => {
    renderWithProviders(<PlacementQuizModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId("placement-quiz-modal")).toBeInTheDocument();
    expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
    expect(screen.getByTestId("placement-options")).toBeInTheDocument();
  });

  it("allows selecting an option and reveals explanation with next button", () => {
    renderWithProviders(<PlacementQuizModal isOpen={true} onClose={vi.fn()} />);

    const option = screen.getByTestId("option-opt-2");
    fireEvent.click(option);

    expect(screen.getByTestId("placement-next-btn")).toBeInTheDocument();
  });

  it("completes quiz and allows customized skill toggling and confirm", () => {
    const onComplete = vi.fn();
    const onClose = vi.fn();

    renderWithProviders(
      <PlacementQuizModal isOpen={true} onClose={onClose} onComplete={onComplete} />
    );

    // Answer questions quickly by clicking first option and next
    const totalQuestions = 9;
    for (let i = 0; i < totalQuestions; i++) {
      const option = screen.getAllByRole("button").find((btn) =>
        btn.getAttribute("data-testid")?.startsWith("option-")
      );
      if (option) fireEvent.click(option);

      const nextBtn = screen.getByTestId("placement-next-btn");
      fireEvent.click(nextBtn);
    }

    // Now in results screen
    expect(screen.getByTestId("placement-results-screen")).toBeInTheDocument();
    expect(screen.getByTestId("mastered-skills-list")).toBeInTheDocument();

    // Tap skill toggle to customize known skills
    const firstSkillToggle = screen.getAllByRole("button").find((btn) =>
      btn.getAttribute("data-testid")?.startsWith("skill-toggle-")
    );
    if (firstSkillToggle) fireEvent.click(firstSkillToggle);

    // Confirm result
    const confirmBtn = screen.getByTestId("placement-confirm-btn");
    fireEvent.click(confirmBtn);

    expect(onComplete).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
