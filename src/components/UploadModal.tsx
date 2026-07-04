import React from "react";
import { Camera, Radio, Palette, PenSquare, PlusCircle, X } from "lucide-react";

interface UploadModalProps {
  onClose: () => void;
  onSelectOption: (option: "video" | "live" | "art" | "post" | "story") => void;
}

export default function UploadModal({ onClose, onSelectOption }: UploadModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50 animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Sheet Content */}
      <div className="relative w-full max-w-md bg-white text-gray-900 rounded-t-[32px] p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-300 flex flex-col items-center">
        {/* Top Handle Decorator */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6"></div>

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Options List */}
        <div className="w-full space-y-5 my-2">
          {/* Option 1: Upload Video */}
          <button
            onClick={() => onSelectOption("video")}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-2xl transition-all cursor-pointer text-left"
          >
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Upload Video</h3>
              <p className="text-xs text-gray-500 font-medium">Gallery or Camera</p>
            </div>
          </button>

          {/* Option 2: Go Live */}
          <button
            onClick={() => onSelectOption("live")}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-2xl transition-all cursor-pointer text-left"
          >
            <div className="p-3 bg-red-100 text-red-500 rounded-2xl">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                Go Live
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
              </h3>
              <p className="text-xs text-gray-500 font-medium">Broadcast Now</p>
            </div>
          </button>

          {/* Option 3: Create AI Art */}
          <button
            onClick={() => onSelectOption("art")}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-2xl transition-all cursor-pointer text-left"
          >
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Create AI Art</h3>
              <p className="text-xs text-gray-500 font-medium">Generate & Showcase</p>
            </div>
          </button>

          {/* Option 4: Post Community Update */}
          <button
            onClick={() => onSelectOption("post")}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-2xl transition-all cursor-pointer text-left"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <PenSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Post Community Update</h3>
              <p className="text-xs text-gray-500 font-medium">Share Your Thoughts</p>
            </div>
          </button>

          {/* Option 5: New Story */}
          <button
            onClick={() => onSelectOption("story")}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-2xl transition-all cursor-pointer text-left"
          >
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">New Story</h3>
              <p className="text-xs text-gray-500 font-medium">Add to Your Story</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
