"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/provider";
import { Home, Compass, BookOpen, Sparkles, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { t, language } = useTranslation();

  const tabs = [
    {
      id: "home",
      label: language === "ta" ? "முகப்பு" : "Home",
      href: "/home",
      icon: Home,
    },
    {
      id: "learn",
      label: language === "ta" ? "கற்க" : "Learn",
      href: "/learn",
      icon: Compass,
    },
    {
      id: "read",
      label: language === "ta" ? "வாசிக்க" : "Read",
      href: "/read",
      icon: BookOpen,
    },
    {
      id: "practice",
      label: language === "ta" ? "பயிற்சி" : "Practice",
      href: "/practice",
      icon: Sparkles,
    },
    {
      id: "me",
      label: language === "ta" ? "நான்" : "Me",
      href: "/me",
      icon: User,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--surface)] border-t border-[var(--line)] shadow-sm transition-colors"
      aria-label="Main Navigation"
      data-testid="bottom-nav"
    >
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${
                isActive
                  ? "text-[var(--neel)] font-bold"
                  : "text-[var(--ink-2)] hover:text-[var(--ink)] font-medium"
              }`}
              aria-current={isActive ? "page" : undefined}
              data-testid={`nav-tab-${tab.id}`}
            >
              {/* 3px Pill indicator above active tab per DESIGN.md §6.13 */}
              {isActive && (
                <span className="absolute top-0 w-8 h-[3px] bg-[var(--neel)] rounded-full animate-fadeIn" />
              )}
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[12px] sm:text-[13px] leading-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
