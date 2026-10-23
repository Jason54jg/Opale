"use client";

import { BUSINESS } from "@/data/menu";
import { useI18n } from "@/i18n/context";
import { OpaleLogo } from "./OpaleLogo";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[var(--border)] pb-24 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <OpaleLogo className="text-3xl text-[var(--fg)]" />
          <p className="mt-3 text-sm text-[var(--fg-muted)]">{t("footer.tagline")}</p>
        </div>
        <div className="text-sm text-[var(--fg-muted)] sm:text-right">
          <p>{t("footer.rights")}</p>
          <a
            href={BUSINESS.phoneHref}
            className="mt-1 inline-block hover:text-[var(--accent)]"
          >
            {BUSINESS.phone}
          </a>
          <p className="mt-4 text-xs text-[var(--fg-muted)]/70">{t("footer.credit")}</p>
        </div>
      </div>
    </footer>
  );
}
