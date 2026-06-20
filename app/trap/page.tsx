import { fetchTrap } from "@/lib/api";
import { TrackList } from "@/components/TrackList";
import { Zap } from "lucide-react";
import { Track } from "@/types/track";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trap — datsounds",
  description: "Hard-hitting trap beats and bass-heavy tracks",
};

export default async function TrapPage() {
  let tracks: Track[] = [];
  let error: string | null = null;

  try {
    tracks = await fetchTrap();
  } catch (e) {
    error = "Failed to load trap tracks.";
    console.error(e);
  }

  return (
    <div className="animate-fade-in">
      <div className="px-6 py-5 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} className="text-[#39FF14]" />
          <h1 className="font-serif text-2xl text-[#f0f0f0]">Trap</h1>
        </div>
        <p className="text-sm text-[#555]">
          Hard-hitting trap, bass, and drill
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
