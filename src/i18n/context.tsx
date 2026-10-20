"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en from "./en.json";
import fr from "./fr.json";

export type Locale = "fr" | "en";

const dictionaries = { fr, en } as const;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fr");

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const value = getByPath(dictionaries[locale], path);
      let text = typeof value === "string" ? value : path;
      if (vars) {
        for (const [key, val] of Object.entries(vars)) {
          text = text.replaceAll(`{${key}}`, String(val));
        }
      }
      return text;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
