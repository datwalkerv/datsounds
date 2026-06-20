"use client";

import Image from "next/image";
import { Heart, Mic2, Play, Pause } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { DownloadMenu } from "@/components/DownloadMenu";
import { formatMs, getCoverUrl, cn } from "@/lib/utils";
import { Track } from "@/types/track";
import { MiniWaveform } from "@/components/MiniWaveform";

function SavedTrackRow({
  track,
  savedAt,
  queue,
  index,
}: {
  track: Track;
  savedAt: string;
  queue: Track[];
  index: number;
}) {
  const { state, playTrack, togglePlay, toggleLike } = usePlayer();
  const isActive = state.currentTrack?.id === track.id;
  const isPlaying = isActive && state.isPlaying;
  const isLiked = state.likedIds.includes(track.id);
  const isDownloaded = state.downloadedIds.includes(track.id);
  const artist = track.creatives.mainArtists[0]?.name ?? "Unknown Artist";
  const coverUrl = getCoverUrl(track.coverArt?.baseUrl, track.coverArt?.sizes, "XS");
  const durationSecs = track.length ?? track.durationMs / 1000;
  const genreTag = track.genres[0]?.displayTag ?? null;
  const moodTag = track.moods[0]?.displayTag ?? null;

  const savedDate = new Date(savedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "track-card group flex items-center gap-3 px-4 py-2 cursor-pointer border-l-2 transition-all duration-150",
        isActive ? "active border-l-[#39FF14] bg-[#111]/60" : "border-l-transparent"
      )}
      onClick={() => (isActive ? togglePlay() : playTrack(track, queue))}
    >
      {/* Cover */}
      <div className="relative w-10 h-10 shrink-0">
        <div
          className={cn(
            "absolute inset-0 rounded-md overflow-hidden",
            isActive && "ring-1 ring-[#39FF14]/60 shadow-[0_0_8px_rgba(57,255,20,0.3)]"
          )}
        >
          {coverUrl ? (
            <Image src={coverUrl} alt={track.title} fill className="object-cover" sizes="40px" unoptimized />
          ) : (
            <div className="w-full h-full bg-[#1f1f1f] flex items-center justify-center text-[#555] text-xs">{index + 1}</div>
          )}
        </div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-md bg-black/50 transition-opacity duration-150",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isPlaying ? (
            <Pause size={14} className="text-white fill-white" />
          ) : (
            <Play size={14} className="text-white fill-white ml-0.5" />
          )}
        </div>
      </div>

      {/* Title + artist */}
      <div className="min-w-0 w-[200px] shrink-0">
        <div className="flex items-center gap-1 truncate">
          <span className={cn("text-sm font-medium truncate", isActive ? "text-[#39FF14]" : "text-[#f0f0f0]")}>
            {track.title}
          </span>
          <Heart size={10} className="text-[#39FF14] fill-[#39FF14] shrink-0" />
          {isDownloaded && <span className="text-[9px] text-[#39FF14] shrink-0">⬇</span>}
          {track.hasVocals && <Mic2 size={10} className="text-[#777] shrink-0" />}
        </div>
        <div className="text-xs text-[#555] truncate">{artist}</div>
      </div>

      {/* Genre/Mood */}
      <div className="w-[120px] shrink-0 flex flex-wrap gap-1">
        {genreTag && (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1a] text-[#666] border border-[#222] truncate max-w-full">
            {genreTag}
          </span>
        )}
        {moodTag && (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a2a14] text-[#4a7a3a] border border-[#1f2e1a] truncate max-w-full">
            {moodTag}
          </span>
        )}
      </div>

      {/* Waveform */}
      <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
        <MiniWaveform waveformUrl={track.stems.full.waveformUrl} trackId={track.id} duration={durationSecs} />
      </div>

      {/* BPM */}
      <div className="w-12 text-right text-xs text-[#555] shrink-0">
        {track.bpm} <span className="text-[10px]">bpm</span>
      </div>

      {/* Duration */}
      <div className="w-10 text-right text-xs text-[#777] shrink-0 tabular-nums">
        {formatMs(track.durationMs)}
      </div>

      {/* Saved date */}
      <div className="w-20 text-right text-[10px] text-[#444] shrink-0">{savedDate}</div>

      {/* Like (unlike) */}
      <button
        className="btn-icon p-1.5 rounded-md shrink-0 text-[#39FF14] transition-all"
        onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
        title="Unlike"
      >
        <Heart size={14} className="fill-[#39FF14]" />
      </button>

      {/* Download */}
      <div className={cn("shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", isDownloaded && "opacity-100")}>
        <DownloadMenu track={track} />
      </div>
    </div>
  );
}

export function SavedClient() {
  const { state } = usePlayer();

  // Sort by savedAt desc
  const entries = [...state.likedEntries].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );

  const tracks = entries.map((e) => e.track);

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#555]">
        <Heart size={40} className="mb-3 text-[#333]" />
        <p className="text-sm">No saved tracks yet</p>
        <p className="text-xs text-[#444] mt-1">Click the ❤ on any track to save it here</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1f1f1f] text-[10px] uppercase tracking-widest text-[#444]">
        <div className="w-10 shrink-0">#</div>
        <div className="w-[200px] shrink-0">Title</div>
        <div className="w-[120px] shrink-0">Genre / Mood</div>
        <div className="flex-1">Waveform</div>
        <div className="w-12 text-right shrink-0">BPM</div>
        <div className="w-10 text-right shrink-0">Time</div>
        <div className="w-20 text-right shrink-0">Saved</div>
        <div className="w-[52px] shrink-0" />
      </div>

      {entries.map((entry, i) => (
        <SavedTrackRow
          key={entry.track.id}
          track={entry.track}
          savedAt={entry.savedAt}
          queue={tracks}
          index={i}
        />
      ))}
    </div>
  );
}
