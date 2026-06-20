"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  }

  function clear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 h-10 rounded-xl border transition-all duration-200",
        "bg-[#111111] text-sm w-full max-w-sm",
        focused
          ? "border-[#39FF14] shadow-[0_0_0_2px_rgba(57,255,20,0.15)]"
          : "border-[#1f1f1f] hover:border-[#2a2a2a]"
      )}
    >
      <Search
        size={14}
        className={cn(
          "shrink-0 transition-colors",
          focused ? "text-[#39FF14]" : "text-[#555]"
        )}
      />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search tracks…"
        className="flex-1 bg-transparent outline-none text-[#f0f0f0] placeholder:text-[#444] text-sm"
      />
      {query && (
        <button
          onClick={clear}
          className="text-[#555] hover:text-[#f0f0f0] transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
