"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SanskritText } from "@/components/sanskrit/SanskritText";
import { AudioButton } from "@/components/sanskrit/AudioButton";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import {
  placementQuestions,
  evaluatePlacementQuiz,
  type PlacementEvaluation,
} from "@/lib/curriculum/placement";
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
} from "lucide-react";

interface PlacementQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (evaluation: PlacementEvaluation) => void;
}

export function PlacementQuizModal({
  isOpen,
  onClose,
  onComplete,
}: PlacementQuizModalProps) {
  const { language } = useTranslation();
  const isTamil = language === "ta";
  const { script, helperLine, setPlacedLevel } = usePreferencesStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [evaluation, setEvaluation] = useState<PlacementEvaluation | null>(null);
  const [editedSkills, setEditedSkills] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentQ = placementQuestions[currentIndex];
  const isLastQuestion = currentIndex === placementQuestions.length - 1;

  const handleSelectOption = (optId: string) => {
    if (showExplanation) return;
    setSelectedOptionId(optId);
    setShowExplanation(true);

    const updatedAnswers = { ...answers, [currentQ.id]: optId };
    setAnswers(updatedAnswers);
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Evaluate quiz
      const result = evaluatePlacementQuiz(answers);
      setEvaluation(result);
      setEditedSkills(result.masteredSkills);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    }
  };

  const toggleMasteredSkill = (skill: string) => {
    setEditedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleConfirmResult = (overrideToZero = false) => {
    if (!evaluation) return;

    if (overrideToZero) {
      setPlacedLevel("level-0", "level-0-lesson-1");
    } else {
      setPlacedLevel(evaluation.recommendedLevel, evaluation.recommendedLesson);
    }

    if (onComplete) {
      onComplete(evaluation);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="placement-quiz-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      data-testid="placement-quiz-modal"
    >
      <Card
        variant="elevated"
        className="w-full max-w-lg bg-[var(--paper)] text-[var(--ink)] border-2 border-[var(--line-strong)] shadow-2xl rounded-[20px] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--mayura)]" />
            <h2 id="placement-quiz-heading" className="font-bold text-base text-[var(--ink)]">
              {isTamil ? "சமஸ்கிருத நிலை மதிப்பீடு" : "Sanskrit Placement Diagnostic"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close placement quiz"
            className="p-1 rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-2)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {!evaluation ? (
            /* Active Question State */
            <div className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink-2)] mb-1">
                  <span>
                    {isTamil ? "வினா" : "Question"} {currentIndex + 1} / {placementQuestions.length}
                  </span>
                  <span className="text-[var(--mayura)] font-bold">
                    {isTamil ? currentQ.topicTa : currentQ.topicEn}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--line)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--haldi)] transition-all duration-300 rounded-full"
                    style={{
                      width: `${((currentIndex + 1) / placementQuestions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Sanskrit Prompt Display */}
              <div className="p-4 rounded-[16px] bg-[var(--surface)] border border-[var(--line-strong)] text-center space-y-2">
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {isTamil ? currentQ.promptTa : currentQ.promptEn}
                </p>

                {currentQ.sanskrit && (
                  <div className="py-2 flex items-center justify-center gap-2">
                    <SanskritText
                      sanskrit={currentQ.sanskrit}
                      script={script}
                      helperLine={helperLine}
                      size="lg"
                      className="font-bold text-2xl text-[var(--ink)]"
                    />
                    {currentQ.audioText && (
                      <AudioButton text={currentQ.audioText} size="sm" />
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5" data-testid="placement-options">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.isCorrect;

                  let optionStyle =
                    "bg-[var(--surface)] border-[var(--line-strong)] hover:border-[var(--neel)] text-[var(--ink)]";

                  if (showExplanation) {
                    if (isCorrect) {
                      optionStyle =
                        "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--ink)] shadow-xs";
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        "bg-[var(--sindoor-tint)] border-[var(--sindoor)] text-[var(--ink)] shadow-xs";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={showExplanation}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-3.5 rounded-[14px] text-left border-2 transition-all flex items-center justify-between text-sm sm:text-base font-medium ${optionStyle}`}
                      data-testid={`option-${opt.id}`}
                    >
                      <div className="flex items-center gap-2">
                        {opt.sanskritOption && (
                          <span className="font-bold text-base px-2 py-0.5 rounded-md bg-[var(--surface-2)]">
                            {opt.sanskritOption}
                          </span>
                        )}
                        <span>{isTamil ? opt.textTa : opt.textEn}</span>
                      </div>

                      {showExplanation && (
                        <div>
                          {isCorrect && (
                            <Check className="w-5 h-5 text-[var(--tulsi-ink)] stroke-[3]" />
                          )}
                          {isSelected && !isCorrect && (
                            <X className="w-5 h-5 text-[var(--sindoor)] stroke-[3]" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Continue */}
              {showExplanation && (
                <div className="p-3.5 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line-strong)] animate-fadeIn space-y-3">
                  <p className="text-xs sm:text-sm text-[var(--ink-2)]">
                    {isTamil ? currentQ.explanationTa : currentQ.explanationEn}
                  </p>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="w-full h-11"
                    data-testid="placement-next-btn"
                  >
                    <span>{isLastQuestion ? (isTamil ? "முடிவுகளைக் காண்க" : "View Placement Results") : (isTamil ? "அடுத்த வினா" : "Next Question")}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-5 animate-fadeIn" data-testid="placement-results-screen">
              {/* Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--haldi)] text-[var(--ink)] shadow-md">
                  <Award className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--mayura)]">
                  {isTamil ? "மதிப்பீடு நிறைவுற்றது" : "Diagnostic Complete"}
                </div>
                <h3 className="text-2xl font-bold text-[var(--ink)]">
                  {isTamil ? evaluation.levelNameTa : evaluation.levelNameEn}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-2)] max-w-sm mx-auto">
                  {isTamil ? evaluation.summaryTa : evaluation.summaryEn}
                </p>
              </div>

              {/* Score card */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-[16px] bg-[var(--surface)] border border-[var(--line-strong)]">
                <div className="text-center p-2">
                  <div className="text-2xl font-bold text-[var(--neel)]">
                    {evaluation.score} / {evaluation.totalQuestions}
                  </div>
                  <div className="text-xs text-[var(--ink-3)] font-medium">
                    {isTamil ? "சரியான விடைகள்" : "Score"}
                  </div>
                </div>
                <div className="text-center p-2">
                  <div className="text-2xl font-bold text-[var(--tulsi-ink)]">
                    {evaluation.percentage}%
                  </div>
                  <div className="text-xs text-[var(--ink-3)] font-medium">
                    {isTamil ? "தேர்ச்சி விழுக்காடு" : "Accuracy"}
                  </div>
                </div>
              </div>

              {/* Mastered Skills List with interactive edit toggles per SPEC §5.3 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--ink-2)] uppercase">
                  <span>{isTamil ? "உங்களுக்குத் தெரிந்த தலைப்புகள்" : "Topics You Know"}</span>
                  <span className="text-[11px] normal-case text-[var(--ink-3)]">
                    {isTamil ? "(திருத்த தட்டவும்)" : "(Tap to customize)"}
                  </span>
                </div>

                <div className="space-y-1.5" data-testid="mastered-skills-list">
                  {placementQuestions.map((q) => {
                    const isMastered = editedSkills.includes(q.topicEn);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => toggleMasteredSkill(q.topicEn)}
                        className={`w-full p-2.5 rounded-[12px] border text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          isMastered
                            ? "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--ink)]"
                            : "bg-[var(--surface)] border-[var(--line)] text-[var(--ink-3)] line-through"
                        }`}
                        data-testid={`skill-toggle-${q.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-sm flex items-center justify-center ${
                              isMastered
                                ? "bg-[var(--tulsi)] text-white"
                                : "border border-[var(--line-strong)]"
                            }`}
                          >
                            {isMastered && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{isTamil ? q.topicTa : q.topicEn}</span>
                        </div>
                        <span className="text-[10px] text-[var(--ink-2)]">
                          {isMastered ? (isTamil ? "அறிந்தது" : "Mastered") : (isTamil ? "பயில வேண்டும்" : "Needs practice")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleConfirmResult(false)}
                  className="w-full h-12 text-sm sm:text-base font-bold shadow-md"
                  data-testid="placement-confirm-btn"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>
                    {isTamil
                      ? `பரிந்துரைக்கப்பட்ட நிலையிலிருந்து தொடங்குக`
                      : `Start at ${evaluation.recommendedLevel.toUpperCase()}`}
                  </span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>

                {/* Override button per SPEC §5.3 */}
                <button
                  type="button"
                  onClick={() => handleConfirmResult(true)}
                  className="w-full py-2.5 text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] flex items-center justify-center gap-1.5 transition-colors"
                  data-testid="placement-override-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {isTamil
                      ? "தொடக்கத்திலிருந்து தொடங்கவும் (நிலை 0)"
                      : "Start from the beginning instead (Level 0)"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
