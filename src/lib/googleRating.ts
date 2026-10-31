import { BUSINESS } from "@/data/menu";
import { GOOGLE_REVIEWS, fallbackLiveReviews } from "@/data/reviews";

export type LiveReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  /** Traduction anglaise, connue seulement pour les avis de secours. */
  textEn?: string;
  source: string;
  dateLabel: string;
  /** Ancienneté estimée en jours (absente si inconnue). */
  ageDays?: number;
};

export type LiveGoogleRating = {
  rating: number;
  count: number;
  source: string;
  /** ISO ; vide quand les données viennent du cache codé en dur. */
  updatedAt: string;
  mapsReviewsUrl: string;
  reviews: LiveReview[];
};

/** Nombre d'avis affichés sur le site. */
const REVIEWS_SHOWN = 3;

/** Carte Google intégrée : contient la note et le nombre d'avis de la fiche, sans clé API. */
const GOOGLE_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  BUSINESS.mapsQuery,
)}&hl=fr&z=16&output=embed`;
const RANKEAT_URL = "https://rankeat.fr/restaurants/opale-neufchateau";
const RESTAURANT_GURU_URL = "https://fr.restaurantguru.com/Opale-Neufchateau";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
  Referer: "https://www.google.com/",
};

export function fallbackRating(): LiveGoogleRating {
  return {
    rating: GOOGLE_REVIEWS.rating,
    count: GOOGLE_REVIEWS.count,
    source: "cache",
    updatedAt: "",
    mapsReviewsUrl: GOOGLE_REVIEWS.mapsReviewsUrl,
    reviews: fallbackLiveReviews(),
  };
}

/** Note + nombre d'avis Google, ex. `4.5,"290 avis"` dans la carte intégrée. */
export function parseGoogleEmbedRating(
  html: string,
): { rating: number; count: number } | null {
  const match = html.match(
    /,(\d(?:\.\d)?),"([\d\s\u00a0\u202f.,]+)\s*(?:avis|reviews)"/,
  );
  if (!match) return null;
  const rating = Number(match[1]);
  const count = Number(match[2].replace(/\D/g, ""));
  return rating > 0 && rating <= 5 && count > 0 ? { rating, count } : null;
}

/** « 17 jours plus tôt », « il y a 3 ans », « un mois »… → jours. */
export function parseAgeDays(label: string): number | undefined {
  const lower = label.toLowerCase();
  if (/aujourd/.test(lower)) return 0;
  if (/hier/.test(lower)) return 1;
  const match = lower.match(/(\d+|une?)\s*(minute|heure|jour|semaine|mois|an)/);
  if (!match) return undefined;
  const n = /^\d+$/.test(match[1]) ? Number(match[1]) : 1;
  const unitDays: Record<string, number> = {
    minute: 0,
    heure: 0,
    jour: 1,
    semaine: 7,
    mois: 30,
    an: 365,
  };
  return n * unitDays[match[2]];
}

/**
 * Meilleures notes d'abord, puis avis Google avant les autres sources,
 * puis les plus récents ; date inconnue en dernier.
 */
export function pickLatestBest(
  reviews: LiveReview[],
  limit = REVIEWS_SHOWN,
): LiveReview[] {
  const age = (r: LiveReview) => r.ageDays ?? Number.MAX_SAFE_INTEGER;
  const google = (r: LiveReview) => (r.source === "Google" ? 0 : 1);
  return [...reviews]
    .sort(
      (a, b) =>
        b.rating - a.rating || google(a) - google(b) || age(a) - age(b),
    )
    .slice(0, limit);
}

function starsFromWidth(html: string): number | null {
  const match = html.match(/<span style="width:\s*([0-9.]+)%/i);
  if (!match) return null;
  return Math.max(1, Math.min(5, Math.round(Number(match[1]) / 20)));
}

/** Début du texte réduit aux lettres/chiffres, pour reconnaître un même avis. */
function textKey(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 40);
}

function decodeHtml(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(Number.parseInt(n, 16)),
    );
}

function cleanText(input: string): string {
  let text = input.replace(/<br\s*\/?>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = decodeHtml(text);
  text = text.replace(/\s*Food:\s*\d[\s\S]*$/i, "");
  return text.replace(/\s+/g, " ").trim();
}

function parseJsonLdRating(
  html: string,
): { rating: number; count: number } | null {
  const scripts = html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  );

  for (const match of scripts) {
    try {
      const data = JSON.parse(match[1]) as Record<string, unknown>;
      const agg = data.aggregateRating as
        | {
            ratingValue?: number | string;
            reviewCount?: number | string;
            ratingCount?: number | string;
          }
        | undefined;
      if (!agg?.ratingValue) continue;

      const rating = Number(String(agg.ratingValue).replace(",", "."));
      const count = Number(agg.reviewCount ?? agg.ratingCount);
      if (Number.isFinite(rating) && Number.isFinite(count) && count > 0) {
        return { rating, count };
      }
    } catch {
      // ignore invalid JSON-LD
    }
  }

  return null;
}

function slugId(author: string, index: number): string {
  const base = author
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "avis"}-${index}`;
}

/** Avis Google publiés via Restaurant Guru (miroir public). */
export function parseRestaurantGuruReviews(html: string): LiveReview[] {
  const blocks = html.split(/<div class="user_info">/i).slice(1);
  const reviews: LiveReview[] = [];

  for (const block of blocks) {
    const nameMatch = block.match(
      /class="user_info__name"[^>]*>([^<]+)<\/(?:a|span)>/i,
    );
    if (!nameMatch) continue;

    const dateMatch = block.match(/<span class="grey">([^<]+)<\/span>/i);
    const dateLabel = dateMatch ? cleanText(dateMatch[1]) : "";
    const isGoogle = /google/i.test(dateLabel) || /sur Google/i.test(block.slice(0, 900));

    // Sans note lisible, on ignore l'avis plutôt que d'inventer des étoiles
    const rating = starsFromWidth(block);
    if (rating == null) continue;

    let textMatch = block.match(
      /class="text_full"[^>]*>\s*<span class="text_group">([\s\S]*?)<\/span>/i,
    );
    if (!textMatch) {
      textMatch = block.match(
        /class="text_full[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
      );
    }
    if (!textMatch) continue;

    const text = cleanText(textMatch[1]);
    if (text.length < 12) continue;

    // Priorité aux avis issus de Google
    if (!isGoogle && reviews.filter((r) => r.source === "Google").length >= 3) {
      continue;
    }

    reviews.push({
      id: slugId(cleanText(nameMatch[1]), reviews.length),
      author: cleanText(nameMatch[1]),
      rating,
      text,
      source: isGoogle ? "Google" : "Restaurant Guru",
      dateLabel,
      ageDays: parseAgeDays(dateLabel),
    });
  }

  // Metin-style blocks without classic user_info split sometimes miss — catch comments__text
  if (reviews.length < 3) {
    const extra = [
      ...html.matchAll(
        /data-author="([^"]+)"[\s\S]{0,600}?class="text_full comments__text">([\s\S]*?)<\/span>/gi,
      ),
    ];
    for (const m of extra) {
      const author = cleanText(m[1]);
      const text = cleanText(m[2]);
      const rating = starsFromWidth(m[0]);
      if (!author || text.length < 12 || rating == null) continue;
      if (reviews.some((r) => r.author === author && r.text === text)) continue;
      reviews.push({
        id: slugId(author, reviews.length),
        author,
        rating,
        text,
        source: "Restaurant Guru",
        dateLabel: "",
      });
    }
  }

  // Google d'abord, puis les autres
  reviews.sort((a, b) => {
    if (a.source === "Google" && b.source !== "Google") return -1;
    if (b.source === "Google" && a.source !== "Google") return 1;
    return 0;
  });

  return reviews.slice(0, 6);
}

/**
 * Écarte les pages vides ou les challenges anti-bot (Cloudflare, captcha).
 * Test sur le <title> : les vraies pages embarquent souvent un script reCAPTCHA.
 */
function isUsableHtml(html: string, minLength: number): boolean {
  return (
    html.length > minLength &&
    !/<title>[^<]*(just a moment|attention required|captcha|access denied)/i.test(
      html,
    )
  );
}

async function fetchHtmlViaCurl(
  url: string,
  minLength: number,
): Promise<string | null> {
  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execFileAsync = promisify(execFile);
    const bin = process.platform === "win32" ? "curl.exe" : "curl";
    const { stdout } = await execFileAsync(
      bin,
      [
        "-sL",
        "--max-time",
        "25",
        "-A",
        BROWSER_HEADERS["User-Agent"],
        "-H",
        `Accept-Language: ${BROWSER_HEADERS["Accept-Language"]}`,
        "-H",
        `Referer: ${BROWSER_HEADERS.Referer}`,
        url,
      ],
      { maxBuffer: 6_000_000, windowsHide: true },
    );
    const html = stdout.toString();
    return isUsableHtml(html, minLength) ? html : null;
  } catch {
    return null;
  }
}

async function fetchHtml(
  url: string,
  minLength = 5000,
): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const html = await res.text();
      if (isUsableHtml(html, minLength)) return html;
    }
  } catch {
    // continue to curl fallback
  }
  return fetchHtmlViaCurl(url, minLength);
}

export async function fetchLiveGoogleRating(): Promise<LiveGoogleRating> {
  const fallback = fallbackRating();
  if (process.env.SKIP_LIVE_REVIEWS === "1") return fallback;

  try {
    const [embedHtml, rankeatHtml, guruHtml] = await Promise.all([
      fetchHtml(GOOGLE_EMBED_URL, 1000),
      fetchHtml(RANKEAT_URL),
      fetchHtml(RESTAURANT_GURU_URL),
    ]);

    let rating = fallback.rating;
    let count = fallback.count;
    let source = "cache";

    // Source directe Google en priorité, Rankeat (souvent en retard) en secours
    const fromGoogle = embedHtml ? parseGoogleEmbedRating(embedHtml) : null;
    if (fromGoogle) {
      rating = fromGoogle.rating;
      count = fromGoogle.count;
      source = "google-maps";
    } else if (rankeatHtml) {
      const parsed = parseJsonLdRating(rankeatHtml);
      if (parsed) {
        rating = Math.round(parsed.rating * 10) / 10;
        count = parsed.count;
        source = "google-via-rankeat";
      }
    }

    const scraped = guruHtml ? parseRestaurantGuruReviews(guruHtml) : [];
    if (scraped.length > 0) {
      source =
        source === "cache" ? "google-via-restaurant-guru" : `${source}+reviews`;
    }

    // Même avis que l'un des avis connus → reprend sa traduction anglaise
    const reviews = scraped.map((review) => {
      const known = fallback.reviews.find(
        (item) =>
          item.author === review.author &&
          textKey(item.text) === textKey(review.text),
      );
      return known ? { ...review, textEn: known.textEn } : review;
    });

    // Complète avec des avis Google connus s'ils manquent encore sur la page
    for (const item of fallback.reviews) {
      if (reviews.some((r) => r.author === item.author)) continue;
      reviews.push(item);
    }

    // Rankeat indisponible : nombre d'avis affiché explicitement par Guru
    if (source === "google-via-restaurant-guru" && guruHtml) {
      const countMatch = guruHtml.match(
        /\(([0-9]+(?:[.,][0-9]+)?)\s*\/\s*5\)[\s\S]{0,80}?\b([0-9]{2,5})\s*(?:avis|reviews|commentaires)\b/i,
      );
      if (countMatch) count = Number(countMatch[2]);
    }

    return {
      rating,
      count,
      source,
      updatedAt: source === "cache" ? "" : new Date().toISOString(),
      mapsReviewsUrl: GOOGLE_REVIEWS.mapsReviewsUrl,
      reviews: pickLatestBest(reviews),
    };
  } catch {
    return fallback;
  }
}
