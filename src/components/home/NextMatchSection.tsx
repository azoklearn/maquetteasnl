"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ticket, Flame, AlertCircle, MapPin, Calendar } from "lucide-react";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { NEXT_MATCH, TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";
import type { Match } from "@/types";
import type { SectionStyle } from "@/lib/db";

export function NextMatchSection({ match: matchProp, sectionStyle }: { match?: Match; sectionStyle?: SectionStyle }) {
  const match  = matchProp ?? NEXT_MATCH;
  const accent = sectionStyle?.bgColor ?? "#fd0000";

  function handleTicketClick(source: string) {
    trackTicketingClick(source, `${match.homeTeam} vs ${match.awayTeam}`);
  }

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: accent }}>
      {/* ── Texture pattern blanc sur rouge ── */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 0, transparent 40px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 0, transparent 40px)",
        }}
      />

      {/* ── Gros texte fantôme en fond ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      >
        <span
          className="text-white/[0.04] font-black uppercase leading-none whitespace-nowrap"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(120px, 20vw, 280px)",
          }}
        >
          {match.awayTeam}
        </span>
      </div>

      {/* ── Barre blanche top ── */}
      <div className="h-1 bg-white/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* ── Badges ── */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {match.isHighProfile && (
            <span className="flex items-center gap-2 bg-white text-[#fd0000] text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
              <Flame className="w-3 h-3" />
              Choc de la saison
            </span>
          )}
          <span className="flex items-center gap-2 bg-white/15 border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" />
            Places limitées
          </span>
          <span className="bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
            {match.competition}
          </span>
        </motion.div>

        {/* ── Label ── */}
        <motion.p
          className="text-white/70 text-xs font-bold uppercase tracking-[0.4em] text-center mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Prochain match
        </motion.p>

        {/* ── Matchup ── */}
        <motion.div
          className="flex items-center justify-center gap-4 md:gap-12 mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Équipe domicile */}
          <div className="text-center flex-1 max-w-[240px]">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-black/30 overflow-hidden p-1">
              <div className="relative w-full h-full">
                {match.homeLogo?.trim() ? (
                  <Image
                    src={match.homeLogo}
                    alt={match.homeTeam}
                    fill
                    className="object-contain"
                    sizes="112px"
                    unoptimized={match.homeLogo.startsWith("data:")}
                  />
                ) : (
                  <Image
                    src="/logo.jpeg"
                    alt={match.homeTeam}
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                )}
              </div>
            </div>
            <h2
              className="text-white text-2xl md:text-4xl font-black uppercase leading-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {match.homeTeam}
            </h2>
            <span className="text-white/50 text-xs uppercase tracking-widest mt-1 block font-semibold">
              {match.isHome ? "Domicile" : "Extérieur"}
            </span>
          </div>

          {/* VS */}
          <div className="text-center shrink-0">
            <div
              className="text-5xl md:text-8xl font-black text-white/20 leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              VS
            </div>
          </div>

          {/* Équipe visiteur */}
          <div className="text-center flex-1 max-w-[240px]">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-black/30 overflow-hidden p-1">
              {match.awayLogo?.trim() ? (
                <div className="relative w-full h-full">
                  <Image
                    src={match.awayLogo}
                    alt={match.awayTeam}
                    fill
                    className="object-contain"
                    sizes="112px"
                    unoptimized={match.awayLogo.startsWith("data:")}
                  />
                </div>
              ) : (
                <span
                  className="text-[#fd0000] text-xl md:text-2xl font-black"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {match.awayTeam.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <h2
              className="text-white text-2xl md:text-4xl font-black uppercase leading-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {match.awayTeam}
            </h2>
            <span className="text-white/50 text-xs uppercase tracking-widest mt-1 block font-semibold">
              {match.isHome ? "Visiteur" : "Domicile"}
            </span>
          </div>
        </motion.div>

        {/* ── Infos match ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-white/70 font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            {formatDate(match.date)} — {match.time}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block" />
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white" />
            {match.stadium}
          </span>
        </motion.div>

        {/* ── Countdown — chiffres blancs ── */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <CountdownTimerWhite date={match.date} time={match.time} />
        </motion.div>

        {/* ── CTA Billetterie — blanc avec texte rouge ── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href={match.ticketingUrl ?? TICKETING.nextMatchUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={() => handleTicketClick("next_match_section_primary")}
            className="group flex items-center gap-3 bg-white hover:bg-white/90 text-[#fd0000] font-black text-lg md:text-xl px-10 md:px-16 py-5 rounded-full transition-all hover:scale-105 uppercase tracking-wider shadow-2xl shadow-black/30"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <Ticket className="w-6 h-6 transition-transform group-hover:rotate-12" />
            Prendre ma place
          </a>
        </motion.div>

      </div>

      {/* ── Barre blanche bas ── */}
      <div className="h-1 bg-white/30" />
    </section>
  );
}

/* ── Countdown adapté au fond rouge ── */
import { useState, useEffect } from "react";
import { getTimeUntil } from "@/lib/utils";

function CountdownTimerWhite({ date, time }: { date: string; time: string }) {
  const [countdown, setCountdown] = useState(getTimeUntil(date, time));
  useEffect(() => {
    const t = setInterval(() => setCountdown(getTimeUntil(date, time)), 1000);
    return () => clearInterval(t);
  }, [date, time]);

  if (countdown.isPast) {
    return <span className="text-white font-black text-2xl uppercase tracking-widest">Match en cours</span>;
  }

  const units = [
    { label: "Jours", value: countdown.days },
    { label: "Heures", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Secondes", value: countdown.seconds },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="text-center">
            <div
              className="bg-white/15 border border-white/30 rounded-xl px-3 py-2 sm:px-5 sm:py-3 min-w-[56px] sm:min-w-[72px]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span className="text-3xl sm:text-5xl text-white leading-none tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.2em] mt-1 block font-semibold">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              className="text-2xl sm:text-4xl text-white/60 font-black leading-none mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
