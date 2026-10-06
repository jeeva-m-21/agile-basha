"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlacementQuizModal } from "@/components/placement/PlacementQuizModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/i18n/provider";
import { Sparkles, ArrowLeft, GraduationCap, CheckCircle } from "lucide-react";

export default function PlacementPage() {
  const router = useRouter();
  const { language } = useTranslation();
  const isTamil = language === "ta";
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
      <header className="w-full border-b border-[var(--line)] bg-[var(--surface)] sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/learn")}
            className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-2)] transition-colors"
            aria-label="Back to Learn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-bold text-sm text-[var(--ink)] flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[var(--mayura)]" />
            <span>{isTamil ? "நிலைத் தேர்வு" : "Placement Assessment"}</span>
          </div>
          <div className="w-8" />
        </div>
      </header>

      <main className="max-w-md w-full mx-auto p-4 flex-1 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[var(--haldi)] text-[var(--ink)] flex items-center justify-center shadow-md">
          <Sparkles className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--ink)]">
          {isTamil ? "உங்கள் சமஸ்கிருத நிலையை அறியுங்கள்" : "Find Your Sanskrit Starting Level"}
        </h1>

        <p className="text-sm text-[var(--ink-2)] max-w-sm">
          {isTamil
            ? "5 நிமிடத் தேர்வின் மூலம் உங்கள் முந்தைய அறிவை மதிப்பிட்டு, பொருத்தமான பாடத்திலிருந்து தொடங்கலாம்."
            : "Take a 5-minute diagnostic test to assess your existing Sanskrit knowledge and jump directly to the right lesson."}
        </p>

        <Card variant="flat" className="p-4 w-full text-left bg-[var(--surface)] space-y-2 border border-[var(--line-strong)]">
          <div className="text-xs font-bold text-[var(--mayura)] uppercase">
            {isTamil ? "மதிப்பீட்டுப் பகுதிகள்" : "What is assessed"}
          </div>
          <ul className="text-xs text-[var(--ink-2)] space-y-1.5">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--tulsi-ink)]" />
              <span>{isTamil ? "தேவநாகரி எழுத்துக்களும் உச்சரிப்பும்" : "Devanāgarī script reading & vowel sounds"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--tulsi-ink)]" />
              <span>{isTamil ? "அடிப்படைச் சொற்களஞ்சியம்" : "Core vocabulary & everyday nouns"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--tulsi-ink)]" />
              <span>{isTamil ? "நிகழ்கால வினைகள் & எழுவாய் பொருத்தம்" : "Present tense verbs & subject concord"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--tulsi-ink)]" />
              <span>{isTamil ? "வேற்றுமைகள் (த்விதீயா, த்ருதீயா)" : "Cases (Vibhakti) and sentence structure"}</span>
            </li>
          </ul>
        </Card>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setModalOpen(true)}
          className="w-full h-12 font-bold"
        >
          {isTamil ? "தேர்வைத் தொடங்குக" : "Launch Placement Test"}
        </Button>
      </main>

      <PlacementQuizModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={(evalResult) => {
          router.push(`/lesson/${evalResult.recommendedLesson}`);
        }}
      />
    </div>
  );
}
