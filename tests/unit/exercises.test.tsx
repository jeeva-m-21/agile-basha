import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FillBlankExercise } from "@/components/lesson/exercises/FillBlankExercise";
import { MatchExercise } from "@/components/lesson/exercises/MatchExercise";
import { BuildSentenceExercise } from "@/components/lesson/exercises/BuildSentenceExercise";
import { TransliterateExercise } from "@/components/lesson/exercises/TransliterateExercise";

describe("Exercise Components (Sprint 6)", () => {
  describe("FillBlankExercise", () => {
    const options = [
      { id: "opt-1", text: "वनम्", helper: "vanam" },
      { id: "opt-2", text: "वने", helper: "vane" },
    ];

    it("renders sentence with blank placeholder when no option selected", () => {
      render(
        <FillBlankExercise
          sentenceBefore="रामः"
          sentenceAfter="गच्छति ।"
          options={options}
          selectedOptionId={null}
          onSelectOption={vi.fn()}
        />
      );

      expect(screen.getByTestId("blank-slot")).toHaveTextContent("______");
      expect(screen.getByText("रामः")).toBeInTheDocument();
      expect(screen.getByText("गच्छति ।")).toBeInTheDocument();
    });

    it("displays selected option in blank slot and calls onSelectOption on tap", () => {
      const handleSelect = vi.fn();
      const { rerender } = render(
        <FillBlankExercise
          sentenceBefore="रामः"
          sentenceAfter="गच्छति ।"
          options={options}
          selectedOptionId={null}
          onSelectOption={handleSelect}
        />
      );

      const option1 = screen.getByTestId("option-card-opt-1");
      fireEvent.click(option1);
      expect(handleSelect).toHaveBeenCalledWith("opt-1");

      // Rerender with selected option
      rerender(
        <FillBlankExercise
          sentenceBefore="रामः"
          sentenceAfter="गच्छति ।"
          options={options}
          selectedOptionId="opt-1"
          onSelectOption={handleSelect}
        />
      );

      expect(screen.getByTestId("blank-slot")).toHaveTextContent("वनम्");
    });
  });

  describe("MatchExercise", () => {
    const pairs = [
      {
        leftId: "p1-l",
        leftText: "अ",
        rightId: "p1-r",
        rightText: "short a",
      },
      {
        leftId: "p2-l",
        leftText: "आ",
        rightId: "p2-r",
        rightText: "long ā",
      },
    ];

    it("matches pairs on tap and reports progress", () => {
      const handleMatchesChange = vi.fn();
      render(
        <MatchExercise pairs={pairs} onMatchesChange={handleMatchesChange} />
      );

      expect(screen.getByTestId("match-progress")).toHaveTextContent("0 / 2 matched");

      // Tap left item 'अ'
      const leftA = screen.getByTestId("match-left-p1-l");
      fireEvent.click(leftA);

      // Tap right item 'short a'
      const rightA = screen.getByTestId("match-right-p1-r");
      fireEvent.click(rightA);

      expect(handleMatchesChange).toHaveBeenCalledWith([
        { leftId: "p1-l", rightId: "p1-r" },
      ]);
    });
  });

  describe("BuildSentenceExercise", () => {
    const tiles = [
      { id: "t-1", text: "रामः" },
      { id: "t-2", text: "वनम्" },
      { id: "t-3", text: "गच्छति" },
    ];

    it("renders word bank, moves tiles to answer line, and leaves ghost slot in bank", () => {
      const handleTilesChange = vi.fn();
      const { rerender } = render(
        <BuildSentenceExercise
          tiles={tiles}
          selectedTileIds={[]}
          onSelectedTilesChange={handleTilesChange}
          promptTranslation="Rāma goes to the forest"
        />
      );

      expect(screen.getByText(/rāma goes to the forest/i)).toBeInTheDocument();

      // Tap 'रामः' from bank
      const tile1 = screen.getByTestId("word-tile-t-1");
      fireEvent.click(tile1);
      expect(handleTilesChange).toHaveBeenCalledWith(["t-1"]);

      // Rerender with tile placed in answer line
      rerender(
        <BuildSentenceExercise
          tiles={tiles}
          selectedTileIds={["t-1"]}
          onSelectedTilesChange={handleTilesChange}
        />
      );

      // Bank should now have a ghost slot for t-1
      expect(screen.getByTestId("tile-ghost-t-1")).toBeInTheDocument();

      // Answer line contains the placed tile
      const answerLine = screen.getByTestId("answer-line");
      expect(answerLine).toHaveTextContent("रामः");
    });

    it("clears placed tiles when clear button is clicked", () => {
      const handleTilesChange = vi.fn();
      render(
        <BuildSentenceExercise
          tiles={tiles}
          selectedTileIds={["t-1", "t-2"]}
          onSelectedTilesChange={handleTilesChange}
        />
      );

      const clearBtn = screen.getByTestId("clear-sentence-btn");
      fireEvent.click(clearBtn);
      expect(handleTilesChange).toHaveBeenCalledWith([]);
    });

    it("displays also-correct notice when provided", () => {
      render(
        <BuildSentenceExercise
          tiles={tiles}
          selectedTileIds={["t-2", "t-1", "t-3"]}
          onSelectedTilesChange={vi.fn()}
          alsoCorrectNotice="Also common word order: 'रामः वनम् गच्छति'"
        />
      );

      expect(screen.getByTestId("also-correct-notice")).toHaveTextContent(
        /also common word order/i
      );
    });
  });

  describe("TransliterateExercise", () => {
    const options = [
      { id: "opt-1", text: "gacchati" },
      { id: "opt-2", text: "gachati" },
    ];

    it("renders source script prompt and selectable transliteration options", () => {
      const handleSelect = vi.fn();
      render(
        <TransliterateExercise
          sourceText="गच्छति"
          sourceScriptLabel="Devanāgarī"
          targetScriptLabel="IAST"
          options={options}
          selectedOptionId={null}
          onSelectOption={handleSelect}
        />
      );

      expect(screen.getByTestId("transliterate-source")).toHaveTextContent("गच्छति");
      expect(screen.getByText("Devanāgarī")).toBeInTheDocument();
      expect(screen.getByText("IAST")).toBeInTheDocument();

      const opt1 = screen.getByTestId("option-card-opt-1");
      fireEvent.click(opt1);
      expect(handleSelect).toHaveBeenCalledWith("opt-1");
    });
  });
});
