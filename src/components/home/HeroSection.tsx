"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ChevronDown, Ticket } from "lucide-react";
import { TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";
import type { SectionStyle, HeroBg } from "@/lib/db";
import type { Match } from "@/types";
import { VIDEOS } from "@/app/medias/MediasClient";

interface HeroProps {
  subtitle?: string;
  season?: string;
  ticketingUrl?: string;
  sectionStyle?: SectionStyle;
  heroBg?: HeroBg | null;
  nextMatch?: Match;
  /** Image de fond utilisée dans la section Prochain match (bgImage) */
  nextMatchBgImage?: string;
}

const DEFAULT_BG_URL = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1920&q=80";

export function HeroSection({
  subtitle,
  season,
  ticketingUrl,
  sectionStyle,
  heroBg,
  nextMatch,
  nextMatchBgImage,
}: HeroProps) {
  const textCol   = sectionStyle?.textColor?.trim() || "#ffffff";
  const ticketUrl = ticketingUrl ?? TICKETING.nextMatchUrl;

  const latestVideo = VIDEOS[0];
  const match       = nextMatch;
  const homeShort   = (match?.homeTeam ?? "ASNL").slice(0, 3).toUpperCase();
  const awayShort   = (match?.awayTeam ?? "").slice(0, 3).toUpperCase() || "???";

  const isVideo = heroBg?.type === "video" && heroBg.value?.trim();
  const bgImage = heroBg?.type === "image" && heroBg.value?.trim() ? heroBg.value : DEFAULT_BG_URL;

  return (
    <section
      className="relative h-[100svh] min-h-[600px] max-h-[1000px] overflow-hidden flex items-center -mt-16 md:-mt-20"
      style={sectionStyle?.bgColor ? { backgroundColor: sectionStyle.bgColor } : undefined}
    >

      {/* ── Fond : vidéo ou image ── */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            src={heroBg!.value}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
        )}
      </div>

      {/* ── Overlay rouge diagonal — signature visuelle ASNL ── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(110deg, rgba(200,16,46,0.75) 0%, rgba(200,16,46,0.45) 35%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Bas vers noir pour transition avec section suivante */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,10,10,1))",
        }}
      />

      {/* ── Grain ── */}
      <div
        className="absolute inset-0 z-10 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Contenu ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="flex flex-col max-w-3xl">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-5"
          >
            <span className="text-xs font-bold uppercase tracking-[0.4em]" style={{ color: textCol }}>
              {sectionStyle?.title ?? season ?? "Saison 2025 – 2026"}
            </span>
          </motion.div>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl mt-4 mb-6 max-w-lg leading-relaxed font-medium"
            style={{ color: textCol, opacity: 0.85 }}
          >
            {sectionStyle?.subtitle ?? subtitle ?? "Fondé en 1913. Fier. Lorrain. Irréductible."}
          </motion.p>

          {/* Derniers médias — carte liquid glass */}
          {latestVideo && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 -ml-2 sm:-ml-4"
            >
              <Link
                href="/medias"
                className="group flex items-center gap-4 text-white/90 glass-dark px-4 py-3 rounded-2xl"
              >
                <div className="relative w-32 h-20 sm:w-40 sm:h-24 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  <Image
                    src={latestVideo.thumbnail}
                    alt={latestVideo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <Play className="absolute w-5 h-5 text-white/80 left-3 bottom-3" />
                  <span className="absolute right-2 top-2 text-[11px] px-2 py-0.5 rounded-full bg-black/70 text-white/80 font-semibold">
                    {latestVideo.duration}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-2 bg-transparent text-white/90 border border-white/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    <Play className="w-3 h-3 fill-current" />
                    Derniers médias
                  </span>
                  <span className="text-sm font-semibold group-hover:text-white line-clamp-2">
                    {latestVideo.title}
                  </span>
                  <span className="text-xs text-white/60">
                    {latestVideo.competition} · {latestVideo.date}
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Prochain match — carte liquid glass (en dessous de Derniers médias) */}
          {match && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-4 flex -ml-2 sm:-ml-4"
            >
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => trackTicketingClick("hero_cta_bottom", "Derby vs Metz")}
                className="group flex items-center gap-4 text-white/90 glass-dark px-4 py-3 rounded-2xl max-w-md w-full"
              >
                {/* Vignette logos / VS avec fond section prochain match */}
                <div
                  className="relative w-32 h-20 sm:w-40 sm:h-24 rounded-xl overflow-hidden border border-white/10 bg-black/40 bg-cover bg-center"
                  style={
                    nextMatchBgImage?.trim()
                      ? { backgroundImage: `url('${nextMatchBgImage}')` }
                      : undefined
                  }
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center gap-3">
                    {/* Logo ASNL ou logo domicile */}
                    <div className="w-9 h-9 flex items-center justify-center overflow-hidden">
                      {match.homeLogo?.trim() ? (
                        <Image
                          src={match.homeLogo}
                          alt={match.homeTeam}
                          width={36}
                          height={36}
                          className="object-contain"
                          unoptimized={match.homeLogo.startsWith("data:")}
                        />
                      ) : (
                        <Image
                          src="/logo.jpeg"
                          alt={match.homeTeam}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <span
                      className="text-white/80 text-xs font-black tracking-[0.25em]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      VS
                    </span>
                    {/* Logo extérieur ou initiales */}
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/40 flex items-center justify-center overflow-hidden">
                      {match.awayLogo?.trim() ? (
                        <Image
                          src={match.awayLogo}
                          alt={match.awayTeam}
                          width={36}
                          height={36}
                          className="object-contain"
                          unoptimized={match.awayLogo.startsWith("data:")}
                        />
                      ) : (
                        <span className="text-white text-[11px] font-semibold">
                          {awayShort}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Texte + badge */}
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-2 bg-transparent text-white/90 border border-white/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    <Ticket className="w-3 h-3" />
                    Prochain match
                  </span>
                  <span className="text-sm font-semibold group-hover:text-white line-clamp-2">
                    {match.homeTeam} – {match.awayTeam}
                  </span>
                  <span className="text-xs text-white/60">
                    {formatDate(match.date)} · {match.time} · {match.stadium}
                  </span>
                </div>
              </a>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <span className="text-white/50 text-[10px] uppercase tracking-[0.35em] font-semibold">Découvrir</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
