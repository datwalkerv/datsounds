"use client";

import { EnergyLevel } from "@/types/track";
import { cn, energyLabel } from "@/lib/utils";

const ENERGY_LEVELS: EnergyLevel[] = ["low", "medium", "variable", "high"];

interface EnergyFilterProps {
  value: EnergyLevel | "all";
  onChange: (value: EnergyLevel | "all") => void;
}

export function EnergyFilter({ value, onChange }: EnergyFilterProps) {
  const options: Array<{ label: string; value: EnergyLevel | "all" }> = [
    { label: "All", value: "all" },
    ...ENERGY_LEVELS.map((l) => ({ label: energyLabel(l), value: l })),
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f1f1f]">
      <span className="text-xs text-[#555] uppercase tracking-widest mr-1">
        Energy
      </span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1 text-xs rounded-full transition-all duration-150 border",
            value === opt.value
              ? "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/40 shadow-[0_0_8px_rgba(57,255,20,0.2)]"
              : "text-[#666] border-[#1f1f1f] hover:border-[#333] hover:text-[#aaa]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
