"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SanskritText } from "@/components/sanskrit/SanskritText";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTranslation } from "@/i18n/provider";
import { BookOpen, Sparkles, Search } from "lucide-react";

export default function ReadPage() {
  const preferences = usePreferencesStore();
  const { language } = useTranslation();
  const isTamil = language === "ta";
  const [inputText, setInputText] = useState("");

  const sampleTexts = [
    {
      id: "gita-2-47",
      title: "Bhagavad Gītā 2.47",
      category: "Gītā",
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।",
      tamilScript: "கர்மண்யேவாதி⁴காரஸ்தே மா ப²லேஷு கதா³சந ।",
      transliteration: "karmaṇyevādhikāraste mā phaleṣu kadācana |",
      translationEn: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
      translationTa: "செயலில் மட்டுமே உனக்கு அதிகாரம் உண்டு; அதன் பயன்களில் எப்போதும் இல்லை.",
    },
    {
      id: "shanti",
      title: "Śānti Mantra",
      category: "Upaniṣad",
      sanskrit: "ॐ असतो मा सद्गमय तमसो मा ज्योतिर्गमय ।",
      tamilScript: "ஓம் அஸதோ மா ஸத்³க³மய தமஸோ மா ஜ்யோதிர்க³மய ।",
      transliteration: "om asato mā sadgamaya tamaso mā jyotirgamaya |",
      translationEn: "Lead me from the unreal to the real, from darkness to light.",
      translationTa: "பொய்மையிலிருந்து உண்மைக்கும், இருளிலிருந்து ஒளிக்கும் என்னை வழிநடத்துக.",
    },
  ];

  return (
    <main className="max-w-md w-full mx-auto px-4 py-5 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">
          {isTamil ? "வாசிப்பு & நூலகம்" : "Reader & Library"}
        </h1>
        <p className="text-xs text-[var(--ink-2)] mt-0.5">
          {isTamil ? "ஸ்லோகங்களைச் சொற்பிரிப்புடன் வாசியுங்கள்" : "Tap-to-understand real Sanskrit texts with grammar insights"}
        </p>
      </div>

      {/* Paste / Type Box */}
      <Card variant="flat" className="p-4 bg-[var(--surface)] space-y-3">
        <label htmlFor="sanskrit-input" className="block text-xs font-bold uppercase text-[var(--ink-2)]">
          {isTamil ? "சமஸ்கிருத வாசகத்தை உள்ளிடுக" : "Paste or type Sanskrit"}
        </label>
        <textarea
          id="sanskrit-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="धर्मक्षेत्रे कुरुक्षेत्रे... / dharmakṣetre..."
          className="w-full h-24 p-3 rounded-[12px] bg-[var(--paper)] border border-[var(--line-strong)] text-[var(--ink)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neel)] resize-none"
        />
        <Button
          variant="primary"
          size="md"
          className="w-full text-sm font-bold"
          disabled={!inputText.trim()}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isTamil ? "ஆராய்க (Analyze)" : "Analyze text"}
        </Button>
      </Card>

      {/* Curated Library Passages */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
          {isTamil ? "பரிந்துரைக்கப்பட்ட வாசகங்கள்" : "Curated Passages"}
        </div>

        {sampleTexts.map((item) => (
          <Card key={item.id} variant="flat" className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--mayura)] uppercase">
                {item.category}
              </span>
              <span className="text-xs text-[var(--ink-3)] font-semibold">
                {item.title}
              </span>
            </div>

            <div className="py-1">
              <SanskritText
                script={preferences.script}
                size="large"
                helperText={
                  preferences.helperLine !== "off"
                    ? item.transliteration
                    : undefined
                }
              >
                {preferences.script === "tamil" ? item.tamilScript : item.sanskrit}
              </SanskritText>
            </div>

            <div className="text-xs text-[var(--ink-2)] italic pt-1 border-t border-[var(--line)]">
              {isTamil ? item.translationTa : item.translationEn}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
