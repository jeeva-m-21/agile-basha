import React from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { TutorFloatingTrigger } from "@/components/tutor/TutorFloatingTrigger";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      <TopBar />
      <div className="flex-1 pb-20">
        {children}
      </div>
      <TutorFloatingTrigger />
      <BottomNav />
    </div>
  );
}
