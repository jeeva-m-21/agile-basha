import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TutorFloatingTrigger } from "@/components/tutor/TutorFloatingTrigger";
import { I18nProvider } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";

describe("AI Tutor UI & Interaction (SPEC §12)", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
    usePreferencesStore.setState({
      learnIn: "en",
      script: "devanagari",
      helperLine: "roman",
      dailyGoalMin: 10,
    });
  });

  const renderTutor = (context?: any) => {
    return render(
      <I18nProvider>
        <TutorFloatingTrigger context={context} />
      </I18nProvider>
    );
  };

  it("renders floating trigger button and opens TutorChatPanel upon click", () => {
    renderTutor({ type: "lesson", lessonTitle: "Lesson 2: Sentence Building" });

    const triggerBtn = screen.getByTestId("tutor-floating-btn");
    expect(triggerBtn).toBeInTheDocument();

    // Click trigger
    fireEvent.click(triggerBtn);

    expect(screen.getByTestId("tutor-chat-panel")).toBeInTheDocument();
    expect(screen.getByText(/20 questions left today/i)).toBeInTheDocument();
    expect(screen.getByText(/Lesson 2: Sentence Building/i)).toBeInTheDocument();
  });

  it("sends user question and renders AI Tutor grounded response with badge", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        answer: "Rāmeṇa is the instrumental singular form.",
        label: "AI tutor",
        references: [
          {
            type: "grammar_rule",
            id: "tritiya-vibhakti",
            title: "Tṛtīyā Vibhakti",
            url: "/dictionary?slug=tritiya-vibhakti",
          },
        ],
        quotaRemaining: 19,
        dailyQuota: 20,
      }),
    });

    renderTutor();
    fireEvent.click(screen.getByTestId("tutor-floating-btn"));

    const input = screen.getByTestId("tutor-chat-input");
    fireEvent.change(input, { target: { value: "Why is it रामेण here?" } });

    const sendBtn = screen.getByTestId("tutor-send-btn");
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/Rāmeṇa is the instrumental singular form/i)).toBeInTheDocument();
      expect(screen.getByTestId("tutor-ref-link-0")).toBeInTheDocument();
      expect(screen.getByText(/19 questions left today/i)).toBeInTheDocument();
    });
  });

  it("allows opening Report a Problem modal on AI tutor answer and submitting report", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          answer: "Gacchati is from root gam.",
          label: "AI tutor",
          references: [],
          quotaRemaining: 18,
          dailyQuota: 20,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: "Report submitted",
        }),
      });

    renderTutor();
    fireEvent.click(screen.getByTestId("tutor-floating-btn"));

    // Send question
    const input = screen.getByTestId("tutor-chat-input");
    fireEvent.change(input, { target: { value: "What is root?" } });
    fireEvent.click(screen.getByTestId("tutor-send-btn"));

    await waitFor(() => {
      expect(screen.getByText("Gacchati is from root gam.")).toBeInTheDocument();
    });

    // Click Report a problem on the new message
    const reportBtns = screen.getAllByText(/report a problem/i);
    fireEvent.click(reportBtns[reportBtns.length - 1]);

    // Modal appears
    await waitFor(() => {
      expect(screen.getByTestId("report-problem-modal")).toBeInTheDocument();
      expect(screen.getByTestId("submit-report-btn")).toBeInTheDocument();
    });

    // Submit report
    fireEvent.click(screen.getByTestId("submit-report-btn"));

    await waitFor(() => {
      expect(screen.getByText(/thank you! your feedback has been sent/i)).toBeInTheDocument();
    });
  });
});
