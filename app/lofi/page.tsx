import { fetchLofi } from "@/lib/api";
import { TrackList } from "@/components/TrackList";
import { Headphones } from "lucide-react";
import { Track } from "@/types/track";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lofi — datsounds",
  description: "Chill lofi hip hop tracks to study and relax to",
};

export default async function LofiPage() {
  let tracks: Track[] = [];
  let error: string | null = null;

  try {
    tracks = await fetchLofi();
  } catch (e) {
    error = "Failed to load lofi tracks.";
    console.error(e);
  }

  return (
    <div className="animate-fade-in">
      <div className="px-6 py-5 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 mb-1">
          <Headphones size={16} className="text-[#39FF14]" />
          <h1 className="font-serif text-2xl text-[#f0f0f0]">Lofi</h1>
        </div>
        <p className="text-sm text-[#555]">
          Chill beats to study, relax, and vibe
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
