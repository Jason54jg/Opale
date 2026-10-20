"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { BUSINESS } from "@/data/menu";
import { useI18n } from "@/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";

const LINKS = [
  { href: "#menu", key: "nav.menu" },
  { href: "#avis", key: "nav.reviews" },
  { href: "#fait-maison", key: "nav.homemade" },
  { href: "#contact", key: "nav.contact" },
] as const;

export function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
            OPALE
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)] sm:inline">
            {BUSINESS.since}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              {t(link.key)}
            </a>
          ))}
          <LanguageSwitcher />
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg)] transition-transform hover:scale-[1.02]"
          >
            <Phone className="size-3.5" aria-hidden />
            {t("nav.call")}
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="rounded-full border border-[var(--border)] p-2 text-[var(--fg)]"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)]/98 px-4 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2 text-[var(--fg)]"
                onClick={() => setOpen(false)}
              >
                {t(link.key)}
              </a>
            ))}
            <a
              href={BUSINESS.phoneHref}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--bg)]"
              onClick={() => setOpen(false)}
            >
              <Phone className="size-4" aria-hidden />
              {t("nav.call")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
