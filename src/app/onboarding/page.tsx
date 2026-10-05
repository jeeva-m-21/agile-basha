"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SanskritText, type SanskritScript } from "@/components/sanskrit/SanskritText";
import { useTranslation, type Language } from "@/i18n/provider";
import { usePreferencesStore } from "@/stores/preferencesStore";
import {
  ArrowLeft,
  Check,
  Sparkles,
  BookOpen,
  Scroll,
  GraduationCap,
  Clock,
  Compass,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const preferences = usePreferencesStore();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  useEffect(() => {
    preferences.loadPreferences();
  }, []);

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await preferences.completeOnboarding();
      setStep(7); // Complete view
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  };

  const scriptPreviews: Record<
    SanskritScript,
    { text: string; helper: string }
  > = {
    devanagari: { text: "रामः", helper: "rāmaḥ" },
    tamil: { text: "ராமஃ", helper: "rāmaḥ" },
    iast: { text: "rāmaḥ", helper: "रामः" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* Top Bar with Step Progress Dots & Navigation */}
      <header className="w-full border-b border-[var(--line)] bg-[var(--surface)] sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-2)] transition-colors"
            aria-label="Go back"
            data-testid="onboarding-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Progress Dots */}
          {step <= totalSteps ? (
            <div className="flex items-center gap-2" aria-label={`Step ${step} of ${totalSteps}`}>
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i + 1 === step
                      ? "w-6 bg-[var(--haldi)]"
                      : i + 1 < step
                      ? "w-2 bg-[var(--tulsi)]"
                      : "w-2 bg-[var(--line)]"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="font-bold text-sm text-[var(--tulsi-ink)] flex items-center gap-1">
              <Check className="w-4 h-4" /> Ready
            </div>
          )}

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {step <= totalSteps && (
              <button
                type="button"
                onClick={handleNext}
                className="text-xs font-semibold text-[var(--ink-3)] hover:text-[var(--ink)] px-2 py-1"
                data-testid="onboarding-skip-btn"
              >
                {t("common.skip")}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Step Body */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 sm:py-8 flex flex-col justify-between">
        <div className="w-full">
          {/* STEP 1: Learn In Language */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="mb-6 text-center">
                <span className="text-xs font-semibold text-[var(--mayura)] uppercase tracking-wider">
                  {t("onboarding.stepOf", { current: 1, total: totalSteps })}
                </span>
                <h1 className="text-2xl font-bold mt-1 text-[var(--ink)]">
                  {t("onboarding.step1.title")}
                </h1>
                <p className="text-sm text-[var(--ink-2)] mt-1">
                  {t("onboarding.step1.subtitle")}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    preferences.setLearnIn("en");
                    setLanguage("en");
                  }}
                  className={`w-full p-4 rounded-[14px] text-left border-2 transition-all flex items-start gap-3.5 ${
                    preferences.learnIn === "en"
                      ? "bg-[var(--neel-tint)] border-[var(--neel)] shadow-xs"
                      : "bg-[var(--surface)] border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
                  }`}
                  data-testid="lang-option-en"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center font-bold text-base text-[var(--ink)] shrink-0">
                    EN
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[17px] text-[var(--ink)]">
                      {t("onboarding.step1.en")}
                    </div>
                    <div className="text-xs text-[var(--ink-2)] mt-0.5">
                      {t("onboarding.step1.enDesc")}
                    </div>
                  </div>
                  {preferences.learnIn === "en" && (
                    <div className="w-6 h-6 rounded-full bg-[var(--neel)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    preferences.setLearnIn("ta");
                    setLanguage("ta");
                  }}
                  className={`w-full p-4 rounded-[14px] text-left border-2 transition-all flex items-start gap-3.5 ${
                    preferences.learnIn === "ta"
                      ? "bg-[var(--neel-tint)] border-[var(--neel)] shadow-xs"
                      : "bg-[var(--surface)] border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
                  }`}
                  data-testid="lang-option-ta"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--mayura-tint)] text-[var(--mayura)] flex items-center justify-center font-bold text-base shrink-0 border border-[var(--mayura)]">
                    த
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[17px] text-[var(--ink)]">
                      {t("onboarding.step1.ta")}
                    </div>
                    <div className="text-xs text-[var(--ink-2)] mt-0.5" lang="ta">
                      {t("onboarding.step1.taDesc")}
                    </div>
                  </div>
                  {preferences.learnIn === "ta" && (
                    <div className="w-6 h-6 rounded-full bg-[var(--neel)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Sanskrit Script with LIVE PREVIEW */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="mb-4 text-center">
                <span className="text-xs font-semibold text-[var(--mayura)] uppercase tracking-wider">
                  {t("onboarding.stepOf", { current: 2, total: totalSteps })}
                </span>
                <h1 className="text-2xl font-bold mt-1 text-[var(--ink)]">
                  {t("onboarding.step2.title")}
                </h1>
                <p className="text-sm text-[var(--ink-2)] mt-1">
                  {t("onboarding.step2.subtitle")}
                </p>
              </div>

              {/* Live Preview Card */}
              <Card variant="highlight" className="p-4 mb-4 text-center">
                <span className="text-xs font-bold uppercase text-[var(--ink-3)] tracking-wider">
                  {t("onboarding.step2.previewLabel")}
                </span>
                <div className="my-2">
                  <SanskritText
                    script={preferences.script}
                    size="large"
                    helperText={scriptPreviews[preferences.script].helper}
                  >
                    {scriptPreviews[preferences.script].text}
                  </SanskritText>
                </div>
              </Card>

              {/* Script Options */}
              <div className="space-y-2.5">
                {[
                  {
                    id: "devanagari" as const,
                    title: t("onboarding.step2.devanagari"),
                    desc: t("onboarding.step2.devanagariDesc"),
                    sample: "रामः",
                  },
                  {
                    id: "tamil" as const,
                    title: t("onboarding.step2.tamil"),
                    desc: t("onboarding.step2.tamilDesc"),
                    sample: "ராமஃ",
                  },
                  {
                    id: "iast" as const,
                    title: t("onboarding.step2.iast"),
                    desc: t("onboarding.step2.iastDesc"),
                    sample: "rāmaḥ",
                  },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => preferences.setScript(s.id)}
                    className={`w-full p-3.5 rounded-[14px] text-left border-2 transition-all flex items-center justify-between ${
                      preferences.script === s.id
                        ? "bg-[var(--neel-tint)] border-[var(--neel)] shadow-xs"
                        : "bg-[var(--surface)] border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
                    }`}
                    data-testid={`script-option-${s.id}`}
                  >
                    <div>
                      <div className="font-bold text-[16px] text-[var(--ink)]">
                        {s.title}
                      </div>
                      <div className="text-xs text-[var(--ink-2)] mt-0.5">
                        {s.desc}
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-[var(--ink)] pl-2">
                      {s.sample}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Helper Line */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="mb-6 text-center">
                <span className="text-xs font-semibold text-[var(--mayura)] uppercase tracking-wider">
                  {t("onboarding.stepOf", { current: 3, total: totalSteps })}
                </span>
                <h1 className="text-2xl font-bold mt-1 text-[var(--ink)]">
                  {t("onboarding.step3.title")}
                </h1>
                <p className="text-sm text-[var(--ink-2)] mt-1">
                  {t("onboarding.step3.subtitle")}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "roman" as const,
                    title: t("onboarding.step3.roman"),
                    desc: t("onboarding.step3.romanDesc"),
                  },
                  {
                    id: "tamil" as const,
                    title: t("onboarding.step3.tamil"),
                    desc: t("onboarding.step3.tamilDesc"),
                  },
                  {
                    id: "off" as const,
                    title: t("onboarding.step3.off"),
                    desc: t("onboarding.step3.offDesc"),
                  },
                ].map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => preferences.setHelperLine(h.id)}
                    className={`w-full p-4 rounded-[14px] text-left border-2 transition-all flex items-center justify-between ${
                      preferences.helperLine === h.id
                        ? "bg-[var(--neel-tint)] border-[var(--neel)] shadow-xs"
                        : "bg-[var(--surface)] border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
                    }`}
                    data-testid={`helper-option-${h.id}`}
                  >
                    <div>
                      <div className="font-bold text-[16px] text-[var(--ink)]">
                        {h.title}
                      </div>
                      <div className="text-xs text-[var(--ink-2)] mt-0.5">
                        {h.desc}
                      </div>
                    </div>
                    {preferences.helperLine === h.id && (
                      <div className="w-6 h-6 rounded-full bg-[var(--neel)] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Goals (Multi-select) */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <div className="mb-5 text-center">
                <span className="text-xs font-semibold text-[var(--mayura)] uppercase tracking-wider">
                  {t("onboarding.stepOf", { current: 4, total: totalSteps })}
                </span>
                <h1 className="text-2xl font-bold mt-1 text-[var(--ink)]">
                  {t("onboarding.step4.title")}
                </h1>
                <p className="text-sm text-[var(--ink-2)] mt-1">
                  {t("onboarding.step4.subtitle")}
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "gita", label: t("onboarding.step4.gita"), icon: BookOpen },
                  { id: "mantras", label: t("onboarding.step4.mantras"), icon: Sparkles },
                  { id: "literature", label: t("onboarding.step4.literature"), icon: Scroll },
                  { id: "grammar", label: t("onboarding.step4.grammar"), icon: GraduationCap },
                  { id: "general", label: t("onboarding.step4.general"), icon: Compass },
                ].map((g) => {
                  const isChecked = preferences.goals.includes(g.id);
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => preferences.toggleGoal(g.id)}
                      className={`w-full p-3.5 rounded-[14px] text-left border-2 transition-all flex items-center justify-between ${
                        isChecked
                          ? "bg-[var(--neel-tint)] border-[var(--neel)] text-[var(--ink)]"
                          : "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
                      }`}
                      data-testid={`goal-option-${g.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isChecked ? "text-[var(--neel)]" : "text-[var(--ink-3)]"}`} />
                        <span className="font-semibold text-sm sm:text-base">
                          {g.label}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-[var(--neel)] border-[var(--neel)] text-white"
                            : "border-[var(--line-strong)] bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Level */}
          {step === 5 && (
            <div className="animate-fadeIn">
              <div className="mb-6 text-center">
                <span className="text-xs font-semibold text-[var(--mayura)] uppercase tracking-wider">
                  {t("onboarding.stepOf", { current: 5, total: totalSteps })}
                </span>
                <h1 className="text-2xl font-bold mt-1 text-[var(--ink)]">
                  {t("onboarding.step5.title")}
                </h1>
                <p className="text-sm text-[var(--ink-2)] mt-1">
                  {t("onboarding.step5.subtitle")}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => preferences.setLevel("beginner")}
                  className={`w-full p-4 rounded-[14px] text-left border-2 transition-all flex items-start gap-3.5 ${
                    preferences.level === "beginner"
                      ? "bg-[var(--neel-tint)] border-[var(--neel)] shadow-xs"
                      : "bg-[var(--surface)] border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
                  }`}
                  data-testid="level-option-beginner"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--tulsi-tint)] text-[var(--tulsi)] flex items-center justify-center font-bold text-base shrink-0 border border-[var(--tulsi)]">
                    0
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[17px] text-[var(--ink)]">
                      {t("onboarding.step5.beginner")}
                    </div>
                    <div className="text-xs text-[var(--ink-2)] mt-0.5">
                      {t("onboarding.step5.beginnerDesc")}
                    </div>
                  </div>
                  {preferences.level === "beginner" && (
                    <div className="w-6 h-6 rounded-full bg-[var(--neel)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => preferences.setLevel("some")}
                  className={`w-full p-4 rounded-[14px] text-left border-2 transition-all flex items-start gap-3.5 ${
                    preferences.level === "some"
                      ? "bg-[var(--neel-tint)] border-[var(--neel)] shadow-xs"
                      : "bg-[var(--surface)] border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
                  }`}
                  data-testid="level-option-some"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--haldi-edge)] flex items-center justify-center font-bold text-base shrink-0 border border-[var(--line-strong)]">
                    1+
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[17px] text-[var(--ink)]">
                      {t("onboarding.step5.some")}
                    </div>
                    <div className="text-xs text-[var(--ink-2)] mt-0.5">
                      {t("onboarding.step5.someDesc")}
                    </div>
                  </div>
                  {preferences.level === "some" && (
                    <div className="w-6 h-6 rounded-full bg-[var(--neel)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Daily Time Commitment */}
          {step === 6 && (
            <div className="animate-fadeIn">
              <div className="mb-6 text-center">
                <span className="text-xs font-semibold text-[var(--mayura)] uppercase tracking-wider">
                  {t("onboarding.stepOf", { current: 6, total: totalSteps })}
                </span>
                <h1 className="text-2xl font-bold mt-1 text-[var(--ink)]">
                  {t("onboarding.step6.title")}
                </h1>
                <p className="text-sm text-[var(--ink-2)] mt-1">
                  {t("onboarding.step6.subtitle")}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    min: 5,
                    title: t("onboarding.step6.min5"),
                    desc: t("onboarding.step6.min5Desc"),
                  },
                  {
                    min: 10,
                    title: t("onboarding.step6.min10"),
                    desc: t("onboarding.step6.min10Desc"),
                    recommended: true,
                  },
                  {
                    min: 20,
                    title: t("onboarding.step6.min20"),
                    desc: t("onboarding.step6.min20Desc"),
                  },
                ].map((d) => (
                  <button
                    key={d.min}
                    type="button"
                    onClick={() => preferences.setDailyGoalMin(d.min)}
                    className={`w-full p-4 rounded-[14px] text-left border-2 transition-all flex items-center justify-between ${
                      preferences.dailyGoalMin === d.min
                        ? "bg-[var(--neel-tint)] border-[var(--neel)] shadow-xs"
                        : "bg-[var(--surface)] border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
                    }`}
                    data-testid={`time-option-${d.min}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[16px] text-[var(--ink)]">
                          {d.title}
                        </span>
                        {d.recommended && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--haldi-edge)] border border-[var(--haldi-edge)]">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--ink-2)] mt-0.5">
                        {d.desc}
                      </div>
                    </div>
                    {preferences.dailyGoalMin === d.min && (
                      <div className="w-6 h-6 rounded-full bg-[var(--neel)] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Completion Screen */}
          {step === 7 && (
            <div className="animate-fadeIn py-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-[20px] bg-[var(--surface-2)] border-2 border-[var(--line-strong)] flex items-center justify-center font-bold text-3xl text-[var(--ink)] font-serif mb-6 shadow-sm">
                भा
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-2">
                {t("onboarding.complete.title")}
              </h1>

              <p className="text-[var(--ink-2)] text-base max-w-xs mb-8">
                {t("onboarding.complete.readyDesc")}
              </p>

              <Card variant="flat" className="p-4 w-full text-left mb-8 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--ink-3)]">Learn In:</span>
                  <span className="font-semibold text-[var(--ink)]">
                    {preferences.learnIn === "ta" ? "தமிழ்" : "English"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink-3)]">Script:</span>
                  <span className="font-semibold text-[var(--ink)]">
                    {preferences.script === "devanagari"
                      ? "Devanāgarī"
                      : preferences.script === "tamil"
                      ? "Tamil Script"
                      : "Roman (IAST)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink-3)]">Daily Goal:</span>
                  <span className="font-semibold text-[var(--ink)]">
                    {preferences.dailyGoalMin} minutes
                  </span>
                </div>
              </Card>

              <div className="w-full space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-lg"
                  onClick={() => router.push("/home")}
                  data-testid="onboarding-start-lesson-btn"
                >
                  {t("onboarding.complete.startLesson1")}
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => router.push("/home")}
                >
                  {t("onboarding.complete.goToHome")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Button for Steps 1-6 */}
        {step <= totalSteps && (
          <div className="pt-6">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-lg shadow-sm"
              onClick={handleNext}
              data-testid="onboarding-continue-btn"
            >
              {step === totalSteps ? t("common.done") : t("common.continue")}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
