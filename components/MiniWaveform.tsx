"use client";

import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useInfiniteScroll";
import { useWaveform } from "@/hooks/useWaveform";
import { usePlayer } from "@/context/PlayerContext";

interface MiniWaveformProps {
  waveformUrl: string;
  trackId: number;
  duration: number; // seconds
}

export function MiniWaveform({ waveformUrl, trackId, duration }: MiniWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, seek } = usePlayer();
  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const isActive = state.currentTrack?.id === trackId;
  const progress =
    isActive && state.duration > 0 ? state.currentTime / state.duration : 0;

  // ResizeObserver is now inside useWaveform — no need to handle it here
  useWaveform(canvasRef, waveformUrl, progress, isActive, isVisible);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isActive || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  }

  return (
    <div ref={containerRef} className="flex-1 h-8 min-w-0">
      <canvas
        ref={canvasRef}
        className="waveform w-full h-full"
        onClick={handleClick}
        style={{ cursor: isActive ? "pointer" : "default" }}
      />
    </div>
  );
}
