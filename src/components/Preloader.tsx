"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    __preloaderFinished?: boolean;
  }
}

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.__preloaderFinished) {
      setIsVisible(false);
      return;
    }

    // 2.5s total time
    // We start fade out at 2200ms with a 300ms fade transition = 2500ms
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (typeof window !== "undefined") {
        window.__preloaderFinished = true;
        window.dispatchEvent(new Event("preloaderEnded"));
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background pointer-events-none"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Detailed Luxury Property / Leisure Animation */}
            <motion.svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary overflow-visible"
            >
              {/* 1. The Ground */}
              <motion.path
                d="M 5 80 L 95 80"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              {/* 2. The Sun / Leisure Aspect */}
              <motion.circle
                cx="75" cy="28" r="10"
                initial={{ pathLength: 0, opacity: 0, scale: 0.5 }}
                animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
                className="text-accent" // Use accent color for sun
                stroke="currentColor"
              />

              {/* 3. The Villa Outline */}
              <motion.path
                d="M 20 80 L 20 48 L 50 28 L 80 48 L 80 80"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.0, ease: "easeInOut" }}
              />

              {/* 4. Elegant Roof Overhang */}
              <motion.path
                d="M 12 55 L 50 28 L 88 55"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              />

              {/* 5. Arched Door */}
              <motion.path
                d="M 40 80 L 40 60 A 10 10 0 0 1 60 60 L 60 80"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.7, ease: "easeInOut" }}
              />

              {/* 6. Water / Pool Waves at bottom */}
              <motion.path
                d="M 25 90 Q 37.5 85 50 90 T 75 90"
                initial={{ pathLength: 0, opacity: 0, y: 5 }}
                animate={{ pathLength: 1, opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
                className="text-accent"
              />
            </motion.svg>

            {/* 7. Welcome Text Sequence */}
            <div className="h-[60px] flex flex-col items-center justify-center mt-6 overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 20, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
                transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
                className="font-serif text-3xl md:text-4xl font-medium text-primary uppercase ml-[0.4em]"
              >
                Welcome
              </motion.h1>
              
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "120px", opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6, ease: "easeInOut" }}
                className="h-[1px] bg-accent mt-4"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
