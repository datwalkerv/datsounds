import { fetchPopular } from "@/lib/api";
import { PopularClient } from "./PopularClient";
import { Track } from "@/types/track";

export const dynamic = "force-dynamic";

export default async function PopularPage() {
  let tracks: Track[] = [];
  let error: string | null = null;

  try {
    tracks = await fetchPopular();
  } catch (e) {
    error = "Failed to load popular tracks.";
    console.error(e);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return <PopularClient tracks={tracks} />;
}
