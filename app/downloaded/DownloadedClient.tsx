"use client";

import Image from "next/image";
import { Mic2, Play, Pause, Heart, Download } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { DownloadMenu } from "@/components/DownloadMenu";
import { formatMs, getCoverUrl, cn } from "@/lib/utils";
import { Track } from "@/types/track";
import { MiniWaveform } from "@/components/MiniWaveform";

const STEM_LABELS: Record<string, string> = {
  full: "Full Song",
  bass: "Bass",
  drums: "Drums",
  instruments: "Instruments",
  melody: "Melody",
};

function DownloadedTrackRow({
  track,
  downloadedAt,
  stemType,
  queue,
  index,
}: {
  track: Track;
  downloadedAt: string;
  stemType: string;
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

  const downloadedDate = new Date(downloadedAt).toLocaleDateString("en-US", {
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
        <div className={cn("absolute inset-0 rounded-md overflow-hidden", isActive && "ring-1 ring-[#39FF14]/60")}>
          {coverUrl ? (
            <Image src={coverUrl} alt={track.title} fill className="object-cover" sizes="40px" unoptimized />
          ) : (
            <div className="w-full h-full bg-[#1f1f1f] flex items-center justify-center text-[#555] text-xs">{index + 1}</div>
          )}
        </div>
        <div className={cn("absolute inset-0 flex items-center justify-center rounded-md bg-black/50 transition-opacity duration-150", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
          {isPlaying ? <Pause size={14} className="text-white fill-white" /> : <Play size={14} className="text-white fill-white ml-0.5" />}
        </div>
      </div>

      {/* Title + artist */}
      <div className="min-w-0 w-[200px] shrink-0">
        <div className="flex items-center gap-1 truncate">
          <span className={cn("text-sm font-medium truncate", isActive ? "text-[#39FF14]" : "text-[#f0f0f0]")}>
            {track.title}
          </span>
          {isLiked && <Heart size={10} className="text-[#39FF14] fill-[#39FF14] shrink-0" />}
          <Download size={10} className="text-[#39FF14] shrink-0" />
          {track.hasVocals && <Mic2 size={10} className="text-[#777] shrink-0" />}
        </div>
        <div className="text-xs text-[#555] truncate">{artist}</div>
      </div>

      {/* Stem type badge */}
      <div className="w-[100px] shrink-0">
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#1a2a14] text-[#39FF14] border border-[#39FF14]/20">
          {STEM_LABELS[stemType] ?? stemType}
        </span>
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

      {/* Downloaded date */}
      <div className="w-20 text-right text-[10px] text-[#444] shrink-0">{downloadedDate}</div>

      {/* Like */}
      <button
        className={cn("btn-icon p-1.5 rounded-md shrink-0 transition-all", isLiked ? "text-[#39FF14]" : "text-[#444] hover:text-[#39FF14] opacity-0 group-hover:opacity-100")}
        onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
        title={isLiked ? "Unlike" : "Like"}
      >
        <Heart size={14} className={isLiked ? "fill-[#39FF14]" : ""} />
      </button>

      {/* Download again */}
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <DownloadMenu track={track} />
      </div>
    </div>
  );
}

export function DownloadedClient() {
  const { state } = usePlayer();

  // Sort by downloadedAt desc, deduplicate by track+stem combo
  const entries = [...state.downloadedEntries].sort(
    (a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
  );

  // Queue = unique tracks only
  const tracks = Array.from(
    new Map(entries.map((e) => [e.track.id, e.track])).values()
  );

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#555]">
        <Download size={40} className="mb-3 text-[#333]" />
        <p className="text-sm">No downloaded tracks yet</p>
        <p className="text-xs text-[#444] mt-1">Click the ↓ on any track to download stems</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1f1f1f] text-[10px] uppercase tracking-widest text-[#444]">
        <div className="w-10 shrink-0">#</div>
        <div className="w-[200px] shrink-0">Title</div>
        <div className="w-[100px] shrink-0">Stem</div>
        <div className="flex-1">Waveform</div>
        <div className="w-12 text-right shrink-0">BPM</div>
        <div className="w-10 text-right shrink-0">Time</div>
        <div className="w-20 text-right shrink-0">Downloaded</div>
        <div className="w-[52px] shrink-0" />
      </div>

      {entries.map((entry, i) => (
        <DownloadedTrackRow
          key={`${entry.track.id}-${entry.stemType}-${entry.downloadedAt}`}
          track={entry.track}
          downloadedAt={entry.downloadedAt}
          stemType={entry.stemType}
          queue={tracks}
          index={i}
        />
      ))}
    </div>
  );
}
