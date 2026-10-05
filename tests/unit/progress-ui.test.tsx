import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LevelProgressBar } from "@/components/progress/LevelProgressBar";
import { SkillMap } from "@/components/progress/SkillMap";
import { WeeklySummaryCard } from "@/components/progress/WeeklySummaryCard";
import { CelebrationModal } from "@/components/progress/CelebrationModal";
import { computeProgressSummary } from "@/lib/progress/skills";

describe("Progress & Motivation UI (SPEC §13)", () => {
  const summary = computeProgressSummary();

  it("renders LevelProgressBar with progress percentage and 'You can now' statement", () => {
    render(
      <LevelProgressBar
        level={summary.currentLevel}
        levelName={summary.levelNameEn}
        progressPercent={summary.levelProgressPercent}
        youCanNow={summary.youCanNowEn}
      />
    );

    expect(screen.getByTestId("level-progress-card")).toBeInTheDocument();
    expect(screen.getByText(summary.levelNameEn)).toBeInTheDocument();
    expect(screen.getByText(`${summary.levelProgressPercent}%`)).toBeInTheDocument();
    expect(screen.getByText(/You can now:/i)).toBeInTheDocument();
    expect(screen.getByTestId("progress-bar-fill")).toBeInTheDocument();
  });

  it("renders SkillMap with nodes and opens skill details modal on click", async () => {
    render(<SkillMap skills={summary.skills} />);

    expect(screen.getByTestId("skill-map-container")).toBeInTheDocument();
    expect(screen.getByTestId("skill-node-skill-vowels")).toBeInTheDocument();
    expect(screen.getByTestId("skill-node-skill-karta")).toBeInTheDocument();

    // Click on Kartā skill node
    const kartaNode = screen.getByTestId("skill-node-skill-karta");
    fireEvent.click(kartaNode);

    // Modal should appear
    await waitFor(() => {
      const modal = screen.getByTestId("skill-detail-modal");
      expect(modal).toBeInTheDocument();
      expect(within(modal).getByText(/Nominative Case/i)).toBeInTheDocument();
      expect(screen.getByTestId("skill-lesson-btn")).toBeInTheDocument();
    });

    // Close modal
    fireEvent.click(screen.getByTestId("close-skill-modal-btn"));
    await waitFor(() => {
      expect(screen.queryByTestId("skill-detail-modal")).not.toBeInTheDocument();
    });
  });

  it("renders WeeklySummaryCard with 3 metrics and protected rest day badge", () => {
    render(
      <WeeklySummaryCard
        minutesPracticed={45}
        wordsLearned={18}
        lessonsCompleted={3}
        daysActive={4}
        streakDays={5}
        restDayProtected={true}
      />
    );

    expect(screen.getByTestId("weekly-summary-card")).toBeInTheDocument();
    expect(screen.getByTestId("metric-minutes")).toHaveTextContent("45");
    expect(screen.getByTestId("metric-words")).toHaveTextContent("18");
    expect(screen.getByTestId("metric-lessons")).toHaveTextContent("3");
    expect(screen.getByTestId("streak-badge-summary")).toHaveTextContent(/protected/i);
  });

  it("renders CelebrationModal on lesson completion and triggers onContinue callback", () => {
    const handleContinue = vi.fn();
    render(
      <CelebrationModal
        isOpen={true}
        onContinue={handleContinue}
        title="Lesson 1: First Sentences"
        subtitle="You learned 3 new words and your first Sanskrit sentence!"
      />
    );

    expect(screen.getByTestId("celebration-modal")).toBeInTheDocument();
    expect(screen.getByText(/Lesson Complete!/i)).toBeInTheDocument();
    expect(screen.getByText(/Lesson 1: First Sentences/i)).toBeInTheDocument();

    const continueBtn = screen.getByTestId("celebration-continue-btn");
    fireEvent.click(continueBtn);

    expect(handleContinue).toHaveBeenCalledTimes(1);
  });
});
