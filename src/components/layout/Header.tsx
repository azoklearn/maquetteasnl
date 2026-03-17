"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, ShoppingBag } from "lucide-react";
import { NAVIGATION, TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface HeaderProps {
  tickerEnabled?: boolean;
  tickerMessages?: string[];
  ticketingUrl?: string;
}

const SUB_MENUS: Record<
  string,
  { href: string; label: string; description: string }[]
> = {
  "/histoire": [
    {
      href: "/histoire",
      label: "Histoire du club",
      description: "Les grandes dates et le palmarès de l'ASNL.",
    },
    {
      href: "/partenaires",
      label: "Partenaires & sponsors",
      description: "Découvrir les marques qui soutiennent l'ASNL.",
    },
    {
      href: "/jeu",
      label: "Jeu / Quiz",
      description: "Tester vos connaissances sur l'ASNL.",
    },
  ],
  "/effectif": [
    {
      href: "/effectif",
      label: "Effectif complet",
      description: "Joueurs, postes et statistiques de la saison.",
    },
    {
      href: "/effectif#staff",
      label: "Staff & coach",
      description: "Encadrement sportif et staff technique.",
    },
  ],
  "/calendrier": [
    {
      href: "/calendrier",
      label: "Prochains matchs",
      description: "Les rencontres à venir de l'ASNL.",
    },
    {
      href: "/calendrier#resultats",
      label: "Résultats",
      description: "Scores et résumés de rencontres.",
    },
    {
      href: "/#classement",
      label: "Classement",
      description: "Classement en temps réel.",
    },
  ],
  "/actualites": [
    {
      href: "/actualites",
      label: "Toutes les actualités",
      description: "Dernières infos du club, du groupe et du stade.",
    },
  ],
  "/medias": [
    {
      href: "/medias",
      label: "Vidéos",
      description: "Résumés de matchs et contenus vidéo.",
    },
    {
      href: "/medias#photos",
      label: "Galerie photos",
      description: "Ambiance, coulisses et clichés du stade.",
    },
  ],
  "/partenaires": [
    {
      href: "/partenaires",
      label: "Nos partenaires",
      description: "Les entreprises qui soutiennent l'ASNL.",
    },
    {
      href: "/partenaires/service-commercial",
      label: "Service commercial",
      description: "Contacts sponsoring, hospitalité et séminaires.",
    },
    {
      href: "/partenaires/loges-privatives",
      label: "Loges privatives",
      description: "Vivez les matchs dans un cadre premium.",
    },
  ],
  "/boutique": [
    {
      href: "/boutique",
      label: "Boutique en ligne",
      description: "Maillots, textiles et produits officiels.",
    },
  ],
};

// ── Bouton hamburger animé ─────────────────────────────────────────────────────
function HamburgerButton({
  open,
  onClick,
  scrolled,
}: {
  open: boolean;
  onClick: () => void;
  scrolled: boolean;
}) {
  const color = scrolled ? "#0A0A0A" : "#ffffff";
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl transition-all hover:bg-white/10 focus:outline-none"
    >
      <span
        style={{ background: color }}
        className={cn(
          "block h-[2px] w-6 rounded-full transition-all duration-300 origin-center",
          open ? "rotate-45 translate-y-[7px]" : "",
        )}
      />
      <span
        style={{ background: color }}
        className={cn(
          "block h-[2px] w-6 rounded-full transition-all duration-300",
          open ? "opacity-0 scale-x-0" : "",
        )}
      />
      <span
        style={{ background: color }}
        className={cn(
          "block h-[2px] w-6 rounded-full transition-all duration-300 origin-center",
          open ? "-rotate-45 -translate-y-[7px]" : "",
        )}
      />
    </button>
  );
}

// ── Header principal ───────────────────────────────────────────────────────────
export function Header({ tickerEnabled = true, tickerMessages, ticketingUrl }: HeaderProps) {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const ticketUrl = ticketingUrl ?? TICKETING.nextMatchUrl;
  const messages  = tickerMessages?.length ? tickerMessages : [
    "⚽ Nancy 3-0 Valenciennes",
    "🎟️ DERBY vs METZ — 14 MARS — PLACES LIMITÉES",
    "🏆 LIGUE 2 J27 — ASNL 3ème au classement",
    "📣 Diego Santos prolonge jusqu'en 2028",
    "🔥 Choc de la saison le 14 mars à Marcel Picot",
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll du body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  function handleTicketClick() {
    trackTicketingClick("header_nav", "CTA Header");
  }

  return (
    <>
      {/* ── Live Ticker ── */}
      {tickerEnabled && (
      <div className="bg-[#fd0000] text-white text-xs font-semibold overflow-hidden h-8 flex items-center">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-4">
              {messages.map((msg, j) => (
                <span key={j} className="flex items-center gap-8">
                  <span>{msg}</span>
                  <span className="opacity-40">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      )}

      {/* ── Main Header ── */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-400",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/10"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 relative transition-transform duration-300 group-hover:scale-110 shrink-0">
                <Image src="/logo.jpeg" alt="AS Nancy Lorraine" fill className="object-contain drop-shadow-md" sizes="48px" priority />
              </div>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAVIGATION.map((item, i) => {
                const entries = SUB_MENUS[item.href];
                const hasSubmenu = !!entries;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.04, duration: 0.3 }}
                    className={hasSubmenu ? "relative group/nav" : undefined}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative px-4 py-2 text-sm font-semibold transition-colors rounded-lg uppercase tracking-wide",
                        isScrolled
                          ? "text-[#0A0A0A]/70 hover:text-[#fd0000] hover:bg-[#fd0000]/5"
                          : "text-white/80 hover:text-white hover:bg-white/5",
                      )}
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span
                        className="pointer-events-none absolute left-4 right-4 bottom-1 h-[2px] bg-[#fd0000] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      />
                    </Link>

                    {hasSubmenu && (
                      <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/nav:opacity-100 group-hover/nav:pointer-events-auto transition-opacity duration-200">
                        <div className="rounded-2xl bg-[#111] border border-white/10 shadow-xl overflow-hidden min-w-[260px]">
                          <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-[0.2em]">
                              {item.label}
                            </p>
                          </div>
                          <div className="py-2">
                            {entries.map((entry, idx) => (
                              <Link
                                key={entry.href}
                                href={entry.href}
                                className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                              >
                                <div className="w-2 h-2 mt-1 rounded-full bg-white/30" />
                                <div>
                                  <p className="text-sm font-semibold text-white">{entry.label}</p>
                                  <p className="text-[11px] text-white/50">
                                    {entry.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* CTAs desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/boutique"
                className={cn("p-2 transition-colors", isScrolled ? "text-[#0A0A0A]/50 hover:text-[#fd0000]" : "text-white/60 hover:text-white")}
                aria-label="Boutique"
              >
                <ShoppingBag className="w-5 h-5" />
              </Link>
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={handleTicketClick}
                className={cn(
                  "cta-pulse flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105 uppercase tracking-wider",
                  isScrolled
                    ? "bg-[#fd0000] text-white hover:bg-[#cc0000] shadow-lg shadow-[#fd0000]/25"
                    : "bg-white text-[#fd0000] hover:bg-white/90 shadow-lg shadow-black/20",
                )}
              >
                <Ticket className="w-4 h-4" />
                <span>Billetterie</span>
              </a>
            </div>

            {/* Hamburger mobile */}
            <HamburgerButton
              open={isMobileOpen}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              scrolled={isScrolled}
            />
          </div>
        </div>
      </header>

      {/* ── Overlay sombre ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Drawer latéral ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-[340px] bg-[#0A0A0A] flex flex-col lg:hidden shadow-2xl"
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 relative shrink-0">
                  <Image src="/logo.jpeg" alt="ASNL" fill className="object-contain" sizes="32px" />
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>AS Nancy Lorraine</p>
                  <p className="text-[#fd0000] text-[9px] font-bold uppercase tracking-[0.25em]">Depuis 1967</p>
                </div>
              </div>
              {/* Bouton fermer */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 transition-colors"
              >
                <span className="text-white/70 text-lg leading-none">✕</span>
              </button>
            </div>

            {/* Liens de navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              {NAVIGATION.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="relative flex items-center justify-between py-4 px-2 text-white/80 hover:text-white font-semibold text-base uppercase tracking-wider border-b border-white/5 hover:border-[#fd0000]/30 transition-all group"
                  >
                    <span className="relative z-10 group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                    <span
                      className="pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] bg-[#fd0000] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    />
                    <span className="text-white/20 group-hover:text-[#fd0000] transition-colors text-sm">→</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTA billetterie en bas */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="px-4 pb-8 pt-4 border-t border-white/8 space-y-3"
            >
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => { handleTicketClick(); setIsMobileOpen(false); }}
                className="flex items-center justify-center gap-3 bg-[#fd0000] hover:bg-[#cc0000] text-white font-black text-base py-4 rounded-2xl uppercase tracking-widest shadow-xl shadow-[#fd0000]/30 transition-all active:scale-95 w-full"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <Ticket className="w-5 h-5" />
                Prendre ma place
              </a>
              <Link
                href="/boutique"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-sm py-3 rounded-xl transition-all w-full"
              >
                <ShoppingBag className="w-4 h-4" />
                Boutique
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
