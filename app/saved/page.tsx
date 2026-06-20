import { Heart } from "lucide-react";
import { SavedClient } from "./SavedClient";

export const metadata = {
  title: "Saved — datsounds",
  description: "Your liked and saved tracks",
};

export default function SavedPage() {
  return (
    <div className="animate-fade-in">
      <div className="px-6 py-5 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={16} className="text-[#39FF14] fill-[#39FF14]" />
          <h1 className="font-serif text-2xl text-[#f0f0f0]">Saved</h1>
        </div>
        <p className="text-sm text-[#555]">Tracks you liked, sorted by date saved</p>
      </div>
      <SavedClient />
    </div>
  );
}
