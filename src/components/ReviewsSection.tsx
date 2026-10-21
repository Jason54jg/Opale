"use client";

import { motion } from "framer-motion";
import { ExternalLink, RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GOOGLE_REVIEWS, fallbackLiveReviews } from "@/data/reviews";
import type { LiveGoogleRating, LiveReview } from "@/lib/googleRating";
import { useI18n } from "@/i18n/context";

const REFRESH_MS = 30 * 60 * 1000;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Export statique (GitHub Pages) : l'API est figée au build, rien à rafraîchir. */
const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

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
    reviews: fallbackLiveReviews(),
  };
}

export function ReviewsSection() {
  const { t, locale } = useI18n();
  const [live, setLive] = useState<LiveGoogleRating>(fallbackState);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(`${BASE_PATH}/api/google-rating`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as LiveGoogleRating;
      if (typeof data.rating === "number" && typeof data.count === "number") {
        setLive({
          ...data,
          reviews: Array.isArray(data.reviews)
            ? data.reviews
            : fallbackState().reviews,
        });
      }
    } catch {
      // keep previous / fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
    if (IS_STATIC) return;
    const id = window.setInterval(() => void load(), REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const updatedLabel = live.updatedAt
    ? new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(live.updatedAt))
    : "—";

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
              {t(IS_STATIC ? "reviews.snapshotNote" : "reviews.liveNote")}
              {loading
                ? ` — ${t("reviews.loading")}`
                : ` — ${t("reviews.updated", { date: updatedLabel })}`}
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
              {!IS_STATIC && (
                <button
                  type="button"
                  onClick={() => void load(true)}
                  disabled={refreshing}
                  className="ml-2 rounded-full border border-[var(--border)] p-2 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-50"
                  aria-label={t("reviews.refresh")}
                  title={t("reviews.refresh")}
                >
                  <RefreshCw
                    className={`size-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </button>
              )}
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
                {locale === "en" && review.textEn ? review.textEn : review.text}
              </p>
            </motion.li>
          ))}
        </ul>

        {reviews.length === 0 && (
          <p className="mt-8 text-sm text-[var(--fg-muted)]">
            {t("reviews.empty")}
          </p>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href={live.mapsReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            {t("reviews.seeAll")}
            <ExternalLink className="size-4" aria-hidden />
          </a>
          {!IS_STATIC && (
            <button
              type="button"
              onClick={() => void load(true)}
              className="btn-ghost"
              disabled={refreshing}
            >
              <RefreshCw
                className={`size-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {t("reviews.refresh")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
