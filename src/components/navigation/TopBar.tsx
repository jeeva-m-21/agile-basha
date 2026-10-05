"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Flame, Search } from "lucide-react";

export interface TopBarProps {
  streakCount?: number;
  restDayProtected?: boolean;
}

export function TopBar({ streakCount = 1, restDayProtected = true }: TopBarProps) {
  return (
    <header className="w-full border-b border-[var(--line)] bg-[var(--surface)] sticky top-0 z-20 transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-[var(--surface-2)] border border-[var(--line-strong)] flex items-center justify-center font-bold text-base text-[var(--ink)] font-serif">
            भा
          </div>
          <span className="font-bold text-xl tracking-tight text-[var(--ink)]">
            Bhāṣā
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Dictionary & Grammar Search shortcut */}
          <Link
            href="/dictionary"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
            title="Dictionary & Grammar"
            data-testid="topbar-search-link"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Agni streak chip per DESIGN.md §7.2 */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line-strong)]"
            title={restDayProtected ? "Streak active (1 weekly rest day protected)" : "Streak active"}
            data-testid="streak-chip"
          >
            <Flame className="w-4 h-4 text-[var(--agni)] fill-current" />
            <span className="font-bold text-sm text-[var(--ink)]">{streakCount}</span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
