"use client";

import { BUSINESS } from "@/data/menu";
import { useI18n } from "@/i18n/context";
import { OpaleLogo } from "./OpaleLogo";

const AUTHOR_GITHUB_URL = "https://github.com/Jason54jg";

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
          <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
          <a
            href={BUSINESS.phoneHref}
            className="mt-1 inline-block hover:text-[var(--accent)]"
          >
            {BUSINESS.phone}
          </a>
          <a
            href={AUTHOR_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-xs text-[var(--fg-muted)]/70 hover:text-[var(--accent)]"
          >
            {t("footer.credit")}
          </a>
        </div>
      </div>
    </footer>
  );
}
