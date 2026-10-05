import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";
import { I18nProvider } from "@/i18n/provider";

describe("InstallPromptBanner Component", () => {
  it("renders nothing initially until beforeinstallprompt is triggered", () => {
    const { container } = render(
      <I18nProvider>
        <InstallPromptBanner />
      </I18nProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders install banner when beforeinstallprompt event fires", async () => {
    render(
      <I18nProvider>
        <InstallPromptBanner />
      </I18nProvider>
    );

    const promptMock = vi.fn().mockResolvedValue(undefined);
    const event = new Event("beforeinstallprompt") as any;
    event.prompt = promptMock;
    event.userChoice = Promise.resolve({ outcome: "accepted", platform: "web" });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(screen.getByText("Install Bhāṣā App")).toBeInTheDocument();
    expect(screen.getByText("Install Now")).toBeInTheDocument();

    // Click install button
    await act(async () => {
      fireEvent.click(screen.getByText("Install Now"));
    });

    expect(promptMock).toHaveBeenCalled();
  });

  it("dismisses banner when 'Not now' is clicked", () => {
    render(
      <I18nProvider>
        <InstallPromptBanner />
      </I18nProvider>
    );

    const event = new Event("beforeinstallprompt") as any;
    event.prompt = vi.fn();
    event.userChoice = Promise.resolve({ outcome: "dismissed" });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(screen.getByText("Install Bhāṣā App")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Not now"));

    expect(screen.queryByText("Install Bhāṣā App")).not.toBeInTheDocument();
  });
});
