import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "x-api-key",
};

// Hash both sides so lengths match and the compare is constant-time
const digest = (s: string) => createHash("sha256").update(s).digest();

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") return new NextResponse(null, { status: 204, headers: CORS });

  const expected = process.env.DATSOUNDS_API_KEY;
  if (!expected) {
    return NextResponse.json({ error: "API key not configured on server" }, { status: 503, headers: CORS });
  }

  const given = request.headers.get("x-api-key") ?? "";
  if (!given || !timingSafeEqual(digest(given), digest(expected))) {
    return NextResponse.json(
      { error: "Missing or invalid API key. Send it in the x-api-key header." },
      { status: 401, headers: CORS }
    );
  }
}

export const config = { matcher: "/api/v1/:path*" };
