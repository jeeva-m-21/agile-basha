"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { CURATED_TEXTS, CuratedText } from "@/lib/reader/texts";
import { BookOpen, Sparkles, Filter, ChevronRight } from "lucide-react";

interface TextLibraryProps {
  onSelectText: (text: CuratedText) => void;
  isTamil?: boolean;
}

const CATEGORIES = [
  { id: "all", labelEn: "All Texts", labelTa: "அனைத்தும்" },
  { id: "gita", labelEn: "Bhagavad Gītā", labelTa: "பகவத் கீதை" },
  { id: "subhashita", labelEn: "Subhāṣitas", labelTa: "சுபாஷிதங்கள்" },
  { id: "upanishad", labelEn: "Upaniṣads", labelTa: "உபநிடதங்கள்" },
  { id: "stotra", labelEn: "Stotras", labelTa: "ஸ்தோத்திரங்கள்" },
  { id: "story", labelEn: "Graded Stories", labelTa: "எளிய கதைகள்" },
];

export function TextLibrary({ onSelectText, isTamil = false }: TextLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTexts =
    selectedCategory === "all"
      ? CURATED_TEXTS
      : CURATED_TEXTS.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-4" data-testid="text-library-container">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "bg-[var(--surface-2)] text-[var(--ink-2)] hover:bg-[var(--line)] border border-[var(--line)]"
              }`}
              data-testid={`category-pill-${cat.id}`}
            >
              {isTamil ? cat.labelTa : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Texts List */}
      <div className="space-y-2.5" data-testid="curated-texts-list">
        {filteredTexts.map((item) => (
          <Card
            key={item.id}
            variant="flat"
            className="p-3.5 border border-[var(--line-strong)] bg-[var(--surface)] hover:border-[var(--primary)] cursor-pointer transition-all hover:shadow-xs group"
            onClick={() => onSelectText(item)}
            data-testid={`curated-text-card-${item.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line)]">
                    {item.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-medium text-[var(--tulsi)]">
                    {isTamil ? `நிலை ${item.difficulty}` : `Level ${item.difficulty}`}
                  </span>
                  {item.translator && (
                    <span className="text-[10px] text-[var(--ink-3)] hidden sm:inline">
                      • {item.translator}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                  {isTamil ? item.titleTa : item.titleEn}
                </h3>

                <p
                  lang="sa"
                  className="text-xs font-sanskrit text-[var(--ink-2)] line-clamp-1 italic"
                >
                  {item.sanskrit.split("\n")[0]}
                </p>
              </div>

              <div className="self-center text-[var(--ink-3)] group-hover:text-[var(--primary)] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
