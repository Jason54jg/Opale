"use client";

import { Clock, MapPinned, Phone, ShoppingBag, Utensils } from "lucide-react";
import { BUSINESS } from "@/data/menu";
import { useI18n } from "@/i18n/context";

export function ContactSection() {
  const { t } = useI18n();

  return (
    <section id="contact" className="section-pad scroll-mt-20 bg-[var(--bg-deep)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h2 className="section-title">{t("contact.title")}</h2>
          <p className="section-sub">{t("contact.subtitle")}</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPinned className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
              <div>
                <h3 className="text-sm uppercase tracking-wider text-[var(--fg-muted)]">
                  {t("contact.address")}
                </h3>
                <p className="mt-1 text-[var(--fg)]">{BUSINESS.address}</p>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {t("contact.directions")}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
              <div>
                <h3 className="text-sm uppercase tracking-wider text-[var(--fg-muted)]">
                  {t("contact.phone")}
                </h3>
                <a
                  href={BUSINESS.phoneHref}
                  className="mt-1 block text-lg text-[var(--fg)] hover:text-[var(--accent)]"
                >
                  {BUSINESS.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Utensils className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
              <div>
                <h3 className="text-sm uppercase tracking-wider text-[var(--fg-muted)]">
                  {t("contact.servicesLabel")}
                </h3>
                <p className="mt-1 text-[var(--fg)]">{t("contact.services")}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
              <div className="w-full">
                <h3 className="text-sm uppercase tracking-wider text-[var(--fg-muted)]">
                  {t("contact.hours")}
                </h3>
                <div className="mt-3 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border)] pb-3">
                    <span className="text-[var(--fg)]">{t("contact.monThu")}</span>
                    <span className="text-sm text-[var(--fg-soft)]">
                      {t("contact.lunch")} / {t("contact.dinnerWeek")}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border)] pb-3">
                    <span className="text-[var(--fg)]">{t("contact.friSat")}</span>
                    <span className="text-sm text-[var(--fg-soft)]">
                      {t("contact.lunch")} / {t("contact.dinnerWeekend")}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[var(--fg)]">{t("contact.sunday")}</span>
                    <span className="text-sm text-[var(--fg-soft)]">
                      {t("contact.lunchSunday")} / {t("contact.dinnerWeek")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href={BUSINESS.phoneHref} className="btn-primary">
                <Phone className="size-4" />
                {t("contact.call")}
              </a>
              <a
                href={BUSINESS.uberEatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ShoppingBag className="size-4" />
                {t("contact.uberEats")}
              </a>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <MapPinned className="size-4" />
                {t("contact.directions")}
              </a>
            </div>
          </div>

          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-panel group relative min-h-72 overflow-hidden rounded-2xl border border-[var(--border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            aria-label={t("contact.directions")}
          >
            <div className="absolute inset-0 map-visual" aria-hidden />
            <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/40 to-transparent p-6">
              <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--fg)]">
                Neufchâteau
              </p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">
                38 Rue de France
              </p>
              <span className="mt-4 text-sm font-medium text-[var(--accent)] transition-transform group-hover:translate-x-1">
                Google Maps →
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
