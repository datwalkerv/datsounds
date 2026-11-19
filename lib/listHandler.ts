import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/track";
import { Kind, PUBLIC_HEADERS, SORTS, Sort, UPSTREAM_HEADERS, searchUrl, toPublicTrack } from "@/lib/epidemic";

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { "Access-Control-Allow-Origin": "*" } });
}

// Shared GET handler for /api/v1/tracks and /api/v1/sfx (server-only: imports next/server)
export function listHandler(kind: Kind) {
  return async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const q = (params.get("q") ?? "").trim();
    const sort = params.get("sort") ?? (q ? "relevance" : kind === "sfx" ? "latest" : "popular");
    const page = Number(params.get("page") ?? "1");

    if (!(sort in SORTS)) return bad(`Invalid sort. Use one of: ${Object.keys(SORTS).join(", ")}`);
    if (!Number.isInteger(page) || page < 1 || page > 100) return bad("Invalid page. Use an integer from 1 to 100");
    if (q.length > 100) return bad("q must be at most 100 characters");

    try {
      const upstream = await fetch(searchUrl(sort as Sort, q, page, kind), {
        headers: UPSTREAM_HEADERS,
        next: { revalidate: 300 },
      });
      if (!upstream.ok) return bad(`Upstream error: ${upstream.status}`, 502);
      const data: ApiResponse & {
        meta?: { hits?: { trackId: number }[]; totalPages?: number; totalHits?: number };
      } = await upstream.json();
      const byId = data?.entities?.tracks ?? {};
      // entities.tracks is keyed by numeric id, so JS re-sorts it; meta.hits keeps upstream ranking
      const ordered = data?.meta?.hits?.map((h) => byId[h.trackId]).filter(Boolean) ?? Object.values(byId);
      const tracks = ordered.map((t) => toPublicTrack(t, request.nextUrl.origin));
      return NextResponse.json(
        {
          page,
          totalPages: data?.meta?.totalPages ?? null,
          totalHits: data?.meta?.totalHits ?? null,
          sort,
          q,
          count: tracks.length,
          tracks,
        },
        { headers: PUBLIC_HEADERS }
      );
    } catch {
      return bad("Upstream request failed", 502);
    }
  };
}
