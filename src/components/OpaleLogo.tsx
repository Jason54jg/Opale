"use client";

import { useI18n } from "@/i18n/context";

/** Logo texte : la taille de police passée en `className` pilote tout le bloc. */
export function OpaleLogo({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`.trim()}>
      <span className="font-[family-name:var(--font-display)] font-bold tracking-[0.06em]">
        OPALE
      </span>
      <span className="mt-[0.18em] text-[0.3em] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
        {t("hero.since")}
      </span>
    </span>
  );
}
