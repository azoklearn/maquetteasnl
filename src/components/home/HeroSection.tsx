"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ChevronDown, Ticket, Newspaper, ArrowRight } from "lucide-react";
import { TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";
import { formatDate, formatShortDate, cn } from "@/lib/utils";
import { ExcerptWithLinks } from "@/components/ui/ExcerptWithLinks";
import type { SectionStyle, HeroBg } from "@/lib/db";
import type { Match, NewsArticle, MediaVideo } from "@/types";

interface HeroProps {
  subtitle?: string;
  season?: string;
  ticketingUrl?: string;
  sectionStyle?: SectionStyle;
  heroBg?: HeroBg | null;
  nextMatch?: Match;
  /** Image de fond utilisée dans la section Prochain match (bgImage) */
  nextMatchBgImage?: string;
  news?: NewsArticle[];
  /** Dernière vidéo affichée dans la carte Derniers médias */
  latestVideo?: MediaVideo | null;
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
  news = [],
  latestVideo,
}: HeroProps) {
  const textCol   = sectionStyle?.textColor?.trim() || "#ffffff";
  const ticketUrl = ticketingUrl ?? TICKETING.nextMatchUrl;
  const match       = nextMatch;
  const glassBg    = sectionStyle?.heroGlassBgColor?.trim() || "#ffffff";
  const glassBgOp  = (sectionStyle?.heroGlassBgOpacity ?? 85) / 100;
  const glassText  = sectionStyle?.heroGlassTextColor?.trim() || "#0A0A0A";
  const glassBgRgba = (() => {
    const m = glassBg.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return `rgba(255,255,255,${glassBgOp})`;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${glassBgOp})`;
  })();
  const homeShort   = (match?.homeTeam ?? "ASNL").slice(0, 3).toUpperCase();
  const awayShort   = (match?.awayTeam ?? "").slice(0, 3).toUpperCase() || "???";

  const latestArticle = news[0];
  const bgImage =
    latestArticle?.image?.trim()
      ? latestArticle.image
      : heroBg?.type === "image" && heroBg.value?.trim()
        ? heroBg.value
        : DEFAULT_BG_URL;

  return (
    <section
      className="relative h-[100svh] min-h-[600px] max-h-[1000px] overflow-visible flex items-center -mt-16 md:-mt-20"
      style={sectionStyle?.bgColor ? { backgroundColor: sectionStyle.bgColor } : undefined}
    >

      {/* ── Fond : image de la dernière actualité ── */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      </div>

      {/* ── Overlay dégradé (modifiable en admin) ── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: (() => {
            const hexToRgba = (hex: string, a: number) => {
              const m = hex?.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
              if (!m) return `rgba(0,0,0,${a / 100})`;
              return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a / 100})`;
            };
            const topC = sectionStyle?.heroOverlayTopColor ?? "#c8102e";
            const topO = sectionStyle?.heroOverlayTopOpacity ?? 75;
            const bottomC = sectionStyle?.heroOverlayBottomColor ?? "#000000";
            const bottomO = sectionStyle?.heroOverlayBottomOpacity ?? 55;
            const dir = sectionStyle?.heroOverlayDirection ?? 110;
            return `linear-gradient(${dir}deg, ${hexToRgba(topC, topO)} 0%, ${hexToRgba(bottomC, bottomO)} 100%)`;
          })(),
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
      <div className="relative z-20 w-full h-full flex items-center justify-center pt-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-8 mt-12 md:mt-16">
          {/* Colonne gauche : titre + texte + bloc article */}
          <div className="flex flex-col max-w-3xl items-center sm:items-start">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-5 text-center sm:text-left w-full"
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
            className="text-base md:text-xl mt-1 mb-2 max-w-lg leading-relaxed font-medium text-center sm:text-left"
            style={{ color: textCol, opacity: 0.85 }}
          >
            {sectionStyle?.subtitle ?? subtitle ?? "Fondé en 1967. Fier. Lorrain. Irréductible."}
          </motion.p>

          {/* Dernière actualité mise en avant */}
          {latestArticle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 mb-6 w-full max-w-xl self-start ml-0 sm:-ml-10 lg:-ml-24"
            >
              <div className="flex flex-col gap-2 max-w-xl">
                <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-snug line-clamp-2">
                  {latestArticle.title}
                </h2>
                <p className="text-xs md:text-sm text-white/80 line-clamp-3">
                  {latestArticle.excerpt}
                </p>
              </div>
            </motion.div>
          )}

          </div>

          {/* Bouton Lire l'article à droite */}
          {latestArticle && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hidden md:flex items-center justify-end flex-1"
            >
              <Link
                href={`/actualites/${latestArticle.slug}`}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold uppercase tracking-[0.18em] text-xs transition-all backdrop-blur-md border border-white/40 hover:border-white"
              >
                Lire l&apos;article
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

        </div>
      </div>

      {/* ── Liquid glass prochain match en bas du hero ── */}
      {match && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 h-[200px] sm:h-[230px] flex items-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={() => trackTicketingClick("hero_bottom_glass", match.homeTeam + " vs " + match.awayTeam)}
            className="group flex items-center justify-between gap-4 sm:gap-8 w-full h-full px-6 sm:px-12 lg:px-20 transition-all duration-300 hover:bg-white/[0.08] backdrop-blur-[20px] border border-t border-x-0 border-b-0"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#ffffff",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              {/* Logos VS */}
              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-xl border border-white/25 bg-white/5 backdrop-blur-sm">
                  {match.homeLogo?.trim() ? (
                    <Image src={match.homeLogo} alt={match.homeTeam} width={72} height={72} className="object-contain" unoptimized />
                  ) : (
                    <Image src="/logo.jpeg" alt={match.homeTeam} width={72} height={72} className="object-contain" />
                  )}
                </div>
                <span className="text-sm sm:text-base font-black tracking-widest text-white/90" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>VS</span>
                <div className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-xl border border-white/25 bg-white/5 backdrop-blur-sm shrink-0",
                  !match.awayLogo?.trim() && "bg-white/10"
                )}>
                  {match.awayLogo?.trim() ? (
                    <Image src={match.awayLogo} alt={match.awayTeam} width={72} height={72} className="object-contain" unoptimized />
                  ) : (
                    <span className="text-sm font-bold text-white">{awayShort}</span>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/50 text-white mb-2">
                  <Ticket className="w-4 h-4" /> Prochain match
                </span>
                <p className="text-base sm:text-lg font-bold truncate text-white group-hover:text-[#fd0000] transition-colors">
                  {match.homeTeam} – {match.awayTeam}
                </p>
                <p className="text-sm sm:text-base truncate text-white/90">
                  {formatDate(match.date)} · {match.time} · {match.stadium}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0 px-5 py-3 rounded-xl bg-white/15 text-white group-hover:bg-[#fd0000] transition-colors">
              <span className="text-sm font-bold uppercase tracking-wider">Billetterie</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </a>
        </motion.div>
      )}

    </section>
  );
}
