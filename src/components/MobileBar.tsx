"use client";

import { MapPinned, Phone } from "lucide-react";
import { BUSINESS } from "@/data/menu";
import { useI18n } from "@/i18n/context";

export function MobileBar() {
  const { t } = useI18n();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/95 p-3 backdrop-blur-md md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <a
          href={BUSINESS.phoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--bg)]"
        >
          <Phone className="size-4" aria-hidden />
          {t("mobile.call")}
        </a>
        <a
          href={BUSINESS.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--fg)]"
        >
          <MapPinned className="size-4" aria-hidden />
          {t("mobile.maps")}
        </a>
      </div>
    </div>
  );
}
