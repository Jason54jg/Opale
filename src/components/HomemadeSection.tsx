"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const POINTS = [
  "steak",
  "brochette",
  "kofte",
  "merguez",
  "adana",
  "tiramisu",
] as const;

export function HomemadeSection() {
  const { t } = useI18n();

  return (
    <section id="fait-maison" className="section-pad scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
            {t("homemade.badge")}
          </p>
          <h2 className="section-title">{t("homemade.title")}</h2>
          <p className="section-sub">{t("homemade.subtitle")}</p>
          <p className="mt-5 text-[var(--fg-soft)] leading-relaxed">
            {t("homemade.lead")}
          </p>
        </header>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((key, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border-t border-[var(--border)] pt-5"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[var(--fg)]">
                {t(`homemade.points.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
                {t(`homemade.points.${key}.text`)}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
