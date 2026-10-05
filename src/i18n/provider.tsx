"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./en.json";
import ta from "./ta.json";

export type Language = "en" | "ta";

type TranslationDictionary = typeof en;

const translations: Record<Language, TranslationDictionary> = {
  en,
  ta: ta as unknown as TranslationDictionary,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  initialLanguage = "en",
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const saved = localStorage.getItem("learn_in") as Language | null;
    if (saved === "en" || saved === "ta") {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("learn_in", lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let current: any = translations[language];

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English
        let fallback: any = translations.en;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === "object" && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return key;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== "string") {
      return key;
    }

    if (params) {
      return Object.entries(params).reduce(
        (acc, [pKey, pVal]) => acc.replace(new RegExp(`{${pKey}}`, "g"), String(pVal)),
        current
      );
    }

    return current;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
