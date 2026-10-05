import React from "react";
import { cn } from "@/lib/utils";

export type SanskritScript = "devanagari" | "tamil" | "iast";

export interface SanskritTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  script?: SanskritScript;
  size?: "hero" | "large" | "body" | "verse";
  helperText?: string;
  helperScript?: "iast" | "tamil";
}

export function SanskritText({
  children,
  script = "devanagari",
  size = "body",
  helperText,
  helperScript = "iast",
  className,
  ...props
}: SanskritTextProps) {
  const langTag =
    script === "devanagari"
      ? "sa-Deva"
      : script === "tamil"
      ? "sa-Taml"
      : "sa-Latn";

  const helperLangTag = helperScript === "tamil" ? "sa-Taml" : "sa-Latn";

  const sizeStyles = {
    hero: "text-[38px] sm:text-[44px] md:text-[56px] font-semibold leading-[1.4] sm:leading-[1.5]",
    large: "text-[28px] sm:text-[32px] font-semibold leading-[1.45] sm:leading-[1.5]",
    body: "text-[20px] sm:text-[24px] font-medium leading-[1.5] sm:leading-[1.55]",
    verse: "text-[20px] sm:text-[24px] font-normal leading-[1.65] sm:leading-[1.7] font-serif",
  }[size];

  return (
    <div className={cn("flex flex-col items-center justify-center text-center", className)} {...props}>
      <div
        lang={langTag}
        className={cn(
          "text-[var(--ink)] tracking-normal select-text",
          sizeStyles
        )}
      >
        {children}
      </div>
      {helperText && (
        <div
          lang={helperLangTag}
          className="text-base font-normal text-[var(--ink-2)] mt-1.5 leading-[1.45] select-text"
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
