"use client";

import { motion } from "framer-motion";
import { Phone, ShoppingBag } from "lucide-react";
import { BUSINESS } from "@/data/menu";
import { useI18n } from "@/i18n/context";

export function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-28 pt-28 md:items-center md:pb-20"
    >
      <div className="hero-atmosphere" aria-hidden />
      <div className="hero-grain" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-sm uppercase tracking-[0.28em] text-[var(--accent)]"
        >
          {t("hero.since")} · Neufchâteau
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="font-[family-name:var(--font-display)] text-[clamp(4.5rem,18vw,9.5rem)] leading-[0.85] tracking-wide text-[var(--fg)]"
        >
          {t("hero.brand")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-5 max-w-xl text-lg text-[var(--fg-muted)] sm:text-xl"
        >
          {t("hero.tagline")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-4 max-w-2xl border-l-2 border-[var(--accent)] pl-4 text-sm leading-relaxed text-[var(--fg-soft)]"
        >
          {t("hero.award")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.36 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a href="#menu" className="btn-primary">
            {t("hero.ctaMenu")}
          </a>
          <a
            href={BUSINESS.uberEatsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <ShoppingBag className="size-4" aria-hidden />
            {t("hero.ctaUberEats")}
          </a>
          <a href="#menu" className="btn-secondary">
            {t("hero.ctaTacos")}
          </a>
          <a href={BUSINESS.phoneHref} className="btn-ghost">
            <Phone className="size-4" aria-hidden />
            {t("hero.ctaCall")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
