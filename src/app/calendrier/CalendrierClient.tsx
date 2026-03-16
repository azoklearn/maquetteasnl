"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Ticket, MapPin, Calendar } from "lucide-react";
import { MATCHES } from "@/lib/mock-data";
import { TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";

type Tab = "upcoming" | "finished";

export function CalendrierClient({ matches: matchesProp }: { matches?: Match[] }) {
  const [tab, setTab] = useState<Tab>("upcoming");

  const allMatches = matchesProp ?? MATCHES;
  const upcoming = allMatches.filter((m) => m.status === "upcoming");
  const finished = allMatches.filter((m) => m.status === "finished");
  const displayed = tab === "upcoming" ? upcoming : finished;

  // Ouvre directement l'onglet "Résultats" si l'URL contient #resultats
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#resultats") {
      setTab("finished");
    }
  }, []);


  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-8">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/5 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.35em] mb-3">Saison 2025–2026</p>
          <h1
            className="text-white text-6xl md:text-8xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Calendrier
          </h1>
          <p className="text-white/50 mt-4 text-base max-w-xl">
            Tous les matchs de la saison en Ligue 2 BKT. Réservez votre place pour les matchs à domicile.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-10 bg-white/5 p-1 rounded-xl w-fit">
          {([["upcoming", "Prochains matchs"], ["finished", "Résultats"]] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "px-6 py-3 rounded-lg text-sm font-semibold transition-all uppercase tracking-wide",
                tab === key
                  ? "bg-[#fd0000] text-white shadow-lg shadow-[#fd0000]/30"
                  : "text-white/50 hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Match list */}
        <div className="flex flex-col gap-4">
          {displayed.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "group bg-[#141414] hover:bg-[#1A1A1A] border rounded-2xl p-5 md:p-6 transition-all",
                match.isHighProfile
                  ? "border-[#fd0000]/30"
                  : "border-white/5 hover:border-white/10",
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                {/* Competition & date */}
                <div className="shrink-0 md:w-48">
                  <span className="text-[#fd0000] text-xs font-semibold uppercase tracking-wider block mb-1">
                    {match.competition}
                  </span>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(match.date)}</span>
                  </div>
                  <div className="text-white/50 text-sm ml-5">{match.time}</div>
                </div>

                {/* Teams */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Domicile */}
                  <div className={cn(
                    "text-right flex-1 flex items-center justify-end gap-2",
                    match.isHome ? "text-white font-bold" : "text-white/70",
                  )}>
                    <span className="text-base md:text-xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {match.homeTeam}
                    </span>
                    {match.homeLogo?.trim() ? (
                      <div className="w-8 h-8 shrink-0 relative bg-transparent">
                        <Image src={match.homeLogo} alt={match.homeTeam} fill className="object-contain" sizes="32px" unoptimized />
                      </div>
                    ) : (
                      <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black text-white/40">
                        {match.homeTeam.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Score / VS */}
                  <div className="shrink-0 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-center min-w-[60px]">
                    {match.status === "finished" ? (
                      <span
                        className="text-xl font-black text-white"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {match.homeScore} – {match.awayScore}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-white/40">VS</span>
                    )}
                  </div>

                  {/* Extérieur */}
                  <div className={cn(
                    "flex-1 flex items-center gap-2",
                    !match.isHome ? "text-white font-bold" : "text-white/70",
                  )}>
                    {match.awayLogo?.trim() ? (
                      <div className="w-8 h-8 shrink-0 relative bg-transparent">
                        <Image src={match.awayLogo} alt={match.awayTeam} fill className="object-contain" sizes="32px" unoptimized />
                      </div>
                    ) : (
                      <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black text-white/40">
                        {match.awayTeam.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-base md:text-xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {match.awayTeam}
                    </span>
                  </div>
                </div>

                {/* Stadium & CTA */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden lg:flex items-center gap-1.5 text-white/30 text-xs">
                    <MapPin className="w-3 h-3" />
                    {match.stadium}
                  </div>

                  {match.status === "upcoming" && match.ticketingUrl ? (
                    <a
                      href={match.ticketingUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      onClick={() => trackTicketingClick("calendrier_match_card", `${match.homeTeam} vs ${match.awayTeam}`)}
                      className="flex items-center gap-2 bg-[#fd0000] hover:bg-[#cc0000] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all hover:scale-105 uppercase tracking-wide whitespace-nowrap"
                    >
                      <Ticket className="w-4 h-4" />
                      <span className="hidden sm:inline">Billets</span>
                    </a>
                  ) : match.status === "upcoming" ? (
                    <span className="text-xs text-white/30 italic">Bientôt disponible</span>
                  ) : (
                    <div className={cn(
                      "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg",
                      match.homeScore !== undefined && match.awayScore !== undefined
                        ? (match.isHome ? match.homeScore > match.awayScore! : match.awayScore! > match.homeScore)
                          ? "bg-green-500/20 text-green-400"
                          : match.homeScore === match.awayScore
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                        : "bg-white/5 text-white/30"
                    )}>
                      {match.homeScore !== undefined && match.awayScore !== undefined
                        ? (match.isHome ? match.homeScore > match.awayScore! : match.awayScore! > match.homeScore)
                          ? "Victoire"
                          : match.homeScore === match.awayScore
                          ? "Nul"
                          : "Défaite"
                        : "Terminé"}
                    </div>
                  )}
                </div>
              </div>

              {match.isHighProfile && match.status === "upcoming" && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Choc de la saison · Places limitées · Forte affluence attendue
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
