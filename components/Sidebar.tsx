"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import {
  Home,
  TrendingUp,
  Headphones,
  Zap,
  Github,
  Heart,
  DollarSign,
  FileText,
  Download,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/popular", label: "Popular", icon: TrendingUp },
  { href: "/lofi", label: "Lofi", icon: Headphones },
  { href: "/trap", label: "Trap", icon: Zap },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/downloaded", label: "Downloaded", icon: Download },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full w-[220px] shrink-0 border-r border-[#1f1f1f] bg-[#0d0d0d]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1f1f1f]">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-8 h-8 rounded-lg shadow-[0_0_12px_rgba(57,255,20,0.6)] group-hover:shadow-[0_0_20px_rgba(57,255,20,0.8)] transition-shadow" />
          <span className="font-serif text-lg font-normal tracking-tight text-[#f0f0f0]">
            datsounds
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#39FF14]/10 text-[#39FF14] shadow-[inset_0_0_0_1px_rgba(57,255,20,0.25)]"
                  : "text-[#9a9a9a] hover:text-[#f0f0f0] hover:bg-[#161616]"
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "shrink-0 transition-colors",
                  active ? "text-[#39FF14]" : "text-[#555]",
                  label === "Saved" && active && "fill-[#39FF14]"
                )}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#39FF14] shadow-[0_0_6px_rgba(57,255,20,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <footer className="px-4 py-4 border-t border-[#1f1f1f] space-y-3">
        <p className="text-xs text-[#555] flex items-center gap-1">
          Made w{" "}
          <Heart size={10} className="text-[#39FF14] fill-[#39FF14]" /> by{" "}
          <a
            href="https://github.com/datwalkerv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#39FF14] hover:underline"
          >
            datwalkerv
          </a>
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link
            href="/disclaimer"
            className="flex items-center gap-1 text-[11px] text-[#555] hover:text-[#f0f0f0] transition-colors"
          >
            <FileText size={10} /> Disclaimer
          </Link>
          <a
            href="https://revolut.me/balagbalint/pocket/4wmvhlFQAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-[#555] hover:text-[#39FF14] transition-colors"
          >
            <DollarSign size={10} /> Donate
          </a>
          <a
            href="https://github.com/datwalkerv/datsounds"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-[#555] hover:text-[#f0f0f0] transition-colors"
          >
            <Github size={10} /> GitHub
          </a>
        </div>
      </footer>
    </aside>
  );
}
