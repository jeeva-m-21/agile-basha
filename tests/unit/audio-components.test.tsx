import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AudioButton } from "@/components/sanskrit/AudioButton";
import { SyllableHighlight } from "@/components/sanskrit/SyllableHighlight";

describe("AudioButton Component", () => {
  it("renders speaker button and slow speed companion button", () => {
    const handlePlay = vi.fn();
    const handleToggleSlow = vi.fn();

    render(
      <AudioButton
        onPlay={handlePlay}
        isPlaying={false}
        isSlow={false}
        onToggleSlow={handleToggleSlow}
      />
    );

    const playBtn = screen.getByTestId("audio-play-btn");
    const slowBtn = screen.getByTestId("audio-slow-btn");

    expect(playBtn).toBeInTheDocument();
    expect(slowBtn).toBeInTheDocument();

    fireEvent.click(playBtn);
    expect(handlePlay).toHaveBeenCalledTimes(1);

    fireEvent.click(slowBtn);
    expect(handleToggleSlow).toHaveBeenCalledTimes(1);
  });

  it("displays animated waveform bars while playing", () => {
    render(
      <AudioButton
        onPlay={vi.fn()}
        isPlaying={true}
      />
    );

    const playBtn = screen.getByTestId("audio-play-btn");
    expect(playBtn).toHaveAttribute("aria-label", "Audio playing");
  });
});

describe("SyllableHighlight Component", () => {
  const syllables = [
    { text: "अ", iast: "a", tamil: "அ", isLong: false, durationMs: 350 },
    { text: "आ", iast: "ā", tamil: "ஆ", isLong: true, durationMs: 700 },
    { text: "इ", iast: "i", tamil: "இ", isLong: false, durationMs: 350 },
  ];

  it("renders syllables and helper line", () => {
    render(
      <SyllableHighlight
        syllables={syllables}
        activeIndex={null}
        script="devanagari"
      />
    );

    expect(screen.getByTestId("syllable-0")).toHaveTextContent("अ");
    expect(screen.getByTestId("syllable-1")).toHaveTextContent("आ");
    expect(screen.getByTestId("syllable-helper-0")).toHaveTextContent("a");
    expect(screen.getByTestId("syllable-helper-1")).toHaveTextContent("ā");
  });

  it("highlights active syllable with neel tint and scale", () => {
    render(
      <SyllableHighlight
        syllables={syllables}
        activeIndex={1} // "आ" active
        script="devanagari"
      />
    );

    const activeEl = screen.getByTestId("syllable-1");
    expect(activeEl).toHaveAttribute("data-active", "true");
    expect(activeEl.className).toContain("bg-[var(--neel-tint)]");

    const inactiveEl = screen.getByTestId("syllable-0");
    expect(inactiveEl).toHaveAttribute("data-active", "false");
  });

  it("renders Tamil script for Sanskrit with proper language tag", () => {
    const { container } = render(
      <SyllableHighlight
        syllables={syllables}
        activeIndex={null}
        script="tamil"
      />
    );

    expect(screen.getByTestId("syllable-0")).toHaveTextContent("அ");
    expect(screen.getByTestId("syllable-1")).toHaveTextContent("ஆ");
    expect(container.querySelector('[lang="sa-Taml"]')).toBeInTheDocument();
  });
});
