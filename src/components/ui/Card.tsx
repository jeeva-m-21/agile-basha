"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "interactive" | "highlight" | "bridge";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "flat",
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      none: "p-0",
      sm: "p-3",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
    }[padding];

    const variantStyles = {
      flat: "bg-[var(--surface)] border border-[var(--line)] rounded-[var(--r-card)]",
      interactive:
        "bg-[var(--surface)] border-2 border-[var(--line-strong)] border-b-[4px] border-b-[var(--line)] rounded-[var(--r-card)] cursor-pointer hover:bg-[var(--surface-2)] active:translate-y-[3px] active:border-b-[1px] transition-all duration-[80ms]",
      highlight:
        "bg-[var(--surface-2)] border border-[var(--line)] rounded-[var(--r-card)]",
      bridge:
        "bg-[var(--mayura-tint)] border-2 border-[var(--mayura)] rounded-[var(--r-card)]",
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(paddingStyles, variantStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
