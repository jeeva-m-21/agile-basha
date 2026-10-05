"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={className}
        aria-label="Toggle theme"
        disabled
      >
        <Moon className="w-5 h-5 text-[var(--ink-2)]" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={className}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      data-testid="theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-[var(--ink-2)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--ink)]" />
      )}
    </Button>
  );
}
