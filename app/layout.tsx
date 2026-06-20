import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { ContextPlayer } from "@/components/ContextPlayer";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "datsounds — Discover Free Music",
  description:
    "Discover, stream and download royalty-free music. Search across thousands of tracks, curated lofi, trap, and more.",
  keywords: ["free music", "lofi", "trap", "royalty free", "datsounds"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="bg-[#0a0a0a] text-[#f0f0f0] font-sans overflow-hidden h-screen">
        <PlayerProvider>
          <div className="flex h-screen flex-col">
            {/* Main area: sidebar + content */}
            <div className="flex flex-1 min-h-0">
              <Sidebar />

              {/* Content pane */}
              <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Top search bar */}
                <header className="flex items-center px-6 py-3 border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur shrink-0">
                  <SearchBar />
                </header>

                {/* Page content (scrollable) */}
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>
              </main>
            </div>

            {/* Bottom persistent player */}
            <ContextPlayer />
          </div>

          <Toaster
            theme="dark"
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#161616",
                border: "1px solid #2a2a2a",
                color: "#f0f0f0",
              },
            }}
          />
        </PlayerProvider>
      </body>
    </html>
  );
}
