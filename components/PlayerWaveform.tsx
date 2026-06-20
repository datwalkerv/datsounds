"use client";

import { useRef } from "react";
import { useWaveform } from "@/hooks/useWaveform";
import { usePlayer } from "@/context/PlayerContext";

interface PlayerWaveformProps {
  waveformUrl: string;
  className?: string;
}

export function PlayerWaveform({ waveformUrl, className = "" }: PlayerWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, seek } = usePlayer();

  const progress =
    state.duration > 0 ? state.currentTime / state.duration : 0;

  // Always enabled in the player; ResizeObserver handled by the hook
  useWaveform(canvasRef, waveformUrl, progress, true, true);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (state.duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * state.duration);
  }

  return (
    <div className={`min-w-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="waveform w-full h-full"
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}
