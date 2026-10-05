"use client";

import React, { useState, useEffect } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useTranslation } from "@/i18n/provider";
import { WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";

export function OfflineBanner() {
  const { isOnline, pendingCount, isSyncing, syncNow } = useNetworkStatus();
  const { language } = useTranslation();
  const isTamil = language === "ta";

  const [mounted, setMounted] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showSyncedNotice, setShowSyncedNotice] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isOnline) {
      setWasOffline(true);
      setShowSyncedNotice(false);
    } else if (wasOffline) {
      // Just reconnected
      setShowSyncedNotice(true);
      const timer = setTimeout(() => {
        setShowSyncedNotice(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // If not yet mounted or online with no sync notice, render nothing
  if (!mounted || (isOnline && !showSyncedNotice)) {
    return null;
  }

  // Back online / syncing notice
  if (isOnline && showSyncedNotice) {
    return (
      <aside
        role="status"
        aria-live="polite"
        className="w-full bg-[var(--forest-tint)] border-b border-[var(--forest)]/20 px-4 py-2 text-xs md:text-sm text-[var(--forest)] transition-all animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[var(--forest)] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[var(--forest)] shrink-0" />
            )}
            <span>
              {isSyncing
                ? isTamil
                  ? "மீண்டும் இணைக்கப்பட்டது. முன்னேற்றத்தை ஒத்திசைக்கிறது..."
                  : "Back online. Syncing progress..."
                : isTamil
                ? "இணைக்கப்பட்டது! அனைத்து முன்னேற்றமும் ஒத்திசைக்கப்பட்டது."
                : "Back online! All progress synchronized."}
            </span>
          </div>
          {pendingCount > 0 && !isSyncing && (
            <button
              onClick={syncNow}
              className="underline font-medium hover:opacity-80 transition-opacity"
            >
              {isTamil ? "இப்போது ஒத்திசை" : "Sync now"}
            </button>
          )}
        </div>
      </aside>
    );
  }

  // Offline banner
  return (
    <aside
      role="status"
      aria-live="polite"
      className="w-full bg-[var(--ochre-tint)] border-b border-[var(--ochre)]/30 px-4 py-2 text-xs md:text-sm text-[var(--ink)] transition-all animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-[var(--ochre)] shrink-0" />
          <span>
            {isTamil
              ? "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். பதிவிறக்கப்பட்ட பாடங்கள் தயாராக உள்ளன."
              : "You're offline. Downloaded lessons are ready to practice."}
          </span>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--surface)] border border-[var(--ochre)]/40 text-[var(--ochre)] shrink-0">
            {isTamil
              ? `${pendingCount} சேமிக்கப்பட்டது`
              : `${pendingCount} queued`}
          </span>
        )}
      </div>
    </aside>
  );
}
