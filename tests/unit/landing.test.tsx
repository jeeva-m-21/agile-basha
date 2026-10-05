import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LandingPage from "@/app/page";

describe("Landing Page", () => {
  it("displays the product brand, title, and promise statement", () => {
    render(<LandingPage />);
    expect(screen.getByText("Bhāṣā")).toBeInTheDocument();
    expect(
      screen.getByText(/learn to read, understand, and speak sanskrit step by step/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/in the language you already think in/i)
    ).toBeInTheDocument();
  });

  it("contains the two primary call-to-action buttons", () => {
    render(<LandingPage />);
    const startBtn = screen.getByTestId("start-learning-cta");
    const readBtn = screen.getByTestId("try-reading-cta");

    expect(startBtn).toBeInTheDocument();
    expect(startBtn).toHaveTextContent(/start learning/i);

    expect(readBtn).toBeInTheDocument();
    expect(readBtn).toHaveTextContent(/try reading a verse/i);
  });

  it("allows switching between Devanāgarī, Tamil, and IAST scripts in hero section", () => {
    render(<LandingPage />);

    // Default is Devanāgarī
    expect(screen.getByText("रामः वनं गच्छति ।")).toBeInTheDocument();

    // Switch to Tamil script
    const tamilTab = screen.getByRole("button", { name: /தமிழ் வடிவம்/i });
    fireEvent.click(tamilTab);
    expect(screen.getByText("ராமஃ வநம் க³ச்ச²தி ।")).toBeInTheDocument();

    // Switch to IAST Roman
    const iastTab = screen.getByRole("button", { name: /roman \(iast\)/i });
    fireEvent.click(iastTab);
    expect(screen.getByText("rāmaḥ vanaṃ gacchati |")).toBeInTheDocument();
  });

  it("allows tapping a word to inspect its grammatical role breakdown", () => {
    render(<LandingPage />);

    const ramaWordBtn = screen.getByRole("button", { name: "रामः" });
    fireEvent.click(ramaWordBtn);

    expect(screen.getByText(/the doer/i)).toBeInTheDocument();
    expect(screen.getByText(/செய்பவர்/i)).toBeInTheDocument();
  });

  it("shows the three core learning pillars", () => {
    render(<LandingPage />);
    expect(screen.getByText(/the tamil & english bridge/i)).toBeInTheDocument();
    expect(screen.getByText(/pure human audio/i)).toBeInTheDocument();
    expect(screen.getByText(/tap-to-understand reader/i)).toBeInTheDocument();
  });
});
