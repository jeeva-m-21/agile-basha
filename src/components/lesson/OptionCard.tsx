import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OptionCardProps {
  id: string;
  text: string;
  helper?: string;
  isSelected: boolean;
  status?: "idle" | "correct" | "incorrect";
  onSelect: () => void;
  disabled?: boolean;
}

export function OptionCard({
  id,
  text,
  helper,
  isSelected,
  status = "idle",
  onSelect,
  disabled = false,
}: OptionCardProps) {
  let styleClasses = "";

  if (status === "correct") {
    styleClasses =
      "bg-[var(--tulsi-tint)] border-[var(--tulsi)] text-[var(--tulsi-ink)] border-b-[4px] border-b-[var(--tulsi)]";
  } else if (status === "incorrect") {
    styleClasses =
      "bg-[var(--sindoor-tint)] border-[var(--sindoor)] text-[var(--sindoor-ink)] border-b-[4px] border-b-[var(--sindoor)]";
  } else if (isSelected) {
    styleClasses =
      "bg-[var(--neel-tint)] border-[var(--neel)] text-[var(--neel-edge)] border-b-[4px] border-b-[var(--neel-edge)] shadow-xs";
  } else {
    styleClasses =
      "bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink)] border-b-[4px] border-b-[var(--line)] hover:bg-[var(--surface-2)] active:translate-y-[3px] active:border-b-[1px]";
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full min-h-[56px] p-4 rounded-[14px] border-2 transition-all duration-[80ms] flex items-center justify-between text-left select-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--neel)]",
        styleClasses
      )}
      data-testid={`option-card-${id}`}
    >
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-bold tracking-normal">
          {text}
        </span>
        {helper && (
          <span className="text-xs font-normal opacity-80 mt-0.5">
            {helper}
          </span>
        )}
      </div>

      <div className="shrink-0 pl-3">
        {status === "correct" && (
          <div className="w-6 h-6 rounded-full bg-[var(--tulsi)] text-white flex items-center justify-center">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        )}
        {status === "incorrect" && (
          <div className="w-6 h-6 rounded-full bg-[var(--sindoor)] text-white flex items-center justify-center">
            <X className="w-4 h-4 stroke-[3]" />
          </div>
        )}
        {status === "idle" && isSelected && (
          <div className="w-6 h-6 rounded-full bg-[var(--neel)] text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        )}
        {status === "idle" && !isSelected && (
          <div className="w-5 h-5 rounded-full border-2 border-[var(--line-strong)]" />
        )}
      </div>
    </button>
  );
}
