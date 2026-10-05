import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import MePage from "@/app/(app)/me/page";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { I18nProvider } from "@/i18n/provider";

describe("Accessibility and Settings in Me Page", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-contrast");
    document.documentElement.removeAttribute("data-reduced-motion");
    document.documentElement.removeAttribute("data-text-size");
    usePreferencesStore.setState({
      highContrast: false,
      reducedMotion: false,
      textSize: "normal",
      learnIn: "en",
    });
  });

  it("toggles high contrast mode and updates document attribute", () => {
    render(
      <I18nProvider>
        <MePage />
      </I18nProvider>
    );

    const toggle = screen.getByTestId("high-contrast-toggle");
    expect(toggle).toHaveTextContent("OFF");
    expect(document.documentElement.getAttribute("data-contrast")).toBeNull();

    fireEvent.click(toggle);

    expect(toggle).toHaveTextContent("ON");
    expect(document.documentElement.getAttribute("data-contrast")).toBe("high");

    fireEvent.click(toggle);

    expect(toggle).toHaveTextContent("OFF");
    expect(document.documentElement.getAttribute("data-contrast")).toBeNull();
  });

  it("toggles reduced motion mode and updates document attribute", () => {
    render(
      <I18nProvider>
        <MePage />
      </I18nProvider>
    );

    const toggle = screen.getByTestId("reduced-motion-toggle");
    expect(toggle).toHaveTextContent("OFF");

    fireEvent.click(toggle);

    expect(toggle).toHaveTextContent("ON");
    expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("reduce");
  });

  it("adjusts text size preference", () => {
    render(
      <I18nProvider>
        <MePage />
      </I18nProvider>
    );

    const largeBtn = screen.getByTestId("text-size-large");
    fireEvent.click(largeBtn);

    expect(document.documentElement.getAttribute("data-text-size")).toBe("large");
    expect(usePreferencesStore.getState().textSize).toBe("large");

    const normalBtn = screen.getByTestId("text-size-normal");
    fireEvent.click(normalBtn);

    expect(document.documentElement.getAttribute("data-text-size")).toBeNull();
    expect(usePreferencesStore.getState().textSize).toBe("normal");
  });

  it("opens confirmation modal on clicking reset progress", () => {
    render(
      <I18nProvider>
        <MePage />
      </I18nProvider>
    );

    expect(screen.queryByTestId("reset-confirm-modal")).not.toBeInTheDocument();

    const resetBtn = screen.getByTestId("reset-data-btn");
    fireEvent.click(resetBtn);

    expect(screen.getByTestId("reset-confirm-modal")).toBeInTheDocument();
    expect(screen.getByText("Reset All Learning Data?")).toBeInTheDocument();

    // Click cancel to close
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("reset-confirm-modal")).not.toBeInTheDocument();
  });
});
