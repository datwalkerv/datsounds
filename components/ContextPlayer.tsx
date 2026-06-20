"use client";

import Image from "next/image";
import { Heart, SkipBack, SkipForward, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { PlayerWaveform } from "@/components/PlayerWaveform";
import { DownloadMenu } from "@/components/DownloadMenu";
import { getCoverUrl, formatTime, cn } from "@/lib/utils";

export function ContextPlayer() {
  const {
    state,
    togglePlay,
    seek,
    setVolume,
    toggleLike,
    next,
    prev,
  } = usePlayer();

  const { currentTrack, isPlaying, currentTime, duration, volume, likedIds } = state;

  if (!currentTrack) {
    return (
      <div className="player-bar h-[72px] flex items-center justify-center px-6">
        <p className="text-xs text-[#444] tracking-wide">
          Select a track to start listening
        </p>
      </div>
    );
  }

  const isLiked = likedIds.includes(currentTrack.id);
  const artist = currentTrack.creatives.mainArtists[0]?.name ?? "Unknown";
  const coverUrl = getCoverUrl(
    currentTrack.coverArt?.baseUrl,
    currentTrack.coverArt?.sizes,
    "S"
  );

  return (
    <div className="player-bar h-[88px] flex items-center gap-4 px-4 select-none">
      {/* Cover + track info */}
      <div className="flex items-center gap-3 w-[220px] shrink-0">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={currentTrack.title}
              fill
              className="object-cover"
              sizes="48px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#1f1f1f]" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-[#f0f0f0] truncate max-w-[130px]">
              {currentTrack.title}
            </span>
            {isLiked && (
              <Heart size={11} className="text-[#39FF14] fill-[#39FF14] shrink-0" />
            )}
          </div>
          <p className="text-xs text-[#666] truncate">{artist}</p>
        </div>
      </div>

      {/* Center: controls + waveform + time */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        {/* Playback controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="btn-icon text-[#666] hover:text-[#f0f0f0]"
            title="Previous"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={togglePlay}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150",
              "bg-[#39FF14] hover:bg-[#50ff30] text-black shadow-[0_0_12px_rgba(57,255,20,0.5)] hover:shadow-[0_0_20px_rgba(57,255,20,0.7)]"
            )}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} className="fill-black" /> : <Play size={16} className="fill-black ml-0.5" />}
          </button>
          <button
            onClick={next}
            className="btn-icon text-[#666] hover:text-[#f0f0f0]"
            title="Next"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Waveform + timestamps */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#555] tabular-nums w-8 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <PlayerWaveform
            waveformUrl={currentTrack.stems.full.waveformUrl}
            className="flex-1 h-7 rounded"
          />
          <span className="text-[11px] text-[#555] tabular-nums w-8 shrink-0">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: volume + like + download */}
      <div className="flex items-center gap-3 w-[180px] shrink-0 justify-end">
        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
            className="btn-icon text-[#555] hover:text-[#f0f0f0]"
          >
            {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 appearance-none bg-[#2a2a2a] rounded-full outline-none cursor-pointer accent-[#39FF14]"
          />
        </div>

        {/* Like */}
        <button
          onClick={() => toggleLike(currentTrack)}
          className={cn(
            "btn-icon p-1.5 rounded-md transition-all",
            isLiked ? "text-[#39FF14]" : "text-[#555] hover:text-[#39FF14]"
          )}
          title={isLiked ? "Unlike" : "Like"}
        >
          <Heart size={15} className={isLiked ? "fill-[#39FF14]" : ""} />
        </button>

        {/* Download */}
        <DownloadMenu track={currentTrack} />
      </div>
    </div>
  );
}
