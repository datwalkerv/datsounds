import { Track } from "@/types/track";

export const UPSTREAM_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json",
};

const ES = "https://www.epidemicsound.com/json";
const SEGMENTS =
  "segment_types=music-structure%40v2&segment_types=predicted-popular-15sec";

export const SORTS = {
  popular: "neutral-pop28",
  latest: "date",
  relevance: "relevance",
} as const;
export type Sort = keyof typeof SORTS;

export type Kind = "tracks" | "sfx";

export function searchUrl(sort: Sort, term: string, page: number, kind: Kind = "tracks") {
  const common = `order=desc&page=${page}&sort=${SORTS[sort]}&term=${encodeURIComponent(term)}`;
  return kind === "sfx"
    ? `${ES}/search/sfx/?${common}`
    : `${ES}/search/tracks/?${common}&${SEGMENTS}&segment_types=soundly-sfx`;
}

export function trackUrl(kosmosId: string) {
  return `${ES}/track/kosmos-id/${kosmosId}/?${SEGMENTS}`;
}

const STEM_LABELS: Record<string, string> = {
  full: "Full Track",
  bass: "Bass",
  drums: "Drums",
  instruments: "Instruments",
  melody: "Melody",
};

function link(origin: string, track: Track, stem: string, mp3: string) {
  const filename = `${track.title} - ${STEM_LABELS[stem] ?? stem} [datsounds].mp3`;
  return `${origin}/api/download?url=${encodeURIComponent(mp3)}&filename=${encodeURIComponent(filename)}`;
}

export function toPublicTrack(track: Track, origin: string, withStems = false) {
  const full = track.stems?.full?.lqMp3Url ?? null;
  const out: Record<string, unknown> = {
    id: track.id,
    kosmosId: track.kosmosId ?? null,
    title: track.title,
    artists: [
      ...(track.creatives?.mainArtists ?? []),
      ...(track.creatives?.featuredArtists ?? []),
    ].map((c) => c.name),
    bpm: track.bpm,
    durationSec: track.length,
    energy: track.energyLevel,
    genres: (track.genres ?? []).map((g) => g.displayTag),
    moods: (track.moods ?? []).map((m) => m.displayTag),
    hasVocals: track.hasVocals,
    isSfx: track.isSfx,
    added: track.added,
    cover: track.coverArt?.sizes?.M
      ? track.coverArt.baseUrl + track.coverArt.sizes.M
      : track.imageUrl ?? null,
    preview: full,
    download: full ? link(origin, track, "full", full) : null,
  };
  if (withStems) {
    out.stems = Object.fromEntries(
      Object.entries(track.stems ?? {})
        .filter(([, s]) => s?.lqMp3Url)
        .map(([k, s]) => [k, { preview: s.lqMp3Url, download: link(origin, track, k, s.lqMp3Url) }])
    );
  }
  return out;
}

export const PUBLIC_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};
