"use client";

import React from "react";
import { GrammarRuleItem } from "@/lib/dictionary/grammar-rules";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AudioButton } from "@/components/sanskrit/AudioButton";
import { X, BookOpen, ExternalLink, ArrowRight } from "lucide-react";

interface GrammarDetailModalProps {
  rule: GrammarRuleItem;
  onClose: () => void;
  isTamil?: boolean;
}

export function GrammarDetailModal({ rule, onClose, isTamil = false }: GrammarDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      data-testid="grammar-detail-modal"
    >
      <div className="w-full max-w-lg max-h-[90vh] bg-[var(--surface)] border-t sm:border border-[var(--line-strong)] rounded-t-[24px] sm:rounded-[20px] shadow-xl overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface-2)]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary-tint)] text-[var(--primary)] border border-[var(--primary)]">
              {rule.category.toUpperCase()}
            </span>
            <span className="text-xs font-sanskrit font-bold text-[var(--ink)]">
              {rule.sanskritTerm}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
            data-testid="close-grammar-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">
              {isTamil ? rule.titleTa : rule.titleEn}
            </h2>
            <div className="text-xs font-mono text-[var(--ink-3)] mt-0.5">
              {rule.sanskritIast}
            </div>
          </div>

          {/* Paninian Sutra Banner */}
          {rule.sutra && (
            <div className="p-3.5 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line-strong)] space-y-1">
              <div className="text-[11px] font-bold text-[var(--ink-3)] uppercase tracking-wider">
                {isTamil ? "பாணினீய சூத்திரம் (Pāṇini Sūtra):" : "Pāṇini Sūtra:"}
              </div>
              <div lang="sa" className="text-base font-sanskrit font-bold text-[var(--ink)]">
                {rule.sutra}
              </div>
              <p className="text-xs text-[var(--ink-2)] italic pt-0.5">
                {isTamil ? rule.sutraTranslationTa : rule.sutraTranslationEn}
              </p>
            </div>
          )}

          {/* Plain Explanation */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
              {isTamil ? "விளக்கம் (Rule Explanation):" : "Rule Explanation:"}
            </div>
            <p className="text-sm text-[var(--ink)] leading-relaxed">
              {isTamil ? rule.ruleTa : rule.ruleEn}
            </p>
          </div>

          {/* Declension / Conjugation Table */}
          {rule.tableData && (
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
                {isTamil ? "வடிவ அட்டவணை (Table):" : "Paradigm Table:"}
              </div>
              <div className="overflow-x-auto rounded-[12px] border border-[var(--line-strong)]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[var(--surface-2)] border-b border-[var(--line)]">
                    <tr>
                      {rule.tableData.headers.map((h, i) => (
                        <th key={i} className="p-2.5 font-bold text-[var(--ink)] whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {rule.tableData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[var(--surface-2)]">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-[var(--ink-2)] whitespace-nowrap font-medium">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Examples with Audio Button */}
          {rule.examples && rule.examples.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
                {isTamil ? "எடுத்துக்காட்டுகள் (Examples with Audio):" : "Examples with Audio:"}
              </div>
              <div className="space-y-2">
                {rule.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div lang="sa" className="text-base font-sanskrit font-bold text-[var(--ink)]">
                        {ex.sanskrit}
                      </div>
                      <div className="text-xs font-mono text-[var(--ink-3)]">
                        {ex.iast}
                      </div>
                      <div className="text-xs text-[var(--ink-2)] italic pt-0.5">
                        &ldquo;{isTamil ? ex.translationTa : ex.translationEn}&rdquo;
                      </div>
                    </div>

                    <AudioButton text={ex.sanskrit} size="sm" showSlowToggle={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with "Practice this" button */}
        <div className="p-4 border-t border-[var(--line)] bg-[var(--surface-2)] flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-[var(--ink-2)]"
          >
            {isTamil ? "மூடு" : "Close"}
          </Button>

          {rule.relatedLessonId && (
            <a
              href={`/${rule.relatedLessonId.replace("-", "/")}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-bold hover:brightness-105 shadow-xs transition-all"
              data-testid="grammar-practice-this-btn"
            >
              <span>{isTamil ? "இந்தப் பாடத்தைப் பயிற்சி செய்" : "Practice This"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
