import { Download } from "lucide-react";
import { DownloadedClient } from "./DownloadedClient";

export const metadata = {
  title: "Downloaded — datsounds",
  description: "Tracks you have downloaded",
};

export default function DownloadedPage() {
  return (
    <div className="animate-fade-in">
      <div className="px-6 py-5 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 mb-1">
          <Download size={16} className="text-[#39FF14]" />
          <h1 className="font-serif text-2xl text-[#f0f0f0]">Downloaded</h1>
        </div>
        <p className="text-sm text-[#555]">Stems you downloaded, sorted by date</p>
      </div>
      <DownloadedClient />
    </div>
  );
}
