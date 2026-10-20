import { fetchLiveGoogleRating } from "@/lib/googleRating";

export async function GET() {
  const data = await fetchLiveGoogleRating();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
