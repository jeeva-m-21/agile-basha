import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReadPage from "@/app/(app)/read/page";
import { I18nProvider } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";

describe("Reader Flow & Progressive Disclosure", () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferencesStore.setState({
      learnIn: "en",
      script: "devanagari",
      helperLine: "roman",
      dailyGoalMin: 10,
    });
  });

  const renderReader = () => {
    return render(
      <I18nProvider>
        <ReadPage />
      </I18nProvider>
    );
  };

  it("renders Sanskrit input, displays analyzed sentence with token chips, and shows word counter", () => {
    renderReader();

    expect(screen.getByTestId("sanskrit-input-form")).toBeInTheDocument();
    expect(screen.getByTestId("sanskrit-text-input")).toBeInTheDocument();
    expect(screen.getByTestId("script-detected-badge")).toHaveTextContent("devanagari");

    // Default analyzed verse display
    expect(screen.getByTestId("reader-sanskrit-display")).toHaveTextContent("रामः वनं गच्छति");
    expect(screen.getByTestId("words-known-counter")).toHaveTextContent(/you know 3 of 3 words/i);

    // Token chips rendered
    expect(screen.getByTestId("token-chip-0")).toBeInTheDocument();
    expect(screen.getByTestId("token-chip-1")).toBeInTheDocument();
    expect(screen.getByTestId("token-chip-2")).toBeInTheDocument();
  });

  it("opens WordDetailSheet on token tap, reveals progressive grammar, and allows saving word", async () => {
    renderReader();

    // Tap first token chip (रामः)
    const tokenChip0 = screen.getByTestId("token-chip-0");
    fireEvent.click(tokenChip0);

    // Sheet should appear
    await waitFor(() => {
      expect(screen.getByTestId("word-detail-sheet")).toBeInTheDocument();
      expect(screen.getByTestId("detail-word-sanskrit")).toHaveTextContent("रामः");
      expect(screen.getByTestId("detail-meaning")).toBeInTheDocument();
      expect(screen.getByTestId("detail-grammar")).toHaveTextContent(/nominative/i);
    });

    // Expand Sanskrit rule
    const showRuleBtn = screen.getByText(/show full rule/i);
    fireEvent.click(showRuleBtn);

    await waitFor(() => {
      expect(screen.getByTestId("detail-rule")).toHaveTextContent(/prathamā vibhakti/i);
    });

    // Save word
    const saveBtn = screen.getByTestId("save-word-btn");
    fireEvent.click(saveBtn);
    expect(screen.getByText(/saved to vocabulary/i)).toBeInTheDocument();

    // Close sheet
    fireEvent.click(screen.getByTestId("close-detail-sheet-btn"));
    await waitFor(() => {
      expect(screen.queryByTestId("word-detail-sheet")).not.toBeInTheDocument();
    });
  });

  it("shows typing preview and analyzes text when sample button is clicked", async () => {
    renderReader();

    // Click sample "Subhāṣita"
    const sampleSubhashita = screen.getByTestId("sample-subhāṣita");
    fireEvent.click(sampleSubhashita);

    await waitFor(() => {
      expect(screen.getByTestId("reader-sanskrit-display")).toHaveTextContent("विद्या ददाति विनयम्");
    });
  });
});
