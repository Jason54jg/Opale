"use client";

import { useI18n, type Locale } from "@/i18n/context";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const options: Locale[] = ["fr", "en"];

  return (
    <div
      className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-0.5"
      role="group"
      aria-label="Language"
    >
      {options.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`min-w-10 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
              active
                ? "bg-[var(--accent)] text-[var(--bg)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
            aria-pressed={active}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
