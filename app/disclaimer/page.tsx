import { FileText, Music, Lock, Heart, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Disclaimer — datsounds",
  description: "Important information about content hosting, ownership, and user privacy on datsounds.",
};

export default function DisclaimerPage() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-6 py-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 mb-8 border-b border-[#1f1f1f]">
        <div className="w-10 h-10 rounded-lg bg-[#39FF14]/10 flex items-center justify-center border border-[#39FF14]/20 shadow-[0_0_10px_rgba(57,255,20,0.15)]">
          <FileText size={20} className="text-[#39FF14]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-[#f0f0f0]">Disclaimer & Privacy</h1>
          <p className="text-xs text-[#6b6b6b] mt-1">Last updated: June 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Hosting & Ownership Section */}
        <section className="space-y-3 p-6 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Music size={18} className="text-[#39FF14]" />
            <h2 className="font-serif text-xl text-[#f0f0f0]">Content Hosting & Ownership</h2>
          </div>
          <div className="pl-0 space-y-4 text-sm text-[#9a9a9a] leading-relaxed">
            <p>
              <span className="text-[#f0f0f0] font-medium">datsounds</span> does not host, store, or own any of the content available for download on this website. All audio content is owned entirely by{" "}
              <a
                href="https://www.epidemicsound.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#39FF14] hover:underline inline-flex items-center gap-0.5"
              >
                Epidemic Sound <ExternalLink size={10} />
              </a>{" "}
              and is publicly accessible to everyone.
            </p>
            <p>
              The platform indexes public Epidemic Sound content in a <span className="text-[#c0c0c0]">lower quality version</span>. This content is accessible to anyone without a paid subscription, and these audio files can even be located directly by inspecting the browser&apos;s DevTools Network tab.
            </p>
            <p>
              This application is built strictly for <strong className="text-[#c0c0c0]">preview and audition purposes</strong>. If you want to use the sounds in your creative projects, please support the creators and purchase an active subscription from Epidemic Sound so you will get the appropriate license and access the higher quality files.
            </p>
            <p className="text-xs text-[#6b6b6b] italic border-l-2 border-border pl-3">
              For any issues or questions regarding the audio files, please contact Epidemic Sound directly.
            </p>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="space-y-3 p-6 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={18} className="text-[#39FF14]" />
            <h2 className="font-serif text-xl text-[#f0f0f0]">Privacy & Data Policy</h2>
          </div>
          <div className="pl-0 space-y-3 text-sm text-[#9a9a9a] leading-relaxed">
            <p>
              datsounds focuses entirely on privacy. We do not use any databases, and we do not collect, store, or receive any information about you. Everything remains completely under your control.
            </p>
            <p>
              The only information stored is kept locally on your own machine within your browser&apos;s local storage. This is limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#888]">
              <li>Metadata of your downloaded tracks</li>
              <li>Metadata of your liked/saved tracks</li>
            </ul>
          </div>
        </section>

        {/* Closing Signature */}
        <div className="pt-8 flex flex-col items-center justify-center text-center border-t border-[#1f1f1f]">
          <div className="flex items-center gap-2 text-sm text-[#f0f0f0] font-serif">
            <span>Made with love for love.</span>
            <Heart size={14} className="text-[#39FF14] fill-[#39FF14] animate-pulse" />
          </div>
          <p className="text-xs text-[#6b6b6b] mt-1">
            From editor to editors, have fun.
          </p>
        </div>
      </div>
    </div>
  );
}
