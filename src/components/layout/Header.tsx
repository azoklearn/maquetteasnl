"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Ticket, ShoppingBag, Search } from "lucide-react";
import { NAVIGATION, TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleTicketClick() {
    trackTicketingClick("header_nav", "CTA Header");
  }

  return (
    <>
      {/* ── Live Ticker — fond rouge, texte blanc ── */}
      <div className="bg-[#C8102E] text-white text-xs font-semibold overflow-hidden h-8 flex items-center">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-4">
              <span className="opacity-80">⚽ Nancy 3-0 Valenciennes</span>
              <span className="opacity-40">·</span>
              <span>🎟️ DERBY vs METZ — 14 MARS — PLACES LIMITÉES</span>
              <span className="opacity-40">·</span>
              <span className="opacity-80">🏆 NATIONAL J25 — ASNL 2ème au classement</span>
              <span className="opacity-40">·</span>
              <span className="opacity-80">📣 Diego Santos prolonge jusqu'en 2028</span>
              <span className="opacity-40">·</span>
              <span>🔥 Choc de la saison le 14 mars à Marcel Picot</span>
              <span className="opacity-40">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Header ── */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-400",
          isScrolled
            ? "bg-white shadow-xl shadow-black/10 border-b-2 border-[#C8102E]"
            : "bg-black/80 backdrop-blur-md",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 relative transition-transform group-hover:scale-105 shrink-0">
                <Image
                  src="/logo.jpeg"
                  alt="AS Nancy Lorraine"
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="48px"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <div
                  className={cn(
                    "font-black text-base leading-none tracking-tight transition-colors",
                    isScrolled ? "text-[#0A0A0A]" : "text-white",
                  )}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  AS Nancy
                </div>
                <div className="text-[#C8102E] text-[10px] font-bold uppercase tracking-[0.25em] leading-none">
                  Lorraine
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold transition-colors rounded-lg uppercase tracking-wide",
                    isScrolled
                      ? "text-[#0A0A0A]/70 hover:text-[#C8102E] hover:bg-[#C8102E]/5"
                      : "text-white/80 hover:text-white hover:bg-white/5",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop CTAs ── */}
            <div className="hidden md:flex items-center gap-3">
              <button
                className={cn(
                  "p-2 transition-colors",
                  isScrolled ? "text-[#0A0A0A]/50 hover:text-[#C8102E]" : "text-white/60 hover:text-white",
                )}
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/boutique"
                className={cn(
                  "p-2 transition-colors",
                  isScrolled ? "text-[#0A0A0A]/50 hover:text-[#C8102E]" : "text-white/60 hover:text-white",
                )}
                aria-label="Boutique"
              >
                <ShoppingBag className="w-5 h-5" />
              </Link>

              {/* CTA billetterie — toujours rouge plein */}
              <a
                href={TICKETING.nextMatchUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={handleTicketClick}
                className={cn(
                  "cta-pulse flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105 uppercase tracking-wider",
                  isScrolled
                    ? "bg-[#C8102E] text-white hover:bg-[#A00C24] shadow-lg shadow-[#C8102E]/25"
                    : "bg-white text-[#C8102E] hover:bg-white/90 shadow-lg shadow-black/20",
                )}
              >
                <Ticket className="w-4 h-4" />
                <span>Billetterie</span>
              </a>
            </div>

            {/* ── Mobile toggle ── */}
            <button
              className={cn(
                "lg:hidden p-2 transition-colors",
                isScrolled ? "text-[#0A0A0A]" : "text-white",
              )}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu — rouge et blanc ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[calc(2rem+4rem)] z-40 bg-white overflow-y-auto"
          >
            <nav className="max-w-7xl mx-auto px-6 pt-8 pb-16 flex flex-col gap-0">
              {NAVIGATION.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-between py-5 text-3xl font-black text-[#0A0A0A] uppercase tracking-wider border-b border-[#0A0A0A]/8 hover:text-[#C8102E] transition-colors"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {item.label}
                    <span className="text-[#C8102E] text-lg">→</span>
                  </Link>
                </motion.div>
              ))}

              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                href={TICKETING.nextMatchUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => { handleTicketClick(); setIsMobileOpen(false); }}
                className="mt-8 flex items-center justify-center gap-3 bg-[#C8102E] text-white font-black text-xl py-5 rounded-2xl uppercase tracking-widest shadow-xl shadow-[#C8102E]/30"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <Ticket className="w-6 h-6" />
                Prendre ma place
              </motion.a>

              {/* Branding bas de menu */}
              <div className="mt-10 flex items-center gap-3">
                <div className="w-10 h-10 relative shrink-0">
                  <Image src="/logo.jpeg" alt="ASNL" fill className="object-contain" sizes="40px" />
                </div>
                <div>
                  <div className="text-[#0A0A0A] font-black text-sm" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>AS Nancy Lorraine</div>
                  <div className="text-[#C8102E] text-[10px] font-bold uppercase tracking-[0.25em]">Depuis 1913</div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
