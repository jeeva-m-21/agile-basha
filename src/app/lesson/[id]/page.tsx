"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SanskritText } from "@/components/sanskrit/SanskritText";
import { LessonProgressBar } from "@/components/lesson/LessonProgressBar";
import { OptionCard } from "@/components/lesson/OptionCard";
import { FeedbackSheet } from "@/components/lesson/FeedbackSheet";
import { level0Lesson1, type LessonContent, type LessonStepData } from "@/lib/curriculum/lesson1";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { Volume2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const { language } = useTranslation();
  const preferences = usePreferencesStore();

  const [lesson, setLesson] = useState<LessonContent>(level0Lesson1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);

  // Exercise state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  useEffect(() => {
    preferences.loadPreferences();

    const lessonId = params?.id as string;
    if (lessonId) {
      fetch(`/api/lessons/${lessonId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.lesson) setLesson(data.lesson);
        })
        .catch(() => {});
    }
  }, [params?.id]);

  const isTamil = language === "ta";
  const currentStep = lesson.steps[currentStepIndex];
  const totalSteps = lesson.steps.length;

  const handleNextStep = async () => {
    setIsAnswerChecked(false);
    setFeedback(null);
    setSelectedOptionId(null);
    setSelectedTokenIndex(null);

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed lesson
      try {
        await fetch(`/api/lessons/${lesson.id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id }),
        });
      } catch {}
      router.push("/home");
    }
  };

  const handleCheckAnswer = async () => {
    if (!selectedOptionId || currentStep.type !== "exercise") return;

    try {
      const res = await fetch(`/api/lessons/${lesson.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: currentStep.id,
          selectedOptionId,
        }),
      });

      const data = await res.json();
      const isCorrect = data.correct;
      const explanation = isTamil ? data.explanationTa : data.explanationEn;

      setIsAnswerChecked(true);
      setFeedback({ isCorrect, explanation });
    } catch {
      // Offline fallback check
      const ex = currentStep.content;
      const isCorrect = ex.correctOptionId === selectedOptionId;
      setIsAnswerChecked(true);
      setFeedback({
        isCorrect,
        explanation: isTamil ? ex.explanationTa : ex.explanationEn,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* Top Header with Progress Bar and Close (✕) */}
      <header className="w-full bg-[var(--surface)] border-b border-[var(--line)] sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4">
          <LessonProgressBar
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            onClose={() => router.push("/home")}
          />
        </div>
      </header>

      {/* Main Lesson Body */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between">
        <div className="w-full">
          {/* STEP 1: SEE IT */}
          {currentStep.type === "see_it" && (
            <div className="animate-fadeIn space-y-6 text-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--mayura)]">
                  {isTamil ? currentStep.titleTa : currentStep.titleEn}
                </span>
                <h1 className="text-2xl font-bold mt-1 text-[var(--ink)]">
                  {isTamil ? lesson.titleTa : lesson.titleEn}
                </h1>
                <p className="text-xs text-[var(--ink-2)] mt-1">
                  {isTamil ? lesson.goalTa : lesson.goalEn}
                </p>
              </div>

              {/* Big Sanskrit Display Card */}
              <Card variant="flat" className="p-8 bg-[var(--surface)] shadow-xs">
                <SanskritText
                  script={preferences.script}
                  size="hero"
                  helperText={
                    preferences.helperLine !== "off"
                      ? currentStep.content.transliteration
                      : undefined
                  }
                >
                  {preferences.script === "tamil"
                    ? currentStep.content.tamilScript
                    : currentStep.content.sanskrit}
                </SanskritText>

                <div className="mt-6 pt-4 border-t border-[var(--line)] text-sm text-[var(--ink-2)]">
                  {isTamil
                    ? currentStep.content.translationTa
                    : currentStep.content.translationEn}
                </div>
              </Card>
            </div>
          )}

          {/* STEP 2: NOTICE IT */}
          {currentStep.type === "notice_it" && (
            <div className="animate-fadeIn space-y-5">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--mayura)]">
                  {isTamil ? currentStep.titleTa : currentStep.titleEn}
                </span>
                <h1 className="text-xl font-bold mt-1 text-[var(--ink)]">
                  {isTamil
                    ? currentStep.content.instructionTa
                    : currentStep.content.instructionEn}
                </h1>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {currentStep.content.tokens.map((token: any, idx: number) => {
                  const isSelected = selectedTokenIndex === idx;

                  return (
                    <button
                      key={token.char}
                      type="button"
                      onClick={() =>
                        setSelectedTokenIndex(isSelected ? null : idx)
                      }
                      className={`h-16 rounded-[14px] font-bold text-2xl border-2 transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-[var(--neel-tint)] border-[var(--neel)] text-[var(--neel-edge)] shadow-xs scale-105"
                          : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--surface-2)]"
                      }`}
                      data-testid={`notice-token-${token.char}`}
                    >
                      <span>{preferences.script === "tamil" ? token.tamil : token.char}</span>
                      <span className="text-[10px] font-normal text-[var(--ink-3)] -mt-1">
                        {token.iast}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedTokenIndex !== null ? (
                <Card variant="highlight" className="p-4 animate-fadeIn text-center space-y-1">
                  <div className="font-bold text-base text-[var(--ink)]">
                    {isTamil
                      ? currentStep.content.tokens[selectedTokenIndex].nameTa
                      : currentStep.content.tokens[selectedTokenIndex].nameEn}
                  </div>
                  <div className="text-xs text-[var(--ink-2)]">
                    {isTamil
                      ? currentStep.content.tokens[selectedTokenIndex].detailTa
                      : currentStep.content.tokens[selectedTokenIndex].detailEn}
                  </div>
                </Card>
              ) : (
                <div className="text-center text-xs text-[var(--ink-3)] italic py-2">
                  {isTamil ? "விவரம் காண ஒரு ஒலியைத் தட்டவும்" : "Tap any sound above to inspect details"}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: RULE */}
          {currentStep.type === "rule" && (
            <div className="animate-fadeIn space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--mayura)]">
                  {isTamil ? currentStep.titleTa : currentStep.titleEn}
                </span>
                <h1 className="text-xl font-bold mt-1 text-[var(--ink)]">
                  {isTamil
                    ? currentStep.content.headlineTa
                    : currentStep.content.headlineEn}
                </h1>
              </div>

              {/* Main Rule Card */}
              <Card variant="flat" className="p-5 border-2 border-[var(--line-strong)] space-y-2">
                <p className="text-sm text-[var(--ink)] leading-relaxed">
                  {isTamil ? currentStep.content.ruleTa : currentStep.content.ruleEn}
                </p>
              </Card>

              {/* Linguistic Bridge Card per DESIGN.md §6.11 */}
              <Card variant="bridge" className="p-4 space-y-1.5">
                <div className="text-xs font-bold text-[var(--mayura)] uppercase tracking-wider">
                  {isTamil
                    ? currentStep.content.bridgeTitleTa
                    : currentStep.content.bridgeTitleEn}
                </div>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  {isTamil
                    ? currentStep.content.bridgeTextTa
                    : currentStep.content.bridgeTextEn}
                </p>
              </Card>
            </div>
          )}

          {/* STEP 4, 5, 6: EXERCISE */}
          {currentStep.type === "exercise" && (
            <div className="animate-fadeIn space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--mayura)]">
                  {isTamil ? currentStep.titleTa : currentStep.titleEn}
                </span>
                <h2 className="text-xl font-bold mt-1 text-[var(--ink)] leading-snug">
                  {isTamil
                    ? currentStep.content.promptTa
                    : currentStep.content.promptEn}
                </h2>
              </div>

              {/* Options list */}
              <div className="space-y-3 pt-2">
                {currentStep.content.options.map((opt: any) => {
                  let status: "idle" | "correct" | "incorrect" = "idle";
                  if (isAnswerChecked && feedback) {
                    if (opt.id === currentStep.content.correctOptionId) {
                      status = "correct";
                    } else if (opt.id === selectedOptionId) {
                      status = "incorrect";
                    }
                  }

                  return (
                    <OptionCard
                      key={opt.id}
                      id={opt.id}
                      text={opt.text}
                      helper={opt.helper}
                      isSelected={selectedOptionId === opt.id}
                      status={status}
                      onSelect={() => {
                        if (!isAnswerChecked) setSelectedOptionId(opt.id);
                      }}
                      disabled={isAnswerChecked}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: RECAP */}
          {currentStep.type === "recap" && (
            <div className="animate-fadeIn space-y-6 text-center">
              <div className="w-16 h-16 rounded-[20px] bg-[var(--tulsi-tint)] text-[var(--tulsi)] border-2 border-[var(--tulsi)] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[var(--ink)]">
                  {isTamil ? currentStep.titleTa : currentStep.titleEn}
                </h1>
                <p className="text-sm font-semibold text-[var(--mayura)] mt-1">
                  {isTamil
                    ? currentStep.content.achievementTa
                    : currentStep.content.achievementEn}
                </p>
              </div>

              <Card variant="flat" className="p-5 text-left space-y-3">
                <div className="text-xs uppercase font-bold text-[var(--ink-3)] tracking-wider">
                  {isTamil ? "நீங்கள் கற்றவை:" : "What you learned:"}
                </div>
                <ul className="space-y-2 text-xs text-[var(--ink-2)]">
                  {(isTamil
                    ? currentStep.content.recapPointsTa
                    : currentStep.content.recapPointsEn
                  ).map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--tulsi)] font-bold">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-6">
          {currentStep.type === "exercise" ? (
            !isAnswerChecked ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full text-lg shadow-sm"
                onClick={handleCheckAnswer}
                disabled={!selectedOptionId}
                data-testid="lesson-check-btn"
              >
                {isTamil ? "சரிபார்க்க" : "Check"}
              </Button>
            ) : null
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full text-lg shadow-sm"
              onClick={handleNextStep}
              data-testid="lesson-continue-btn"
            >
              {currentStep.type === "recap"
                ? isTamil
                  ? "முடிந்தது (Finish)"
                  : "Finish lesson"
                : isTamil
                ? "தொடர்க"
                : "Continue"}
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          )}
        </div>

        {/* Feedback Sheet for Exercises */}
        {isAnswerChecked && feedback && (
          <FeedbackSheet
            isCorrect={feedback.isCorrect}
            explanation={feedback.explanation}
            onContinue={handleNextStep}
            continueText={isTamil ? "அடுத்தது" : "Continue"}
          />
        )}
      </main>
    </div>
  );
}
