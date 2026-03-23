"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function notifySplashComplete() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("asnl:splash-complete"));
  }
}

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Une seule fois par session
    const seen = sessionStorage.getItem("asnl_splash");
    if (seen) {
      notifySplashComplete();
      return;
    }
    sessionStorage.setItem("asnl_splash", "1");
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={notifySplashComplete}>
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
          {/* Grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.28] mix-blend-soft-light"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundSize: "180px 180px",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.35) 0.6px, transparent 0.6px)",
              backgroundSize: "3px 3px",
            }}
          />

          {/* Logo avec remplissage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-32 h-32 md:w-44 md:h-44 drop-shadow-2xl"
          >
            {/* Base désaturée */}
            <Image
              src="/logo.jpeg"
              alt="AS Nancy Lorraine"
              fill
              className="object-contain grayscale brightness-[0.75] opacity-70"
              sizes="176px"
              priority
            />
            {/* Remplissage du logo depuis le bas */}
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <Image
                src="/logo.jpeg"
                alt="AS Nancy Lorraine rempli"
                fill
                className="object-contain"
                sizes="176px"
                priority
              />
            </motion.div>
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

        </motion.div>
      )}
    </AnimatePresence>
  );
}
