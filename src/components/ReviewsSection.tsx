"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { useMemo } from "react";
import { GOOGLE_REVIEWS } from "@/data/reviews";
import type { LiveGoogleRating, LiveReview } from "@/lib/googleRating";
import { useI18n } from "@/i18n/context";

function Stars({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < filled
              ? "fill-[var(--accent)] text-[var(--accent)]"
              : "text-[var(--border)]"
          }`}
        />
      ))}
    </span>
  );
}

function fallbackState(): LiveGoogleRating {
  return {
    rating: GOOGLE_REVIEWS.rating,
    count: GOOGLE_REVIEWS.count,
    source: "cache",
    updatedAt: "",
    mapsReviewsUrl: GOOGLE_REVIEWS.mapsReviewsUrl,
    reviews: GOOGLE_REVIEWS.items.map((item) => ({
      id: item.id,
      author: item.author,
      rating: item.rating,
      text: item.textFr,
      source: item.source,
      dateLabel: "",
    })),
  };
}

type Props = {
  /** Avis récupérés au build (export statique / GitHub Pages). */
  initialData?: LiveGoogleRating | null;
};

export function ReviewsSection({ initialData }: Props) {
  const { t, locale } = useI18n();
  const live = useMemo(
    () => initialData ?? fallbackState(),
    [initialData],
  );

  const updatedLabel = live.updatedAt
    ? new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(live.updatedAt))
    : "—";

  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    "Opale, 38 Rue de France, 88300 Neufchâteau",
  )}&hl=${locale}&z=16&output=embed`;

  const reviews: LiveReview[] =
    live.reviews?.length > 0 ? live.reviews : fallbackState().reviews;

  return (
    <section id="avis" className="section-pad scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="section-title">{t("reviews.title")}</h2>
            <p className="section-sub">{t("reviews.subtitle")}</p>
            <p className="mt-3 text-xs text-[var(--fg-muted)]">
              {t("reviews.liveNote")}
              {` — ${t("reviews.updated", { date: updatedLabel })}`}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-[var(--accent)]">
                {live.rating.toFixed(1)}
              </span>
              <div>
                <Stars value={live.rating} />
                <p className="mt-1 text-sm text-[var(--fg-muted)]">
                  {t("reviews.count", { count: String(live.count) })}
                </p>
              </div>
            </div>
          </div>
        </header>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.li
              key={review.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex flex-col border-t border-[var(--border)] pt-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-[var(--fg)]">{review.author}</p>
                <Stars value={review.rating} />
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--fg-muted)]">
                {review.source}
                {review.dateLabel ? ` · ${review.dateLabel}` : ""}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--fg-soft)]">
                {review.text}
              </p>
            </motion.li>
          ))}
        </ul>

        {reviews.length === 0 && (
          <p className="mt-8 text-sm text-[var(--fg-muted)]">
            {t("reviews.empty")}
          </p>
        )}

        <div className="mt-12 overflow-hidden rounded-2xl border border-[var(--border)]">
          <iframe
            title={t("reviews.mapTitle")}
            src={mapsEmbed}
            className="h-72 w-full bg-[var(--bg-elevated)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={live.mapsReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            {t("reviews.seeAll")}
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
