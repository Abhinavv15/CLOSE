"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/lib/theme-context";

const TARGET_WORD = "CLOSE";
const TYPING_SPEED_MS = 130;

export function CinematicIntro() {
  const { setTheme } = useTheme();
  const [displayedLetters, setDisplayedLetters] = useState<string>("");
  const [showSubtitle, setShowSubtitle] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    // 1. Unconditionally enforce Dark Mode immediately on mount
    setTheme("dark");
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    localStorage.setItem("close_theme", "dark");

    // 2. Letter-by-letter typing sequence
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      currentIndex++;
      setDisplayedLetters(TARGET_WORD.slice(0, currentIndex));

      if (currentIndex >= TARGET_WORD.length) {
        clearInterval(typingInterval);
        setIsComplete(true);

        // Fade in subtitle
        setTimeout(() => {
          setShowSubtitle(true);
        }, 180);

        // Smoothly dismiss after sequence completes
        setTimeout(() => {
          setIsDismissed(true);
        }, 1800);
      }
    }, TYPING_SPEED_MS);

    // Keyboard listener to skip on Escape, Enter, or Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(typingInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setTheme]);

  const handleSkip = () => {
    setIsDismissed(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!isDismissed && (
        <motion.div
          key="cinematic-intro-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-zinc-950 text-white font-mono select-none overflow-hidden cursor-pointer"
          onClick={handleSkip}
        >
          {/* Subtle background ambient radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Minimal grid lines in the background */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}
          />

          {/* Skip button in top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
            className="absolute top-6 right-6 text-xs text-zinc-400 hover:text-white font-mono tracking-wider px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 transition-colors z-20 cursor-pointer"
          >
            Skip (Esc) &rarr;
          </button>

          {/* Centered Letter-by-Letter Display */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl">
            {/* Top category label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-zinc-400 mb-6 sm:mb-8"
            >
              Autonomous Financial System
            </motion.div>

            {/* Large Letter-By-Letter CLOSE Title */}
            <div className="flex items-center justify-center min-h-[5rem] sm:min-h-[7rem]">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-[0.22em] text-white flex items-center">
                {displayedLetters.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}

                {/* Blinking Terminal Cursor */}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                  className={`inline-block w-2 sm:w-3 h-12 sm:h-20 bg-white ml-2 sm:ml-4 rounded-xs shadow-[0_0_15px_rgba(255,255,255,0.8)] ${
                    isComplete && showSubtitle ? "opacity-50" : "opacity-100"
                  }`}
                />
              </h1>
            </div>

            {/* Subtitle reveal */}
            <div className="min-h-[3.5rem] mt-6 sm:mt-8 flex flex-col items-center">
              {showSubtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-2"
                >
                  <div className="text-sm sm:text-base font-bold tracking-[0.3em] uppercase text-zinc-200">
                    AI Finance Controller
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-400 font-mono tracking-widest">
                    Deterministic 5-Pass Matching • Merkle Audit Trail
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom subtle progress indicator */}
          <div className="absolute bottom-8 text-[11px] font-mono text-zinc-500 tracking-widest">
            INITIALIZING ENGINE...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

