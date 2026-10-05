"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/i18n/provider";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPromptBanner() {
  const { language } = useTranslation();
  const isTamil = language === "ta";

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone)
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  if (isInstalled || isDismissed || !installPrompt) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="App installation banner"
      className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 shadow-sm my-4 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shrink-0 shadow-xs">
            <span className="font-heading font-bold text-lg">भा</span>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
              {isTamil ? "பாஷா செயலியை நிறுவவும்" : "Install Bhāṣā App"}
            </h4>
            <p className="text-xs text-[var(--ink-muted)]">
              {isTamil
                ? "தினசரி ஆஃப்லைன் பயிற்சிக்காக உங்கள் சாதனத்தில் சேர்க்கவும்"
                : "Add to home screen for daily offline practice"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          aria-label={isTamil ? "மூடு" : "Dismiss"}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleInstallClick}
          className="flex-1 text-xs py-1.5"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          {isTamil ? "நிறுவவும்" : "Install Now"}
        </Button>
        <button
          onClick={() => setIsDismissed(true)}
          className="px-3 py-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] font-medium rounded-lg transition-colors"
        >
          {isTamil ? "பிறகு" : "Not now"}
        </button>
      </div>
    </div>
  );
}
