"use client";

import { useState } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { Track } from "@/types/track";
import { usePlayer } from "@/context/PlayerContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEM_LABELS: Record<string, string> = {
  full: "Full Song",
  bass: "Bass",
  drums: "Drums",
  instruments: "Instruments",
  melody: "Melody",
};

const STEM_ORDER = ["full", "bass", "drums", "instruments", "melody"] as const;

interface DownloadMenuProps {
  track: Track;
  className?: string;
}

export function DownloadMenu({ track, className }: DownloadMenuProps) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { state, markDownloaded } = usePlayer();
  const isDownloaded = state.downloadedIds.includes(track.id);

  async function handleDownload(stemKey: string) {
    const stem = track.stems[stemKey as keyof typeof track.stems];
    if (!stem || downloading) return;

    const label = STEM_LABELS[stemKey] ?? stemKey;
    const filename = `${track.title} - ${label}.mp3`;

    setDownloading(stemKey);
    setOpen(false);

    try {
      // Use our proxy route to force a real file download without redirecting
      const proxyUrl = `/api/download?url=${encodeURIComponent(stem.lqMp3Url)}&filename=${encodeURIComponent(filename)}`;

      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);

      markDownloaded(track, stemKey);
      toast.success(`Downloaded "${label}" — ${track.title}`);
    } catch {
      toast.error(`Failed to download "${label}"`);
    } finally {
      setDownloading(null);
    }
  }

  const availableStems = STEM_ORDER.filter((key) => !!track.stems[key]);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        disabled={!!downloading}
        className={cn(
          "btn-icon p-1.5 rounded-md transition-colors",
          isDownloaded
            ? "text-[#39FF14]"
            : "text-[#555] hover:text-[#39FF14]",
          downloading && "opacity-50 cursor-wait"
        )}
        title="Download stem"
      >
        {downloading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isDownloaded ? (
          <Check size={14} />
        ) : (
          <Download size={14} />
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-8 right-0 z-50 bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-2xl py-1 w-44 animate-slide-up">
            <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#444] border-b border-[#1f1f1f] mb-1">
              Download stem
            </p>
            {availableStems.map((key) => (
              <button
                key={key}
                onClick={() => handleDownload(key)}
                className="w-full px-3 py-2 text-left text-sm text-[#ccc] hover:text-[#39FF14] hover:bg-[#1f1f1f] transition-colors flex items-center gap-2"
              >
                <Download size={12} className="opacity-60 shrink-0" />
                {STEM_LABELS[key]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
