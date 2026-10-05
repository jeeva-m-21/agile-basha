import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SanskritText } from "@/components/sanskrit/SanskritText";

describe("Button component", () => {
  it("renders with primary haldi styling and children", () => {
    render(<Button variant="primary">Start learning</Button>);
    const button = screen.getByRole("button", { name: /start learning/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("bg-[var(--haldi)]");
    expect(button.className).toContain("border-[var(--haldi-edge)]");
  });

  it("renders with secondary styling", () => {
    render(<Button variant="secondary">Try reading a verse</Button>);
    const button = screen.getByRole("button", { name: /try reading a verse/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("text-[var(--neel)]");
  });

  it("handles loading state properly", () => {
    render(<Button isLoading>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("handles disabled state with aria-disabled", () => {
    render(<Button disabled>Disabled Action</Button>);
    const button = screen.getByRole("button", { name: /disabled action/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});

describe("Card component", () => {
  it("renders card content with flat variant by default", () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText("Card content");
    expect(card).toBeInTheDocument();
    expect(card.className).toContain("bg-[var(--surface)]");
    expect(card.className).toContain("rounded-[var(--r-card)]");
  });

  it("renders interactive variant with pressable styles", () => {
    render(<Card variant="interactive">Interactive card</Card>);
    const card = screen.getByText("Interactive card");
    expect(card.className).toContain("cursor-pointer");
    expect(card.className).toContain("active:translate-y-[3px]");
  });

  it("renders bridge variant with mayura styling", () => {
    render(<Card variant="bridge">Bridge card</Card>);
    const card = screen.getByText("Bridge card");
    expect(card.className).toContain("bg-[var(--mayura-tint)]");
  });
});

describe("SanskritText component", () => {
  it("renders Devanāgarī with proper lang tag and text size", () => {
    const { container } = render(
      <SanskritText script="devanagari" size="hero">
        रामः वनं गच्छति
      </SanskritText>
    );
    const textEl = container.querySelector('[lang="sa-Deva"]');
    expect(textEl).toBeInTheDocument();
    expect(textEl).toHaveTextContent("रामः वनं गच्छति");
  });

  it("renders Tamil script for Sanskrit with sa-Taml lang tag", () => {
    const { container } = render(
      <SanskritText script="tamil">
        ராமஃ வநம் க³ச்ச²தி
      </SanskritText>
    );
    const textEl = container.querySelector('[lang="sa-Taml"]');
    expect(textEl).toBeInTheDocument();
    expect(textEl).toHaveTextContent("ராமஃ வநம் க³ச்ச²தி");
  });

  it("renders IAST Roman transliteration with sa-Latn lang tag and helper text", () => {
    const { container } = render(
      <SanskritText
        script="iast"
        helperText="रामः वनं गच्छति"
        helperScript="iast"
      >
        rāmaḥ vanaṃ gacchati
      </SanskritText>
    );
    const mainEl = container.querySelector('[lang="sa-Latn"]');
    expect(mainEl).toBeInTheDocument();
    expect(screen.getByText("रामः वनं गच्छति")).toBeInTheDocument();
  });
});

describe("ThemeToggle component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("toggles between light and dark modes on click", () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByTestId("theme-toggle");
    expect(toggleButton).toBeInTheDocument();

    // Default is light (or depends on system), click to switch to dark
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");

    // Click again to switch back to light
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
