"use client";

import React, { useState } from "react";
import { TutorChatPanel } from "./TutorChatPanel";
import { TutorContext } from "@/lib/ai/tutor";
import { Sparkles, MessageCircle } from "lucide-react";
import { useTranslation } from "@/i18n/provider";

interface TutorFloatingTriggerProps {
  context?: TutorContext;
}

export function TutorFloatingTrigger({ context }: TutorFloatingTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useTranslation();
  const isTamil = language === "ta";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 sm:right-6 z-40 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[var(--primary)] text-white shadow-lg hover:brightness-105 active:scale-95 transition-all select-none group border-2 border-white/20"
        aria-label="Ask Sanskrit AI Tutor"
        data-testid="tutor-floating-btn"
      >
        <Sparkles className="w-4 h-4 text-[var(--haldi)] group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-xs tracking-wide">
          {isTamil ? "AI ஆசிரியர்" : "Ask Tutor"}
        </span>
      </button>

      <TutorChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        context={context}
      />
    </>
  );
}
