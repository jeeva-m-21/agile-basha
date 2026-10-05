"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SanskritText } from "@/components/sanskrit/SanskritText";
import { AudioButton } from "@/components/sanskrit/AudioButton";
import { SyllableHighlight } from "@/components/sanskrit/SyllableHighlight";
import { LessonProgressBar } from "@/components/lesson/LessonProgressBar";
import { OptionCard } from "@/components/lesson/OptionCard";
import { FeedbackSheet } from "@/components/lesson/FeedbackSheet";
import { FillBlankExercise } from "@/components/lesson/exercises/FillBlankExercise";
import { MatchExercise } from "@/components/lesson/exercises/MatchExercise";
import { BuildSentenceExercise } from "@/components/lesson/exercises/BuildSentenceExercise";
import { TransliterateExercise } from "@/components/lesson/exercises/TransliterateExercise";
import { validateAnswer } from "@/lib/exercises/validation";
import { level0Lesson1, type LessonContent, type LessonStepData } from "@/lib/curriculum/lesson1";
import { level0Lesson2 } from "@/lib/curriculum/lesson2";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { useAudio } from "@/hooks/useAudio";
import { enqueueOfflineAction } from "@/lib/offline/queue";
import { OfflineBanner } from "@/components/offline/OfflineBanner";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const { language } = useTranslation();
  const preferences = usePreferencesStore();
  const audio = useAudio();

  const [lesson, setLesson] = useState<LessonContent>(() => {
    if (params?.id === "level-0-lesson-2") return level0Lesson2;
    return level0Lesson1;
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);

  // Exercise state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Array<{ leftId: string; rightId: string }>>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation: string;
    alsoCorrect?: string;
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
    audio.stop();
    setIsAnswerChecked(false);
    setFeedback(null);
    setSelectedOptionId(null);
    setSelectedTileIds([]);
    setMatchedPairs([]);
    setSelectedTokenIndex(null);

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed lesson
      try {
        const res = await fetch(`/api/lessons/${lesson.id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id }),
        });
        if (!res.ok) throw new Error("Complete failed");
      } catch {
        // Enqueue completion action for sync on reconnect
        await enqueueOfflineAction("lesson_complete", `/api/lessons/${lesson.id}/complete`, {
          lessonId: lesson.id,
        });
      }
      router.push("/home");
    }
  };

  const handleCheckAnswer = async () => {
    if (currentStep.type !== "exercise") return;

    const exercise = currentStep.content;
    const isBuildSentence = exercise.exerciseType === "build_sentence";
    const isMatch = exercise.exerciseType === "match";

    const payload: any = { stepId: currentStep.id };
    if (isBuildSentence) {
      payload.selectedTileIds = selectedTileIds;
    } else if (isMatch) {
      payload.matchedPairs = matchedPairs;
    } else {
      payload.selectedOptionId = selectedOptionId;
    }

    try {
      const res = await fetch(`/api/lessons/${lesson.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Answer API error");

      const data = await res.json();
      const isCorrect = data.correct;
      const explanation = isTamil ? data.explanationTa : data.explanationEn;
      const alsoCorrect = isTamil ? data.alsoCorrectTa : data.alsoCorrectEn;

      setIsAnswerChecked(true);
      setFeedback({ isCorrect, explanation, alsoCorrect });
    } catch {
      // Offline fallback check using local validation
      const result = validateAnswer(exercise, payload);
      setIsAnswerChecked(true);
      setFeedback({
        isCorrect: result.correct,
        explanation: isTamil ? result.explanationTa : result.explanationEn,
        alsoCorrect: isTamil ? result.alsoCorrectTa : result.alsoCorrectEn,
      });
      // Enqueue answer for sync when back online
      await enqueueOfflineAction("lesson_answer", `/api/lessons/${lesson.id}/answer`, payload);
    }
  };

  const isCheckDisabled = () => {
    if (currentStep.type !== "exercise") return true;
    const type = currentStep.content.exerciseType;
    if (type === "build_sentence") {
      return selectedTileIds.length === 0;
    }
    if (type === "match") {
      return matchedPairs.length < (currentStep.content.pairs?.length || 0);
    }
    return !selectedOptionId;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      <OfflineBanner />
      {/* Top Header with Progress Bar and Close (✕) */}
      <header className="w-full bg-[var(--surface)] border-b border-[var(--line)] sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4">
          <LessonProgressBar
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            onClose={() => {
              audio.stop();
              router.push("/home");
            }}
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

              {/* Big Sanskrit Display Card with Syllable Highlight sync */}
              <Card variant="flat" className="p-8 bg-[var(--surface)] shadow-xs space-y-6">
                {currentStep.content.syllables ? (
                  <SyllableHighlight
                    syllables={currentStep.content.syllables}
                    activeIndex={audio.activeSyllableIndex}
                    script={preferences.script}
                    showHelper={preferences.helperLine !== "off"}
                    onSyllableClick={(idx) => {
                      const s = currentStep.content.syllables[idx];
                      audio.playSingle(s.iast, s.isLong);
                    }}
                  />
                ) : (
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
                )}

                {/* 64px Audio Button & 44px Turtle Slow Companion per DESIGN.md §6.6 */}
                <div className="flex flex-col items-center gap-2 pt-2">
                  <AudioButton
                    onPlay={() => {
                      if (currentStep.content.syllables) {
                        audio.playSyllables(currentStep.content.syllables);
                      } else {
                        audio.playSingle("a", false);
                      }
                    }}
                    isPlaying={audio.isPlaying}
                    isSlow={audio.isSlow}
                    onToggleSlow={audio.toggleSlow}
                  />
                  <span className="text-[11px] font-semibold text-[var(--ink-3)]">
                    {audio.isSlow
                      ? isTamil
                        ? "மெதுவான வேகம் (0.7x)"
                        : "Slow speed (0.7x)"
                      : isTamil
                      ? "ஒலி கேட்க தட்டவும்"
                      : "Tap to hear pronunciation"}
                  </span>
                </div>

                <div className="pt-4 border-t border-[var(--line)] text-sm text-[var(--ink-2)]">
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
                      onClick={() => {
                        setSelectedTokenIndex(isSelected ? null : idx);
                        audio.playSingle(token.iast, token.nameEn.includes("Long"));
                      }}
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
                  {isTamil ? "ஒலியைக் கேட்கவும் விவரம் காணவும் தட்டவும்" : "Tap any sound above to hear and inspect details"}
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

          {/* EXERCISES: ALL TYPES */}
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

              {/* 1. Listen & Choose Exercise */}
              {currentStep.content.exerciseType === "listen_choose" && (
                <div className="flex flex-col items-center justify-center p-4 bg-[var(--surface)] rounded-[16px] border border-[var(--line)] space-y-2">
                  <AudioButton
                    onPlay={() =>
                      audio.playSingle(
                        currentStep.content.soundToPlay,
                        currentStep.content.soundIsLong
                      )
                    }
                    isPlaying={audio.isPlaying}
                    isSlow={audio.isSlow}
                    onToggleSlow={audio.toggleSlow}
                  />
                  <span className="text-xs text-[var(--ink-2)] font-medium">
                    {isTamil ? "ஒலியைக் கேட்க தட்டவும்" : "Tap speaker to listen"}
                  </span>
                </div>
              )}

              {/* 2. Fill the Blank Exercise */}
              {currentStep.content.exerciseType === "fill_blank" && (
                <FillBlankExercise
                  sentenceBefore={currentStep.content.sentenceBefore}
                  sentenceAfter={currentStep.content.sentenceAfter}
                  options={currentStep.content.options}
                  selectedOptionId={selectedOptionId}
                  onSelectOption={(optId) => {
                    if (!isAnswerChecked) setSelectedOptionId(optId);
                  }}
                  status={isAnswerChecked ? (feedback?.isCorrect ? "correct" : "incorrect") : "idle"}
                  correctOptionId={currentStep.content.correctOptionId}
                  disabled={isAnswerChecked}
                  script={preferences.script}
                />
              )}

              {/* 3. Match Pairs Exercise */}
              {currentStep.content.exerciseType === "match" && (
                <MatchExercise
                  pairs={currentStep.content.pairs}
                  onMatchesChange={(matched) => setMatchedPairs(matched)}
                  disabled={isAnswerChecked}
                />
              )}

              {/* 4. Build Sentence Exercise */}
              {currentStep.content.exerciseType === "build_sentence" && (
                <BuildSentenceExercise
                  tiles={currentStep.content.tiles}
                  selectedTileIds={selectedTileIds}
                  onSelectedTilesChange={(ids) => {
                    if (!isAnswerChecked) setSelectedTileIds(ids);
                  }}
                  disabled={isAnswerChecked}
                  promptTranslation={
                    isTamil
                      ? currentStep.content.promptTranslationTa
                      : currentStep.content.promptTranslationEn
                  }
                  status={isAnswerChecked ? (feedback?.isCorrect ? "correct" : "incorrect") : "idle"}
                  alsoCorrectNotice={feedback?.alsoCorrect}
                />
              )}

              {/* 5. Transliterate Exercise */}
              {currentStep.content.exerciseType === "transliterate" && (
                <TransliterateExercise
                  sourceText={currentStep.content.sourceText}
                  sourceScriptLabel={currentStep.content.sourceScriptLabel || "Devanāgarī"}
                  targetScriptLabel={
                    currentStep.content.targetScriptLabel ||
                    (preferences.script === "tamil" ? "Tamil" : "IAST")
                  }
                  options={currentStep.content.options}
                  selectedOptionId={selectedOptionId}
                  onSelectOption={(optId) => {
                    if (!isAnswerChecked) setSelectedOptionId(optId);
                  }}
                  status={isAnswerChecked ? (feedback?.isCorrect ? "correct" : "incorrect") : "idle"}
                  correctOptionId={currentStep.content.correctOptionId}
                  disabled={isAnswerChecked}
                />
              )}

              {/* 6. Standard Option List (read_script, listen_choose) */}
              {(currentStep.content.exerciseType === "read_script" ||
                currentStep.content.exerciseType === "listen_choose") && (
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
                          if (!isAnswerChecked) {
                            setSelectedOptionId(opt.id);
                            // Play sound preview if short vowel
                            audio.playSingle(opt.helper || opt.text, opt.text === "आ" || opt.text === "ई");
                          }
                        }}
                        disabled={isAnswerChecked}
                      />
                    );
                  })}
                </div>
              )}
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
                disabled={isCheckDisabled()}
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
            alsoCorrect={feedback.alsoCorrect}
            onContinue={handleNextStep}
            continueText={isTamil ? "அடுத்தது" : "Continue"}
          />
        )}
      </main>
    </div>
  );
}
