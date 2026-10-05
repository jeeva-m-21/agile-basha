import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { TopBar } from "@/components/navigation/TopBar";
import { I18nProvider } from "@/i18n/provider";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
}));

describe("Bottom Navigation Bar", () => {
  it("renders all 5 core navigation tabs", () => {
    render(
      <I18nProvider>
        <BottomNav />
      </I18nProvider>
    );

    expect(screen.getByTestId("nav-tab-home")).toBeInTheDocument();
    expect(screen.getByTestId("nav-tab-learn")).toBeInTheDocument();
    expect(screen.getByTestId("nav-tab-read")).toBeInTheDocument();
    expect(screen.getByTestId("nav-tab-practice")).toBeInTheDocument();
    expect(screen.getByTestId("nav-tab-me")).toBeInTheDocument();
  });

  it("marks the active tab based on pathname", () => {
    render(
      <I18nProvider>
        <BottomNav />
      </I18nProvider>
    );

    const homeTab = screen.getByTestId("nav-tab-home");
    expect(homeTab.className).toContain("text-[var(--neel)]");
  });
});

describe("Top Bar", () => {
  it("renders product name Bhāṣā, streak chip, and theme toggle", () => {
    render(<TopBar streakCount={3} restDayProtected={true} />);

    expect(screen.getByText("Bhāṣā")).toBeInTheDocument();
    const streakChip = screen.getByTestId("streak-chip");
    expect(streakChip).toBeInTheDocument();
    expect(streakChip).toHaveTextContent("3");
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
