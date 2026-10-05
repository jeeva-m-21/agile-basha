"use client";

import React, { useState, useRef, useEffect } from "react";
import { TutorContext, TutorReference } from "@/lib/ai/tutor";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/provider";
import {
  Sparkles,
  X,
  Send,
  Flag,
  BookOpen,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: TutorReference[];
  timestamp: string;
  isReported?: boolean;
}

interface TutorChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: TutorContext;
}

export function TutorChatPanel({ isOpen, onClose, context }: TutorChatPanelProps) {
  const { language } = useTranslation();
  const isTamil = language === "ta";

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome-1",
      role: "assistant",
      content: isTamil
        ? "வணக்கம்! நான் உங்கள் சமஸ்கிருத AI ஆசிரியர் (Bhāṣā Tutor). பாடங்கள், சொற்கள், வேற்றுமை வடிவங்கள் அல்லது இலக்கண விதிகள் குறித்து எந்தக் கேள்வியும் கேளுங்கள்!"
        : "Namaste! I am your Bhāṣā Sanskrit AI Tutor. Ask me any question about lesson concepts, case endings, word roots, or grammar rules!",
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quotaRemaining, setQuotaRemaining] = useState(20);
  const [followUps, setFollowUps] = useState<string[]>(() =>
    isTamil
      ? ["ராமேண ஏன் வருகிறது?", "க³ச்ச²தி சொல்லின் வேர் என்ன?", "ஒரு வினாடி வினா கேள்"]
      : ["Why is it रामेण here?", "What is the root of gacchati?", "Quiz me on this case"]
  );

  // Reporting modal state
  const [reportingMsgId, setReportingMsgId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("Inaccurate grammar explanation");
  const [reportSuccess, setReportSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsgId = `usr-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsLoading(true);

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const offlineMsg: ChatMessage = {
        id: `offline-${Date.now()}`,
        role: "assistant",
        content: isTamil
          ? "AI ஆசிரியர் சேவைக்கு இணைய இணைப்பு தேவை. உங்கள் சாதனம் ஆஃப்லைனில் உள்ளது. பாடங்களையும் சொற்களஞ்சியத்தையும் ஆஃப்லைனில் பயிற்சி செய்யலாம்!"
          : "The AI Tutor requires an active internet connection. You are currently offline. Downloaded lessons and review are still available!",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, offlineMsg]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context,
          language: isTamil ? "ta" : "en",
        }),
      });

      const data = await res.json();

      if (res.ok && data?.answer) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          references: data.references,
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (typeof data.quotaRemaining === "number") {
          setQuotaRemaining(data.quotaRemaining);
        }
        if (data.suggestedFollowUps && data.suggestedFollowUps.length > 0) {
          setFollowUps(data.suggestedFollowUps);
        }
      } else {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: data?.error || (isTamil ? "பதிலை உருவாக்குவதில் பிழை ஏற்பட்டது." : "Could not generate answer."),
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: isOffline
          ? isTamil
            ? "AI ஆசிரியர் சேவைக்கு இணைய இணைப்பு தேவை. உங்கள் சாதனம் தற்போது ஆஃப்லைனில் உள்ளது."
            : "AI Tutor requires an internet connection. You are currently offline."
          : isTamil
          ? "இணைப்பில் பிழை ஏற்பட்டது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
          : "Network error. Please try asking again in a moment.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportingMsgId) return;

    try {
      await fetch("/api/tutor/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: reportingMsgId,
          reason: reportReason,
        }),
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === reportingMsgId ? { ...m, isReported: true } : m))
      );
      setReportSuccess(true);
      setTimeout(() => {
        setReportingMsgId(null);
        setReportSuccess(false);
      }, 1500);
    } catch {
      setReportingMsgId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
      data-testid="tutor-chat-panel"
    >
      <div className="w-full max-w-md h-[85vh] max-h-[640px] bg-[var(--surface)] border-t sm:border border-[var(--line-strong)] rounded-t-[24px] sm:rounded-[20px] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-3.5 border-b border-[var(--line)] bg-[var(--surface-2)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[var(--ink)]">
                  {isTamil ? "AI ஆசிரியர்" : "Ask the Tutor"}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-[var(--primary-tint)] text-[var(--primary)] border border-[var(--primary)]">
                  AI tutor
                </span>
              </div>
              <div className="text-[10px] text-[var(--ink-3)] font-medium">
                {isTamil
                  ? `இன்று ${quotaRemaining} கேள்விகள் மீதமுள்ளன`
                  : `${quotaRemaining} questions left today`}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
            data-testid="close-tutor-panel-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Banner if active */}
        {context && (
          <div className="px-3.5 py-1.5 bg-[var(--surface)] border-b border-[var(--line)] text-[11px] text-[var(--ink-2)] flex items-center gap-1.5 overflow-hidden">
            <span className="font-bold text-[var(--ink-3)] uppercase tracking-wider shrink-0">
              {isTamil ? "சூழல்:" : "Context:"}
            </span>
            <span className="truncate italic">
              {context.lessonTitle || context.sentence || context.word || "Active screen"}
            </span>
          </div>
        )}

        {/* Messages List */}
        <div
          className="flex-1 p-3.5 overflow-y-auto space-y-3.5"
          data-testid="tutor-messages-container"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
              data-testid={`tutor-message-${msg.role}`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--primary)] border border-[var(--line)]">
                    AI tutor
                  </span>
                </div>
              )}

              <div
                className={`max-w-[88%] p-3 rounded-[16px] text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  msg.role === "user"
                    ? "bg-[var(--primary)] text-white rounded-br-[4px]"
                    : "bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)] rounded-bl-[4px]"
                }`}
              >
                {msg.content}

                {/* References / Links back to Lessons or Grammar */}
                {msg.references && msg.references.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[var(--line)] space-y-1">
                    <span className="text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-wider block">
                      {isTamil ? "தொடர்புடைய குறிப்புகள்:" : "Related References:"}
                    </span>
                    {msg.references.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref.url}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] hover:underline block"
                        data-testid={`tutor-ref-link-${idx}`}
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{ref.title}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Action row: Report a problem on AI responses per SPEC §12.3 */}
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  {msg.isReported ? (
                    <span className="text-[10px] text-[var(--tulsi)] font-medium inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {isTamil ? "புகார் பதிவு செய்யப்பட்டது" : "Reported"}
                    </span>
                  ) : (
                    <button
                      onClick={() => setReportingMsgId(msg.id)}
                      className="text-[10px] text-[var(--ink-3)] hover:text-[var(--sindoor)] transition-colors inline-flex items-center gap-1"
                      data-testid={`report-problem-btn-${msg.id}`}
                    >
                      <Flag className="w-3 h-3" />
                      <span>{isTamil ? "சிக்கலைத் தெரிவி" : "Report a problem"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-1.5 p-3 rounded-[16px] bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--ink-3)] w-28 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary)] animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Follow-Up Chips */}
        {followUps.length > 0 && !isLoading && (
          <div className="px-3.5 py-1.5 bg-[var(--surface)] border-t border-[var(--line)] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {followUps.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--primary)] border border-[var(--line)] whitespace-nowrap"
                data-testid={`tutor-followup-chip-${i}`}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-[var(--line)] bg-[var(--surface-2)] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={
              isTamil
                ? "கேள்வி கேளுங்கள் (Ask question)..."
                : "Ask about word forms, roots, rules..."
            }
            className="flex-1 px-3.5 py-2 rounded-[12px] bg-[var(--surface)] border border-[var(--line-strong)] text-xs sm:text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] transition-all"
            data-testid="tutor-chat-input"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-[12px] bg-[var(--primary)] text-white hover:brightness-105 disabled:opacity-40 disabled:hover:brightness-100 transition-all shadow-xs"
            data-testid="tutor-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Report Problem Modal per SPEC §12.3 */}
      {reportingMsgId && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          data-testid="report-problem-modal"
        >
          <Card
            variant="flat"
            className="w-full max-w-sm p-4 bg-[var(--surface)] border-2 border-[var(--line-strong)] space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                <AlertCircle className="w-4 h-4 text-[var(--sindoor)]" />
                <span>{isTamil ? "சிக்கலைத் தெரிவி" : "Report a Problem"}</span>
              </div>
              <button
                onClick={() => setReportingMsgId(null)}
                className="text-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 text-center text-xs text-[var(--tulsi)] font-bold">
                {isTamil
                  ? "நன்றி! உங்கள் அறிக்கை மதிப்பாய்வுக்கு அனுப்பப்பட்டது."
                  : "Thank you! Your feedback has been sent to our academic review team."}
              </div>
            ) : (
              <>
                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-[var(--ink-2)]">
                    {isTamil ? "காரணத்தைத் தேர்ந்தெடுக்கவும்:" : "Reason for report:"}
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 rounded-[8px] bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--ink)]"
                    data-testid="report-reason-select"
                  >
                    <option value="Inaccurate grammar explanation">Inaccurate grammar explanation</option>
                    <option value="Wrong case or root identified">Wrong case or root identified</option>
                    <option value="Confusing or unclear wording">Confusing or unclear wording</option>
                    <option value="Other issue">Other issue</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReportingMsgId(null)}
                    className="text-xs"
                  >
                    {isTamil ? "ரத்து" : "Cancel"}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleReport}
                    className="text-xs"
                    data-testid="submit-report-btn"
                  >
                    {isTamil ? "அனுப்பு" : "Submit Report"}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
