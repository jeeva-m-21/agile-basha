import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import DictionaryPage from "@/app/(app)/dictionary/page";
import { I18nProvider } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";

describe("Dictionary & Grammar UI (SPEC §11.1 & §11.2)", () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferencesStore.setState({
      learnIn: "en",
      script: "devanagari",
      helperLine: "roman",
      dailyGoalMin: 10,
    });
  });

  const renderDict = () => {
    return render(
      <I18nProvider>
        <DictionaryPage />
      </I18nProvider>
    );
  };

  it("renders Dictionary tabs, search input, and initial headword cards", () => {
    renderDict();

    expect(screen.getByTestId("tab-dictionary")).toBeInTheDocument();
    expect(screen.getByTestId("tab-form-analysis")).toBeInTheDocument();
    expect(screen.getByTestId("dictionary-search-input")).toBeInTheDocument();
    expect(screen.getByTestId("dict-card-dict-shiva")).toBeInTheDocument();
    expect(screen.getByTestId("headword-dict-shiva")).toHaveTextContent("शिव");
  });

  it("allows switching between Dictionary (Meanings) and Form Analysis (Grammar) tabs", () => {
    renderDict();

    // Click Form Analysis tab
    const formTab = screen.getByTestId("tab-form-analysis");
    fireEvent.click(formTab);

    // Form input should now be visible
    expect(screen.getByTestId("form-analysis-input")).toBeInTheDocument();
    expect(screen.getByTestId("form-analysis-result-card")).toBeInTheDocument();
    expect(screen.getByText(/present active/i)).toBeInTheDocument();

    // Switch back to Dictionary tab
    const dictTab = screen.getByTestId("tab-dictionary");
    fireEvent.click(dictTab);
    expect(screen.getByTestId("dictionary-search-input")).toBeInTheDocument();
  });

  it("filters dictionary entries when typing a search query", () => {
    renderDict();

    const searchInput = screen.getByTestId("dictionary-search-input");
    fireEvent.change(searchInput, { target: { value: "forest" } });

    // Should show vana card and not shiva card
    expect(screen.getByTestId("dict-card-dict-vana")).toBeInTheDocument();
    expect(screen.queryByTestId("dict-card-dict-shiva")).not.toBeInTheDocument();
  });

  it("opens GrammarDetailModal when clicking on a grammar rule card and allows closing it", async () => {
    renderDict();

    const ruleCard = screen.getByTestId("grammar-rule-card-prathama-vibhakti");
    fireEvent.click(ruleCard);

    await waitFor(() => {
      const modal = screen.getByTestId("grammar-detail-modal");
      expect(modal).toBeInTheDocument();
      expect(within(modal).getByText(/प्रातिपदिकार्थ/i)).toBeInTheDocument();
    });

    // Close modal
    const closeBtn = screen.getByTestId("close-grammar-modal-btn");
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("grammar-detail-modal")).not.toBeInTheDocument();
    });
  });
});
