import type { LiveReview } from "@/lib/googleRating";

/** Fallback si le scrape public est indisponible — avis Google réels. */
export const GOOGLE_REVIEWS = {
  rating: 4.5,
  count: 250,
  mapsReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=Opale+38+Rue+de+France+88300+Neufch%C3%A2teau",
  items: [
    {
      id: "franck",
      author: "Franck Glaziou",
      rating: 5,
      source: "Google",
      textFr:
        "Très bon kebab. La cuisine est de qualité. Le patron est tres accueillant.",
      textEn:
        "Very good kebab. Quality cooking. The owner is very welcoming.",
    },
    {
      id: "kenes",
      author: "Kenes T.",
      rating: 5,
      source: "Google",
      textFr:
        "1er fois au opale à Neufchateau, je retrouve les millésimes de la bonne restauration classique, en bref j’ai passé un excellent moment à déguster.",
      textEn:
        "First time at Opale in Neufchateau — classic good food done right. In short, I had an excellent meal.",
    },
    {
      id: "alan",
      author: "Alan Leroy",
      rating: 5,
      source: "Google",
      textFr:
        "Un excellent kebab, de bons produits ainsi qu’un accueil et un service impeccable. J’ai pris une assiette orientale, généreusement bien garnie et des produits d’une excellente qualité ! Je recommande !",
      textEn:
        "An excellent kebab, great products, and impeccable welcome and service. I had an Oriental plate — generously filled with excellent quality. Highly recommend!",
    },
  ],
} as const;

/** Avis de secours au format affiché (texte FR + traduction EN). */
export function fallbackLiveReviews(): LiveReview[] {
  return GOOGLE_REVIEWS.items.map((item) => ({
    id: item.id,
    author: item.author,
    rating: item.rating,
    text: item.textFr,
    textEn: item.textEn,
    source: item.source,
    dateLabel: "",
  }));
}
