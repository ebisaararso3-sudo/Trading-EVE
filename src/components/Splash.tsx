import React, { useEffect } from "react";
import { GraduationCap, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050508] flex flex-col items-center justify-center z-50 overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1a1a2e_0%,transparent_50%)] opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#2e1a1a_0%,transparent_50%)] opacity-30 pointer-events-none"></div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center text-center px-6 relative"
      >
        {/* Glow behind icon */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-md opacity-45"></div>

        <div className="relative bg-[#0F0F1A] p-6 rounded-3xl border border-white/10 shadow-2xl mb-6">
          <GraduationCap className="h-20 w-20 text-blue-500" />
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-full shadow-lg"
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 font-display"
        >
          SmartBook <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-sm md:text-base text-gray-300 font-medium tracking-wide max-w-sm"
        >
          Trilingual Smart AI Learning Platform
        </motion.p>
      </motion.div>

      {/* Loading Progress Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        ></motion.div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-xs text-gray-600 font-mono tracking-widest">
        POWERED BY GEMINI 3.5 FLASH
      </div>
    </div>
  );
}
