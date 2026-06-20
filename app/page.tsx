import { fetchLatest } from "@/lib/api";
import { TrackList } from "@/components/TrackList";
import { Sparkles } from "lucide-react";
import { Track } from "@/types/track";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let tracks: Track[] = [];
  let error: string | null = null;

  try {
    tracks = await fetchLatest();
  } catch (e) {
    error = "Failed to load tracks. Please try again later.";
    console.error(e);
  }

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-[#39FF14]" />
          <h1 className="font-serif text-2xl text-[#f0f0f0]">Latest Sounds</h1>
        </div>
        <p className="text-sm text-[#555]">
          Fresh tracks sorted by release date
        </p>
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
