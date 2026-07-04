import React, { useState } from "react";
import { X, Camera, RotateCw, Sparkles, Clock, FolderOpen, Smile, Send } from "lucide-react";

interface CameraViewProps {
  onClose: () => void;
  onPostCreated: (postContent: { caption: string; speed: string; filter: string }) => void;
}

export default function CameraView({ onClose, onPostCreated }: CameraViewProps) {
  const [caption, setCaption] = useState("");
  const [speed, setSpeed] = useState<"0.5x" | "1x" | "2x">("1x");
  const [activeFilter, setActiveFilter] = useState("Original");
  const [isBeautified, setIsBeautified] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timerCount, setTimerCount] = useState<number | null>(null);
  const [selectedFolderFile, setSelectedFolderFile] = useState<string | null>(null);

  const filtersList = ["Original", "Cosmic", "Vintage", "Sleek Mono", "Warm Amber"];

  const handleShutterClick = () => {
    setIsRecording(!isRecording);
  };

  const handlePost = () => {
    if (!caption.trim()) {
      alert("Please add a caption first!");
      return;
    }
    onPostCreated({
      caption: caption,
      speed: speed,
      filter: activeFilter,
    });
  };

  return (
    <div className="fixed inset-0 bg-[#050508] text-white z-50 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300 select-none">
      {/* LEFT AREA: CAMERA VIEW STAGE */}
      <div className="relative flex-1 bg-[#151520] flex items-center justify-center">
        {/* Simulated Camera Viewfinder Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1200')",
            filter: activeFilter === "Vintage" 
              ? "sepia(0.6) contrast(1.1)" 
              : activeFilter === "Sleek Mono" 
                ? "grayscale(1) contrast(1.2)" 
                : activeFilter === "Warm Amber"
                  ? "sepia(0.3) saturate(1.4) hue-rotate(15deg)"
                  : activeFilter === "Cosmic"
                    ? "hue-rotate(240deg) saturate(1.5)"
                    : "none"
          }}
        >
          {/* Noise/Scanlines overlay for retro look */}
          <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>
          {/* Beautify smoothing overlay */}
          {isBeautified && <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none"></div>}
        </div>

        {/* TOP STATUS BAR OVERLAYS */}
        <div className="absolute top-6 inset-x-6 flex justify-between items-center z-10">
          <button 
            onClick={onClose}
            className="h-11 w-11 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center border border-white/10 text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* User Badge matches screenshot */}
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
              alt="Abdi" 
              className="h-7 w-7 rounded-full object-cover border-2 border-emerald-500"
            />
            <div className="text-left">
              <span className="text-[10px] font-black text-white block leading-none">Abdi T.</span>
              <span className="text-[8px] text-emerald-400 font-bold block mt-0.5 uppercase tracking-wider">online</span>
            </div>
          </div>

          <div className="w-11"></div> {/* Spacer */}
        </div>

        {/* RIGHT SIDEBAR - Action controls with elegant glass look */}
        <div className="absolute right-6 top-24 bottom-24 flex flex-col gap-5 justify-center z-10">
          {/* Control 1: Flip Camera */}
          <button 
            onClick={() => alert("Simulating Camera Flip!")}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="h-12 w-12 bg-black/50 hover:bg-white hover:text-black rounded-full flex items-center justify-center border border-white/15 transition-all shadow-lg">
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide group-hover:text-white">Flip</span>
          </button>

          {/* Control 2: Speed Selector matches screenshot */}
          <div className="flex flex-col items-center gap-1">
            <div className="bg-black/50 border border-white/15 rounded-2xl p-1.5 flex flex-col gap-1.5 items-center">
              <button 
                onClick={() => setSpeed("0.5x")}
                className={`text-[9px] font-black h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${speed === "0.5x" ? "bg-white text-black font-extrabold" : "text-gray-400 hover:text-white"}`}
              >
                0.5x
              </button>
              <button 
                onClick={() => setSpeed("1x")}
                className={`text-[9px] font-black h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${speed === "1x" ? "bg-white text-black font-extrabold" : "text-gray-400 hover:text-white"}`}
              >
                1x
              </button>
              <button 
                onClick={() => setSpeed("2x")}
                className={`text-[9px] font-black h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${speed === "2x" ? "bg-white text-black font-extrabold" : "text-gray-400 hover:text-white"}`}
              >
                2x
              </button>
            </div>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Speed</span>
          </div>

          {/* Control 3: Filters with customized menu */}
          <div className="flex flex-col items-center gap-1 group">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-black/50 hover:bg-black/70 text-white text-[9px] font-bold rounded-full p-2.5 border border-white/15 outline-none cursor-pointer text-center max-w-[64px]"
            >
              {filtersList.map(f => (
                <option key={f} value={f} className="bg-slate-900 text-white text-[10px]">{f}</option>
              ))}
            </select>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Filters</span>
          </div>

          {/* Control 4: Beautify */}
          <button 
            onClick={() => setIsBeautified(!isBeautified)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`h-12 w-12 rounded-full flex items-center justify-center border transition-all shadow-lg ${isBeautified ? "bg-purple-600 text-white border-purple-500 animate-pulse" : "bg-black/50 text-gray-300 border-white/15 hover:bg-white/10"}`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Beautify</span>
          </button>

          {/* Control 5: Timer */}
          <button 
            onClick={() => {
              if (timerCount !== null) {
                setTimerCount(null);
                return;
              }
              setTimerCount(5);
              const timer = setInterval(() => {
                setTimerCount((prev) => {
                  if (prev === null || prev <= 1) {
                    clearInterval(timer);
                    setIsRecording(true);
                    return null;
                  }
                  return prev - 1;
                });
              }, 1000);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`h-12 w-12 rounded-full flex items-center justify-center border transition-all shadow-lg ${timerCount !== null ? "bg-amber-500 text-black border-amber-400" : "bg-black/50 text-gray-300 border-white/15 hover:bg-white/10"}`}>
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">
              {timerCount !== null ? `${timerCount}s` : "Timer"}
            </span>
          </button>
        </div>

        {/* BOTTOM HUD CONTROLS */}
        <div className="absolute bottom-6 inset-x-6 flex justify-between items-center z-10">
          {/* Folder Upload Button (Matches screenshot) */}
          <button 
            onClick={() => {
              setSelectedFolderFile("Simulation_Video_Clip.mp4");
              alert("Simulating import from local Gallery: Simulation_Video_Clip.mp4 selected!");
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="h-12 w-12 bg-black/50 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/15 transition-all text-white shadow-lg">
              <FolderOpen className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide group-hover:text-white">Upload</span>
          </button>

          {/* Red Shutter Button (Matches screenshot AI in red circle) */}
          <div className="relative flex items-center justify-center">
            {isRecording && (
              <span className="absolute -inset-2 rounded-full border-2 border-red-500 animate-ping"></span>
            )}
            <button 
              onClick={handleShutterClick}
              className={`h-20 w-20 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${isRecording ? "border-red-600 bg-red-600/30 text-white scale-110" : "border-red-500/80 bg-black/40 text-red-500 hover:scale-105"}`}
            >
              <div className="h-14 w-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg font-black text-xs tracking-wider border border-white/15">
                AI
              </div>
            </button>
          </div>

          {/* Effects Button (Matches screenshot) */}
          <button 
            onClick={() => alert("Simulating AI video effects: Cyberpunk Face Filter active!")}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="h-12 w-12 bg-black/50 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/15 transition-all text-white shadow-lg">
              <Smile className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide group-hover:text-white">Effects</span>
          </button>
        </div>
      </div>

      {/* RIGHT AREA: METADATA & PUBLISH SIDEBAR */}
      <div className="w-full md:w-80 bg-[#0A0A10] border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col justify-between shrink-0 relative z-20">
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-sm font-black tracking-wider text-purple-400 uppercase">Post Creation</h2>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Write a caption to post this smart story</p>
          </div>

          {/* Caption textarea Matches Screenshot 2 */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Add caption... ({caption.length}/2200)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.substring(0, 2200))}
              placeholder="e.g., Fakkeenya vidiyo haaraa koo daawwadhaa! #SmartbookAIJourney #AIVideoMaker #AIArt"
              className="w-full h-36 p-4 bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-2xl text-xs text-white placeholder-gray-500 font-medium leading-relaxed resize-none focus:outline-none"
            />
            <div className="text-[9px] font-mono font-bold text-gray-500">
              #SmartbookAIJourney #AIVideoMaker #AIArt
            </div>
          </div>

          {/* Selection details */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Selected Setup</h3>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
              <div className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-center">
                <span className="text-gray-500 block">SPEED</span>
                <span className="text-white font-bold mt-1 block">{speed}</span>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-center">
                <span className="text-gray-500 block">FILTER</span>
                <span className="text-indigo-400 font-bold mt-1 block">{activeFilter}</span>
              </div>
            </div>
            {selectedFolderFile && (
              <div className="text-[9px] text-amber-400 bg-amber-400/5 px-2 py-1 rounded border border-amber-400/10 font-bold uppercase truncate">
                📎 Loaded: {selectedFolderFile}
              </div>
            )}
          </div>
        </div>

        {/* Post controls matches screenshot */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={() => {
              setCaption("Fakkeenya vidiyo haaraa koo daawwadhaa!");
              alert("Draft Loaded!");
            }}
            className="flex-1 py-3.5 border border-white/10 hover:border-white/20 bg-white/5 rounded-2xl text-xs font-bold transition-all text-white cursor-pointer"
          >
            Drafts
          </button>
          
          <button 
            onClick={handlePost}
            className="flex-1 py-3.5 bg-white hover:bg-gray-200 text-black rounded-2xl text-xs font-black shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
