import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "@/app/error";
import NotFoundPage from "@/app/not-found";

describe("Error Boundary & 404 Components", () => {
  it("renders GlobalError with bilingual message and retry button", () => {
    const resetMock = vi.fn();
    const testError = new Error("Unexpected crash");

    render(<GlobalError error={testError} reset={resetMock} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something unexpected occurred")).toBeInTheDocument();
    expect(screen.getByText("எதிர்பாராத பிழை ஏற்பட்டது")).toBeInTheDocument();

    const retryBtn = screen.getByText("Try again");
    fireEvent.click(retryBtn);
    expect(resetMock).toHaveBeenCalled();

    const homeLink = screen.getByText("Back to Home");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/home");
  });

  it("renders NotFoundPage with 404 header and navigation back home", () => {
    render(<NotFoundPage />);

    expect(screen.getByText("404 — Page Not Found")).toBeInTheDocument();
    expect(screen.getByText("பக்கம் காணப்படவில்லை")).toBeInTheDocument();

    const homeLink = screen.getByText(/Return to Home/);
    expect(homeLink.closest("a")).toHaveAttribute("href", "/home");
  });
});
