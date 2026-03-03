"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Une seule fois par session
    const seen = sessionStorage.getItem("asnl_splash");
    if (seen) return;
    sessionStorage.setItem("asnl_splash", "1");
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
          }}
          className="fixed inset-0 z-[9999] bg-[#fd0000] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Grille décorative */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 60px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 60px)",
            }}
          />

          {/* Bande blanche gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/30" />
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/30" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-32 h-32 md:w-44 md:h-44 drop-shadow-2xl"
          >
            <Image
              src="/logo.jpeg"
              alt="AS Nancy Lorraine"
              fill
              className="object-contain"
              sizes="176px"
              priority
            />
          </motion.div>

          {/* Nom du club */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p
              className="text-white font-black text-4xl md:text-5xl uppercase tracking-widest leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              AS Nancy
            </p>
            <p
              className="text-white/40 font-black text-xl md:text-2xl uppercase tracking-[0.5em] mt-1"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Lorraine
            </p>
          </motion.div>

          {/* Barre de progression */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-white/20 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
