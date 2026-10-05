"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-[80ms] select-none rounded-[var(--r-control)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--neel)] focus-visible:ring-offset-2";

    const sizeStyles = {
      sm: "h-10 px-4 text-sm min-w-[36px]",
      md: "h-14 px-6 text-[17px] min-h-[56px] min-w-[48px]",
      lg: "h-16 px-8 text-lg min-h-[64px] min-w-[48px]",
    }[size];

    let variantStyles = "";

    if (isDisabled) {
      variantStyles =
        "bg-[var(--line)] text-[var(--ink-3)] opacity-60 cursor-not-allowed border-none shadow-none transform-none";
    } else {
      switch (variant) {
        case "primary":
          variantStyles =
            "bg-[var(--haldi)] text-[var(--ink)] border-b-[4px] border-[var(--haldi-edge)] hover:brightness-105 active:translate-y-[3px] active:border-b-[1px]";
          break;
        case "secondary":
          variantStyles =
            "bg-[var(--surface)] text-[var(--neel)] border-2 border-[var(--line-strong)] border-b-[4px] border-b-[var(--line)] hover:bg-[var(--surface-2)] active:translate-y-[3px] active:border-b-[1px]";
          break;
        case "outline":
          variantStyles =
            "bg-transparent text-[var(--ink)] border-2 border-[var(--line-strong)] hover:bg-[var(--surface)] active:translate-y-[2px]";
          break;
        case "ghost":
          variantStyles =
            "bg-transparent text-[var(--ink)] hover:bg-[var(--surface-2)] active:translate-y-[1px]";
          break;
      }
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(baseStyles, sizeStyles, variantStyles, className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-1.5" aria-label="Loading">
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-current animate-pulse [animation-delay:200ms]" />
            <span className="h-2 w-2 rounded-full bg-current animate-pulse [animation-delay:400ms]" />
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
