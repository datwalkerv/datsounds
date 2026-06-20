import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Security: only allow epidemicsound URLs
  if (!url.startsWith("https://www.epidemicsound.com/")) {
    return new NextResponse("Forbidden: invalid URL domain", { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(error?.message || "Proxy failed", { status: 500 });
  }
}
