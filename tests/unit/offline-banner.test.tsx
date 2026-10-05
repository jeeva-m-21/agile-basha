import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { OfflineBanner } from "@/components/offline/OfflineBanner";
import { I18nProvider } from "@/i18n/provider";
import { enqueueOfflineAction, clearOfflineQueue } from "@/lib/offline/queue";

describe("OfflineBanner Component", () => {
  beforeEach(async () => {
    await clearOfflineQueue();
  });

  it("renders nothing when online and no sync message", () => {
    const { container } = render(
      <I18nProvider>
        <OfflineBanner />
      </I18nProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders quiet top banner when network is offline", async () => {
    render(
      <I18nProvider>
        <OfflineBanner />
      </I18nProvider>
    );

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    const banner = screen.getByRole("status");
    expect(banner).toBeInTheDocument();
    expect(
      screen.getByText("You're offline. Downloaded lessons are ready to practice.")
    ).toBeInTheDocument();
  });

  it("shows queued count badge when offline actions exist", async () => {
    await enqueueOfflineAction("lesson_answer", "/api/l1", { opt: 1 });
    await enqueueOfflineAction("lesson_answer", "/api/l2", { opt: 2 });

    render(
      <I18nProvider>
        <OfflineBanner />
      </I18nProvider>
    );

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(await screen.findByText("2 queued")).toBeInTheDocument();
  });
});
