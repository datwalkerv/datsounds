import { Track, ApiResponse, EnergyLevel } from "@/types/track";

const PROXY = "https://ikcors.azurewebsites.net/api/proxy/";

const POPULAR_URL =
  "https%3A%2F%2Fwww.epidemicsound.com%2Fjson%2Fsearch%2Ftracks%2F%3Forder%3Ddesc%26page%3D1%26segment_types%3Dmusic-structure%2540v2%26segment_types%3Dpredicted-popular-15sec%26segment_types%3Dsoundly-sfx%26sort%3Dneutral-pop28%26term%3D";

const SEARCH_URL =
  "https%3A%2F%2Fwww.epidemicsound.com%2Fjson%2Fsearch%2Ftracks%2F%3Forder%3Ddesc%26page%3D1%26segment_types%3Dmusic-structure%2540v2%26segment_types%3Dpredicted-popular-15sec%26segment_types%3Dsoundly-sfx%26sort%3Drelevance%26term%3D";

function normalizeTracks(response: ApiResponse): Track[] {
  if (!response?.entities?.tracks) return [];
  return Object.values(response.entities.tracks);
}

async function fetchTracks(url: string): Promise<Track[]> {
  const res = await fetch(PROXY + url, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data: ApiResponse = await res.json();
  return normalizeTracks(data);
}

const ENERGY_ORDER: Record<EnergyLevel, number> = {
  low: 0,
  medium: 1,
  variable: 2,
  high: 3,
};

export async function fetchLatest(): Promise<Track[]> {
  const tracks = await fetchTracks(POPULAR_URL);
  return tracks.sort(
    (a, b) => new Date(b.added).getTime() - new Date(a.added).getTime()
  );
}

export async function fetchPopular(): Promise<Track[]> {
  const tracks = await fetchTracks(POPULAR_URL);
  return tracks.sort(
    (a, b) =>
      (ENERGY_ORDER[a.energyLevel] ?? 0) - (ENERGY_ORDER[b.energyLevel] ?? 0)
  );
}

export async function fetchSearch(term: string): Promise<Track[]> {
  const encoded = encodeURIComponent(term);
  return fetchTracks(SEARCH_URL + encoded);
}

export async function fetchLofi(): Promise<Track[]> {
  return fetchSearch("lofi");
}

export async function fetchTrap(): Promise<Track[]> {
  return fetchSearch("trap");
}
