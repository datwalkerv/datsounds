import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EnergyLevel } from "@/types/track";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format seconds to m:ss */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Format milliseconds to m:ss */
export function formatMs(ms: number): string {
  return formatTime(ms / 1000);
}

/** Get cover URL at given size */
export function getCoverUrl(
  baseUrl?: string,
  sizes?: Record<string, string>,
  size: "XS" | "S" | "M" | "L" = "S"
): string {
  if (!baseUrl || !sizes) return "/placeholder-cover.jpg";
  const sizeStr = sizes[size];
  if (!sizeStr) return "/placeholder-cover.jpg";
  return baseUrl + sizeStr;
}

/** Energy level sort weight */
export const ENERGY_ORDER: Record<EnergyLevel, number> = {
  low: 0,
  medium: 1,
  variable: 2,
  high: 3,
};

export function energyLabel(level: EnergyLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function energyClass(level: EnergyLevel): string {
  const map: Record<EnergyLevel, string> = {
    low: "energy-low",
    medium: "energy-medium",
    variable: "energy-variable",
    high: "energy-high",
  };
  return map[level] ?? "";
}
