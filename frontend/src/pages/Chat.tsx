import { useState } from "react";
import { Search, Mic, BarChart3 } from "lucide-react";

export default function ChatGPTReplica() {
  const [query, setQuery] = useState("");

  return (
    <div className="h-screen w-screen bg-[#1e1e1e] text-white flex flex-col">
      {/* Top Upgrade Banner */}
      <div className="flex justify-center p-4">
        <button className="bg-[#2f2f2f] hover:bg-[#3a3a3a] px-4 py-2 rounded-full text-sm text-white/90">
          + Upgrade your plan
        </button>
      </div>

      {/* Center Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-xl md:text-2xl font-medium mb-6">
          Where should we begin?
        </h1>

        {/* Search Box */}
        <div className="flex items-center w-[90%] md:w-[500px] bg-[#2f2f2f] rounded-full px-4 py-3">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Ask anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-white flex-1 placeholder-gray-400"
          />
          <Mic className="text-gray-400 w-5 h-5 mr-2 cursor-pointer hover:text-white" />
          <BarChart3 className="text-gray-400 w-5 h-5 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Sidebar Icons */}
      <div className="absolute left-4 top-4 flex flex-col space-y-6">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#10a37f] to-[#1e7f64]" />
        <div className="w-6 h-6 bg-gray-500 rounded-sm" />
        <div className="w-6 h-6 bg-gray-500 rounded-sm" />
        <div className="w-6 h-6 bg-gray-500 rounded-sm" />
      </div>

      {/* Bottom Left Profile (circle icon like in screenshot) */}
      <div className="absolute bottom-4 left-4">
        <div className="w-10 h-10 rounded-full bg-blue-500" />
      </div>

      {/* Top Right Refresh Icon */}
      <div className="absolute top-4 right-4">
        <div className="w-6 h-6 rounded-full border border-gray-500 flex items-center justify-center text-gray-400">
          ⟳
        </div>
      </div>
    </div>
  );
}
