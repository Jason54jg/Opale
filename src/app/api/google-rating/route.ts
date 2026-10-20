import { fetchLiveGoogleRating } from "@/lib/googleRating";

/**
 * Statique + revalidate 30 min : compatible export GitHub Pages (snapshot au build)
 * et ISR live avec `next start` / Vercel.
 */
export const dynamic = "force-static";
export const revalidate = 1800;

export async function GET() {
  const data = await fetchLiveGoogleRating();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
