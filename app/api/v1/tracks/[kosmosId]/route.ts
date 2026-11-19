import { NextRequest, NextResponse } from "next/server";
import { Track } from "@/types/track";
import { PUBLIC_HEADERS, UPSTREAM_HEADERS, toPublicTrack, trackUrl } from "@/lib/epidemic";

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { "Access-Control-Allow-Origin": "*" } });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kosmosId: string }> }
) {
  const { kosmosId } = await params;
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(kosmosId)) return bad("Invalid kosmosId");

  try {
    const upstream = await fetch(trackUrl(kosmosId), {
      headers: UPSTREAM_HEADERS,
      next: { revalidate: 300 },
    });
    if (upstream.status === 404) return bad("Track not found", 404);
    if (!upstream.ok) return bad(`Upstream error: ${upstream.status}`, 502);
    const track: Track = await upstream.json();
    if (!track?.stems) return bad("Track not found", 404);
    return NextResponse.json(toPublicTrack(track, request.nextUrl.origin, true), { headers: PUBLIC_HEADERS });
  } catch {
    return bad("Upstream request failed", 502);
  }
}
