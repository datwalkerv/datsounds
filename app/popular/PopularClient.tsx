"use client";

import { useState, useMemo } from "react";
import { Track, EnergyLevel } from "@/types/track";
import { TrackList } from "@/components/TrackList";
import { EnergyFilter } from "@/components/EnergyFilter";
import { TrendingUp } from "lucide-react";
import { ENERGY_ORDER } from "@/lib/utils";

interface PopularClientProps {
  tracks: Track[];
}

export function PopularClient({ tracks }: PopularClientProps) {
  const [energyFilter, setEnergyFilter] = useState<EnergyLevel | "all">("all");

  const filtered = useMemo(() => {
    const base =
      energyFilter === "all"
        ? [...tracks]
        : tracks.filter((t) => t.energyLevel === energyFilter);

    // Sort by energy level descending: high → variable → medium → low
    return base.sort(
      (a, b) =>
        (ENERGY_ORDER[b.energyLevel] ?? 0) - (ENERGY_ORDER[a.energyLevel] ?? 0)
    );
  }, [tracks, energyFilter]);

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-[#39FF14]" />
          <h1 className="font-serif text-2xl text-[#f0f0f0]">Popular</h1>
        </div>
        <p className="text-sm text-[#555]">
          Top tracks sorted by energy — high to low
        </p>
      </div>

      <EnergyFilter value={energyFilter} onChange={setEnergyFilter} />
      <TrackList tracks={filtered} />
    </div>
  );
}
