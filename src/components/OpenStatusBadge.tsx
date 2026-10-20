"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/openingHours";
import { useI18n } from "@/i18n/context";

type Props = {
  /** Affiche toujours le détail (ex. menu mobile). */
  showDetail?: boolean;
};

export function OpenStatusBadge({ showDetail = false }: Props) {
  const { t } = useI18n();
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getOpenStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--fg-muted)] sm:text-xs"
        aria-hidden
      >
        <span className="size-1.5 rounded-full bg-[var(--fg-muted)]" />
        …
      </span>
    );
  }

  const label = status.isOpen ? t("nav.open") : t("nav.closed");
  const detail = status.untilIsClosing
    ? t("nav.until", { time: status.untilLabel })
    : t("nav.opensAt", { time: status.untilLabel });

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:text-xs ${
        status.isOpen
          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
          : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-muted)]"
      }`}
      title={`${label} — ${detail}`}
      role="status"
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${
          status.isOpen
            ? "bg-emerald-400 shadow-[0_0_6px_rgb(52_211_153/0.8)]"
            : "bg-[var(--fg-muted)]"
        }`}
        aria-hidden
      />
      <span className="truncate whitespace-nowrap">
        {label}
        <span
          className={`text-[10px] opacity-80 ${showDetail ? "inline" : "hidden sm:inline"}`}
        >
          {" "}
          · {detail}
        </span>
      </span>
    </span>
  );
}
