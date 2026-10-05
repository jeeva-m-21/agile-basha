import React from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] text-[var(--ink)] p-4">
      <main
        id="main-content"
        className="w-full max-w-md p-6 bg-[var(--surface)] border-2 border-[var(--line-strong)] rounded-2xl shadow-md text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--neel-tint)] text-[var(--neel)] flex items-center justify-center mx-auto border-2 border-[var(--neel)]/30">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-heading">
            404 — Page Not Found
          </h1>
          <p className="text-xs font-semibold text-[var(--neel)]">
            பக்கம் காணப்படவில்லை
          </p>
        </div>

        <p className="text-xs text-[var(--ink-2)] leading-relaxed">
          The verse or page you were looking for doesn&apos;t seem to be here.
          Let&apos;s guide you back to your learning path!
        </p>

        <div className="pt-2 flex justify-center">
          <Link href="/home">
            <Button variant="primary" size="sm" className="text-xs">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Return to Home (முகப்பிற்குத் திரும்பு)
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
