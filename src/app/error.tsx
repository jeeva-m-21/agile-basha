"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] text-[var(--ink)] p-4">
      <main
        id="main-content"
        role="alert"
        aria-live="assertive"
        className="w-full max-w-md p-6 bg-[var(--surface)] border-2 border-[var(--line-strong)] rounded-2xl shadow-md text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--sindoor-tint)] text-[var(--sindoor)] flex items-center justify-center mx-auto border-2 border-[var(--sindoor)]/30">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold font-heading">
            Something unexpected occurred
          </h1>
          <p className="text-xs font-semibold text-[var(--sindoor)]">
            எதிர்பாராத பிழை ஏற்பட்டது
          </p>
        </div>

        <p className="text-xs text-[var(--ink-2)] leading-relaxed">
          Don&apos;t worry — your completed lessons and review progress are safely saved.
          You can try refreshing this view or return to the home screen.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => reset()}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Try again
          </Button>

          <Link href="/home">
            <Button variant="primary" size="sm" className="text-xs">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
