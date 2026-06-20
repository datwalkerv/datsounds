"use client";

import { useEffect, useRef, useCallback } from "react";

interface WaveformData {
  data: number[];
}

// Module-level cache to avoid re-fetching across card instances
const waveformCache = new Map<string, number[]>();

export function useWaveform(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  waveformUrl: string,
  progress: number, // 0–1
  isActive: boolean,
  enabled: boolean // only fetch when visible
) {
  const dataRef = useRef<number[] | null>(null);
  const progressRef = useRef<number>(progress);
  const rafRef = useRef<number | null>(null);

  // Keep progressRef in sync
  progressRef.current = progress;

  const draw = useCallback(
    (data: number[], prog: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      if (width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);

      const bars = data.length;
      if (bars === 0) return;
      const barW = width / bars;
      const playedTill = Math.floor(prog * bars);

      for (let i = 0; i < bars; i++) {
        const amp = Math.max(0.02, data[i]);
        const h = amp * height;
        const x = i * barW;
        const y = (height - h) / 2;
        ctx.fillStyle =
          i < playedTill ? "#39FF14" : isActive ? "#1f4a0f" : "#1a1a1a";
        ctx.fillRect(x + 0.5, y, Math.max(barW - 1, 1), h);
      }
    },
    [canvasRef, isActive]
  );

  // Handle canvas resize — resize and immediately redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;
      // Redraw with current data and latest progress
      if (dataRef.current) {
        draw(dataRef.current, progressRef.current);
      }
    });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef, draw]);

  // Fetch waveform data
  useEffect(() => {
    if (!enabled || !waveformUrl) return;

    let cancelled = false;

    async function load() {
      // Check cache first
      if (waveformCache.has(waveformUrl)) {
        if (!cancelled) {
          dataRef.current = waveformCache.get(waveformUrl)!;
          draw(dataRef.current, progressRef.current);
        }
        return;
      }

      try {
        const res = await fetch(waveformUrl);
        const json: WaveformData = await res.json();
        const raw = json.data ?? [];
        // Normalize to 0–1
        const max = Math.max(...raw, 1);
        const normalized = raw.map((v) => v / max);
        waveformCache.set(waveformUrl, normalized);
        if (!cancelled) {
          dataRef.current = normalized;
          draw(normalized, progressRef.current);
        }
      } catch {
        // silently fail
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, waveformUrl]);

  // Redraw on progress or isActive change
  useEffect(() => {
    if (!dataRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (dataRef.current) draw(dataRef.current, progress);
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progress, draw]);
}
