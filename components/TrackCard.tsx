"use client";

import Image from "next/image";
import { Heart, Mic2, Play, Pause } from "lucide-react";
import { Track } from "@/types/track";
import { usePlayer } from "@/context/PlayerContext";
import { MiniWaveform } from "@/components/MiniWaveform";
import { DownloadMenu } from "@/components/DownloadMenu";
import { formatMs, getCoverUrl, cn } from "@/lib/utils";

interface TrackCardProps {
  track: Track;
  queue: Track[];
  index: number;
}

export function TrackCard({ track, queue, index }: TrackCardProps) {
  const { state, playTrack, togglePlay, toggleLike } = usePlayer();

  const isActive = state.currentTrack?.id === track.id;
  const isLiked = state.likedIds.includes(track.id);
  const isDownloaded = state.downloadedIds.includes(track.id);
  const isPlaying = isActive && state.isPlaying;

  const artist = track.creatives.mainArtists[0]?.name ?? "Unknown Artist";
  const coverUrl = getCoverUrl(track.coverArt?.baseUrl, track.coverArt?.sizes, "XS");
  const durationSecs = track.length ?? track.durationMs / 1000;

  // Show up to 2 genres + 1 mood as compact tags
  const genreTag = track.genres[0]?.displayTag ?? null;
  const moodTag = track.moods[0]?.displayTag ?? null;

  function handleRowClick() {
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
  }

  return (
    <div
      className={cn(
        "track-card group flex items-center gap-3 px-4 py-2 cursor-pointer border-l-2 transition-all duration-150",
        isActive
          ? "active border-l-[#39FF14] bg-[#111]/60"
          : "border-l-transparent"
      )}
      onClick={handleRowClick}
    >
      {/* Cover with dynamic play/pause overlay */}
      <div className="relative w-10 h-10 shrink-0">
        <div
          className={cn(
            "absolute inset-0 rounded-md overflow-hidden",
            isActive && "ring-1 ring-[#39FF14]/60 shadow-[0_0_8px_rgba(57,255,20,0.3)]"
          )}
        >
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={track.title}
              fill
              className="object-cover"
              sizes="40px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#1f1f1f] flex items-center justify-center text-[#555] text-xs">
              {index + 1}
            </div>
          )}
        </div>

        {/* Play/Pause overlay: always on hover, always visible when active */}
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

      {/* Title + artist + tags */}
      <div className="min-w-0 w-[200px] shrink-0">
        <div className="flex items-center gap-1 truncate">
          <span
            className={cn(
              "text-sm font-medium truncate",
              isActive ? "text-[#39FF14]" : "text-[#f0f0f0]"
            )}
          >
            {track.title}
          </span>
          {isLiked && (
            <Heart size={10} className="text-[#39FF14] fill-[#39FF14] shrink-0" />
          )}
          {isDownloaded && (
            <span className="text-[9px] text-[#39FF14] shrink-0">⬇</span>
          )}
          {track.hasVocals && (
            <Mic2 size={10} className="text-[#777] shrink-0" />
          )}
        </div>
        <div className="text-xs text-[#555] truncate">{artist}</div>
      </div>

      {/* Genre / Mood tags */}
      <div className="w-[140px] shrink-0 flex flex-wrap gap-1">
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
      <div
        className="flex-1 min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        <MiniWaveform
          waveformUrl={track.stems.full.waveformUrl}
          trackId={track.id}
          duration={durationSecs}
        />
      </div>

      {/* BPM */}
      <div className="w-12 text-right text-xs text-[#555] shrink-0">
        {track.bpm} <span className="text-[10px]">bpm</span>
      </div>

      {/* Duration */}
      <div className="w-10 text-right text-xs text-[#777] shrink-0 tabular-nums">
        {formatMs(track.durationMs)}
      </div>

      {/* Like button */}
      <button
        className={cn(
          "btn-icon p-1.5 rounded-md shrink-0 transition-all",
          isLiked
            ? "text-[#39FF14]"
            : "text-[#444] hover:text-[#39FF14] opacity-0 group-hover:opacity-100"
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(track);
        }}
        title={isLiked ? "Unlike" : "Like"}
      >
        <Heart size={14} className={isLiked ? "fill-[#39FF14]" : ""} />
      </button>

      {/* Download */}
      <div
        className={cn(
          "shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
          isDownloaded && "opacity-100"
        )}
      >
        <DownloadMenu track={track} />
      </div>
    </div>
  );
}
