import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const filename = request.nextUrl.searchParams.get("filename") ?? "track.mp3";

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Security: only allow epidemicsound CDN audio URLs
  if (!url.startsWith("https://audiocdn.epidemicsound.com/")) {
    return new NextResponse("Forbidden: invalid URL domain", { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: 502,
      });
    }

    const blob = await upstream.blob();

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Download failed", { status: 500 });
  }
}
