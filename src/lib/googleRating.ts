import { GOOGLE_REVIEWS } from "@/data/reviews";

export type LiveReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: string;
  dateLabel: string;
};

export type LiveGoogleRating = {
  rating: number;
  count: number;
  source: string;
  updatedAt: string;
  mapsReviewsUrl: string;
  reviews: LiveReview[];
};

const RANKEAT_URL = "https://rankeat.fr/restaurants/opale-neufchateau";
const RESTAURANT_GURU_URL = "https://fr.restaurantguru.com/Opale-Neufchateau";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
  Referer: "https://www.google.com/",
};

function fallbackReviews(): LiveReview[] {
  return GOOGLE_REVIEWS.items.map((item) => ({
    id: item.id,
    author: item.author,
    rating: item.rating,
    text: item.textFr,
    source: item.source,
    dateLabel: "",
  }));
}

const FALLBACK: LiveGoogleRating = {
  rating: GOOGLE_REVIEWS.rating,
  count: GOOGLE_REVIEWS.count,
  source: "cache",
  updatedAt: new Date(0).toISOString(),
  mapsReviewsUrl: GOOGLE_REVIEWS.mapsReviewsUrl,
  reviews: fallbackReviews(),
};

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

    const starsMatch = block.match(/<span style="width:\s*([0-9.]+)%/i);
    const width = starsMatch ? Number(starsMatch[1]) : 100;
    const rating = Math.max(1, Math.min(5, Math.round(width / 20)));

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
      if (!author || text.length < 12) continue;
      if (reviews.some((r) => r.author === author && r.text === text)) continue;
      reviews.push({
        id: slugId(author, reviews.length),
        author,
        rating: 5,
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

async function fetchHtmlViaCurl(url: string): Promise<string | null> {
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
    return html.length > 5000 ? html : null;
  } catch {
    return null;
  }
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const html = await res.text();
      if (html.length > 5000 && !/just a moment|captcha|access denied/i.test(html)) {
        return html;
      }
    }
  } catch {
    // continue to curl fallback
  }
  return fetchHtmlViaCurl(url);
}

export async function fetchLiveGoogleRating(): Promise<LiveGoogleRating> {
  const updatedAt = new Date().toISOString();

  try {
    const [rankeatHtml, guruHtml] = await Promise.all([
      fetchHtml(RANKEAT_URL),
      fetchHtml(RESTAURANT_GURU_URL),
    ]);

    let rating = FALLBACK.rating;
    let count = FALLBACK.count;
    let source = "cache";

    if (rankeatHtml) {
      const parsed = parseJsonLdRating(rankeatHtml);
      if (parsed) {
        rating = Math.round(parsed.rating * 10) / 10;
        count = parsed.count;
        source = "google-via-rankeat";
      }
    }

    let reviews = guruHtml ? parseRestaurantGuruReviews(guruHtml) : [];

    // Complète avec des avis Google connus s'ils manquent encore sur la page
    for (const item of fallbackReviews()) {
      if (reviews.some((r) => r.author === item.author)) continue;
      if (reviews.length >= 6) break;
      reviews.push(item);
    }

    if (reviews.length === 0) {
      reviews = fallbackReviews();
    } else if (source === "cache") {
      source = "google-via-restaurant-guru";
    } else {
      source = `${source}+reviews`;
    }

    // Si le count Rankeat n'a pas bougé, tente une estimation Guru
    if (source !== "cache" && count === FALLBACK.count && guruHtml) {
      const countMatch = guruHtml.match(
        /\(([0-9]+(?:[.,][0-9]+)?)\s*\/\s*5\)[\s\S]{0,80}?([0-9]{2,4})/,
      );
      if (countMatch) {
        const maybe = Number(countMatch[2]);
        if (maybe > 50) count = maybe;
      }
    }

    return {
      rating,
      count,
      source,
      updatedAt,
      mapsReviewsUrl: GOOGLE_REVIEWS.mapsReviewsUrl,
      reviews,
    };
  } catch {
    return { ...FALLBACK, updatedAt, reviews: fallbackReviews() };
  }
}
