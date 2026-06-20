import { fetchSearch } from "@/lib/api";
import { TrackList } from "@/components/TrackList";
import { Search } from "lucide-react";
import { Track } from "@/types/track";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#555]">
        <Search size={36} className="mb-3 text-[#333]" />
        <p className="text-sm">Enter a search term to discover tracks</p>
      </div>
    );
  }

  let tracks: Track[] = [];
  let error: string | null = null;

  try {
    tracks = await fetchSearch(query);
  } catch (e) {
    error = "Search failed. Please try again.";
    console.error(e);
  }

  return (
    <div className="animate-fade-in">
      <div className="px-6 py-5 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 mb-1">
          <Search size={16} className="text-[#39FF14]" />
          <h1 className="font-serif text-2xl text-[#f0f0f0]">
            Results for{" "}
            <span className="text-[#39FF14]">&ldquo;{query}&rdquo;</span>
          </h1>
        </div>
        {!error && (
          <p className="text-sm text-[#555]">
            {tracks.length} track{tracks.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {error ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </div>
  );
}
