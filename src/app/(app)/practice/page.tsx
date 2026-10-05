"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/i18n/provider";
import { Sparkles, Layers, RefreshCw, BookMarked } from "lucide-react";

export default function PracticePage() {
  const { language } = useTranslation();
  const isTamil = language === "ta";

  return (
    <main className="max-w-md w-full mx-auto px-4 py-5 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">
          {isTamil ? "பயிற்சி & மீள்பார்வை" : "Practice & Review"}
        </h1>
        <p className="text-xs text-[var(--ink-2)] mt-0.5">
          {isTamil ? "மறக்காமல் இருக்க இடைவெளிப் பயிற்சி முறை (SRS)" : "Keep knowledge sharp with spaced repetition drills"}
        </p>
      </div>

      {/* Review Queue Card */}
      <Card variant="flat" className="p-5 border-2 border-[var(--line-strong)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-2)] text-[var(--haldi-edge)] flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-[var(--ink)]">
                {isTamil ? "மீள்பார்வை வரிசை" : "Due for Review"}
              </div>
              <div className="text-xs text-[var(--ink-2)]">
                0 {isTamil ? "சொற்கள் மீதமுள்ளன" : "items due today"}
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--tulsi-tint)] text-[var(--tulsi-ink)] border border-[var(--tulsi)]">
            {isTamil ? "அனைத்தும் முடிந்தது" : "All caught up"}
          </span>
        </div>

        <p className="text-xs text-[var(--ink-2)]">
          {isTamil
            ? "நீங்கள் கற்கும் புதிய சொற்களும் இலக்கண விதிகளும் தானாகவே உங்கள் மறுஆய்வு அட்டவணையில் சேரும்."
            : "Words and grammar rules you meet in lessons automatically enter your review schedule."}
        </p>
      </Card>

      {/* Practice by Topic Cards */}
      <div className="space-y-2.5 pt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
          {isTamil ? "தலைப்பு வாரியாக பயிற்சி" : "Practice by Topic"}
        </div>

        <Card variant="interactive" className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--ink)] flex items-center justify-center font-bold text-sm">
              अ
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--ink)]">
                {isTamil ? "எழுத்துக்கள் & ஒலிகள்" : "Script & Sounds Drills"}
              </div>
              <div className="text-[11px] text-[var(--ink-2)]">
                {isTamil ? "தேவநாகரி மற்றும் ஒலிபெயர்ப்பு பயிற்சி" : "Devanāgarī reading speed & sound recognition"}
              </div>
            </div>
          </div>
        </Card>

        <Card variant="interactive" className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--mayura-tint)] text-[var(--mayura)] flex items-center justify-center font-bold text-sm border border-[var(--mayura)]">
              ச
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--ink)]">
                {isTamil ? "சந்திப் பயிற்சி கூடம் (Sandhi Lab)" : "Sandhi Lab"}
              </div>
              <div className="text-[11px] text-[var(--ink-2)]">
                {isTamil ? "சொற்களை இணைத்து பிரித்து பயிற்சி செய்க" : "Interactive word combination and splitting"}
              </div>
            </div>
          </div>
        </Card>

        <Card variant="interactive" className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--tulsi-tint)] text-[var(--tulsi)] flex items-center justify-center font-bold text-sm border border-[var(--tulsi)]">
              வ
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--ink)]">
                {isTamil ? "வேற்றுமைகள் & சொல் வடிவங்கள்" : "Cases (Vibhakti) Practice"}
              </div>
              <div className="text-[11px] text-[var(--ink-2)]">
                {isTamil ? "1 முதல் 7 வேற்றுமை ஈறுகளை அடையாளம் காண்க" : "Identify subject, object, and instrumental endings"}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
