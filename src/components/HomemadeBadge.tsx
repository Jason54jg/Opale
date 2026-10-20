"use client";

import { useI18n } from "@/i18n/context";

export function HomemadeBadge({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <span className={`homemade-badge ${className}`.trim()}>
      {t("menu.homemade")}
    </span>
  );
}
