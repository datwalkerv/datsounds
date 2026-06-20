"use client";

import { Track } from "@/types/track";
import { TrackCard } from "@/components/TrackCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";

interface TrackListProps {
  tracks: Track[];
}

const PAGE_SIZE = 20;

export function TrackList({ tracks }: TrackListProps) {
  const [visibleCount, sentinelRef] = useInfiniteScroll(tracks.length, PAGE_SIZE);
  const visible = tracks.slice(0, visibleCount);
  const hasMore = visibleCount < tracks.length;

  if (!tracks.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-[#555]">
        <span className="text-4xl mb-3">🎵</span>
        <p className="text-sm">No tracks found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1f1f1f] text-[10px] uppercase tracking-widest text-[#444]">
        <div className="w-10 shrink-0">#</div>
        <div className="w-[200px] shrink-0">Title</div>
        <div className="w-[140px] shrink-0">Genre / Mood</div>
        <div className="flex-1">Waveform</div>
        <div className="w-12 text-right shrink-0">BPM</div>
        <div className="w-10 text-right shrink-0">Time</div>
        <div className="w-[52px] shrink-0" />
      </div>

      {/* Track rows */}
      {visible.map((track, i) => (
        <TrackCard key={track.id} track={track} queue={tracks} index={i} />
      ))}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="flex items-center justify-center py-6">
        {hasMore ? (
          <Loader2 size={18} className="text-[#39FF14] animate-spin" />
        ) : (
          tracks.length > 0 && (
            <p className="text-xs text-[#444]">{tracks.length} tracks loaded</p>
          )
        )}
      </div>
    </div>
  );
}
