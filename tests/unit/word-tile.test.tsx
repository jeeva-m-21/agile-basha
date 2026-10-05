import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WordTile } from "@/components/sanskrit/WordTile";

describe("WordTile Component", () => {
  it("renders a word tile with Sanskrit text and proper accessibility attributes", () => {
    render(<WordTile id="tile-1" text="रामः" helper="rāmaḥ" location="bank" />);

    const tile = screen.getByTestId("word-tile-tile-1");
    expect(tile).toBeInTheDocument();
    expect(tile).toHaveTextContent("रामः");
    expect(tile).toHaveTextContent("rāmaḥ");
    expect(tile).toHaveAttribute(
      "aria-label",
      "Word tile, रामः (rāmaḥ), in bank"
    );
  });

  it("renders a ghost slot when isGhost is true so bank layout does not jump", () => {
    render(<WordTile id="tile-1" text="रामः" isGhost={true} />);

    expect(screen.queryByTestId("word-tile-tile-1")).not.toBeInTheDocument();
    const ghost = screen.getByTestId("tile-ghost-tile-1");
    expect(ghost).toBeInTheDocument();
    expect(ghost).toHaveAttribute("aria-hidden", "true");
  });

  it("handles click events when tapped in the bank", () => {
    const handleClick = vi.fn();
    render(<WordTile id="tile-1" text="रामः" onClick={handleClick} />);

    const tile = screen.getByTestId("word-tile-tile-1");
    fireEvent.click(tile);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with answer line styling and supports reordering controls", () => {
    const handleMoveLeft = vi.fn();
    const handleMoveRight = vi.fn();

    render(
      <WordTile
        id="tile-2"
        text="वनम्"
        location="answer"
        position={1}
        canMoveLeft={true}
        canMoveRight={true}
        onMoveLeft={handleMoveLeft}
        onMoveRight={handleMoveRight}
      />
    );

    const tile = screen.getByTestId("word-tile-tile-2");
    expect(tile).toHaveAttribute(
      "aria-label",
      "Word tile, वनम्, in answer line at position 2"
    );

    // Keyboard navigation (ArrowLeft)
    fireEvent.keyDown(tile, { key: "ArrowLeft" });
    expect(handleMoveLeft).toHaveBeenCalledTimes(1);

    // Keyboard navigation (ArrowRight)
    fireEvent.keyDown(tile, { key: "ArrowRight" });
    expect(handleMoveRight).toHaveBeenCalledTimes(1);

    // Reorder buttons
    const moveLeftBtn = screen.getByTestId("tile-move-left-tile-2");
    fireEvent.click(moveLeftBtn);
    expect(handleMoveLeft).toHaveBeenCalledTimes(2);

    const moveRightBtn = screen.getByTestId("tile-move-right-tile-2");
    fireEvent.click(moveRightBtn);
    expect(handleMoveRight).toHaveBeenCalledTimes(2);
  });

  it("does not trigger click or keyboard actions when disabled", () => {
    const handleClick = vi.fn();
    render(<WordTile id="tile-3" text="गच्छति" disabled={true} onClick={handleClick} />);

    const tile = screen.getByTestId("word-tile-tile-3");
    expect(tile).toBeDisabled();
    fireEvent.click(tile);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
