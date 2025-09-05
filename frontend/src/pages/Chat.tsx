import { Mic, X } from "lucide-react";

export default function VoiceAssistant() {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center text-white relative\">
      {/* Center Orb */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-black shadow-lg shadow-blue-500/40" />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center">
        {/* Controls */}
        <div className="flex items-center gap-6 mb-4">
          <button className="w-14 h-14 rounded-full bg-[#2f2f2f] hover:bg-[#3a3a3a] flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button className="w-14 h-14 rounded-full bg-[#2f2f2f] hover:bg-[#3a3a3a] flex items-center justify-center">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="text-sm text-black">Hello I'm Eve</div>
      </div>
    </div>
  );
}
