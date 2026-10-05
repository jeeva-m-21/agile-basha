import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TextLibrary } from "@/components/reader/TextLibrary";

describe("TextLibrary Component", () => {
  it("renders all category filter pills and curated classical text cards", () => {
    const handleSelect = vi.fn();
    render(<TextLibrary onSelectText={handleSelect} />);

    expect(screen.getByTestId("category-pill-all")).toBeDefined();
    expect(screen.getByTestId("category-pill-gita")).toBeDefined();
    expect(screen.getByTestId("category-pill-subhashita")).toBeDefined();
    expect(screen.getByTestId("category-pill-upanishad")).toBeDefined();

    expect(screen.getByTestId("curated-text-card-gita-1-1")).toBeDefined();
    expect(screen.getByTestId("curated-text-card-subhashita-vidya")).toBeDefined();
  });

  it("filters texts when clicking on a category pill", () => {
    const handleSelect = vi.fn();
    render(<TextLibrary onSelectText={handleSelect} />);

    // Click on Upaniṣad category
    const upanishadBtn = screen.getByTestId("category-pill-upanishad");
    fireEvent.click(upanishadBtn);

    // Gītā card should not be present
    expect(screen.queryByTestId("curated-text-card-gita-1-1")).toBeNull();
    // Upaniṣad card should be present
    expect(screen.getByTestId("curated-text-card-upanishad-shanti")).toBeDefined();
  });

  it("calls onSelectText when a text card is clicked", () => {
    const handleSelect = vi.fn();
    render(<TextLibrary onSelectText={handleSelect} />);

    const gitaCard = screen.getByTestId("curated-text-card-gita-1-1");
    fireEvent.click(gitaCard);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "gita-1-1",
        category: "gita",
      })
    );
  });
});
