import React, { useState, useRef } from "react";
import { ArrowLeft, Play, Pause, RefreshCw, Volume2, Maximize2, MessageSquare, BookOpen, Clock, Sparkles } from "lucide-react";
import { Video } from "../types";
import { translations } from "../languages";

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
  lang: "en" | "om" | "am";
  onAskTutor: (conceptPrompt: string) => void;
}

export default function VideoPlayer({ video, onBack, lang, onAskTutor }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(15); // mock start progress
  const [volume, setVolume] = useState(80);
  const videoRef = useRef<HTMLVideoElement>(null);

  const t = translations[lang];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Video auto-play blocked", err));
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setProgress(value);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration * value) / 100;
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col select-none relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1a1a2e_0%,transparent_50%)] opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#2e1a1a_0%,transparent_50%)] opacity-30 pointer-events-none"></div>

      {/* Player Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-10 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white max-w-xs md:max-w-md truncate font-display">
              {video.title}
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-400" />
              {t.duration}: {video.duration}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full uppercase">
          {video.category}
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Video Player Block */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-[#05050A] rounded-[32px] overflow-hidden aspect-video relative group shadow-2xl border border-white/10 flex flex-col justify-center">
            {/* HTML5 Video element */}
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
            />

            {/* Custom overlays when paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity"
              >
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 shadow-2xl scale-100 group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-10 w-10 text-white fill-white" />
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3">
              <input
                type="range"
                value={progress}
                onChange={handleSeek}
                className="w-full accent-blue-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors cursor-pointer">
                    {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
                  </button>
                  <button
                    onClick={() => {
                      if (videoRef.current) videoRef.current.currentTime = 0;
                    }}
                    className="text-white hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-4.5 w-4.5" />
                  </button>

                  <div className="flex items-center gap-1.5 text-white">
                    <Volume2 className="h-4 w-4 text-blue-400" />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setVolume(val);
                        if (videoRef.current) videoRef.current.volume = val / 100;
                      }}
                      className="w-16 accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-300 font-bold">
                    {video.duration}
                  </span>
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
                      }
                    }}
                    className="text-white hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description of lecture */}
          <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-6 border border-white/10 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">Lecture Description</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{video.description}</p>
          </div>
        </div>

        {/* Right Panel: Interactive Tutor Quiz & Notes */}
        <div className="flex flex-col space-y-4">
          <div className="bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-[32px] p-6 border border-white/10 text-white shadow-xl flex-1 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <Sparkles className="h-5 w-5 animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-widest font-display">Interactive AI Helper</span>
              </div>
              <h3 className="text-base font-bold mb-3">Stuck on this lecture?</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Our AI Tutor has scanned this lecture. Ask the coach to generate summarized notes, list common questions, or explain equations from this topic instantly.
              </p>

              {/* Suggestions */}
              <div className="space-y-2.5">
                <button
                  onClick={() => onAskTutor(`I am watching the SmartBook video lecture titled "${video.title}". Can you give me a bulleted summary of this topic in simplified words with a real-world example?`)}
                  className="w-full text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-200 font-bold transition-all flex items-center justify-between cursor-pointer"
                >
                  📝 Summarize key definitions
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </button>
                <button
                  onClick={() => onAskTutor(`Regarding the video lecture "${video.title}", what are 3 typical exam questions (and answers) a high school or university student would face on this topic?`)}
                  className="w-full text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-200 font-bold transition-all flex items-center justify-between cursor-pointer"
                >
                  ❓ Generate typical exam questions
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-6 flex items-center gap-2.5">
              <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-bold block">CURRICULUM MODULE</span>
                <span className="text-xs font-bold text-gray-200">Trilingual Virtual Classroom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
