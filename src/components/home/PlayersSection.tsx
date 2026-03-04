"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Zap } from "lucide-react";
import type { Player } from "@/types";
import type { SectionStyle } from "@/lib/db";
import { titleSizeClass } from "@/lib/sectionStyle";

const POSITION_LABELS: Record<string, string> = {
  GK: "Gardien",
  DEF: "Défenseur",
  MID: "Milieu",
  ATT: "Attaquant",
};

export function PlayersSection({ players = [], sectionStyle }: { players?: Player[]; sectionStyle?: SectionStyle }) {
  const featuredPlayers = players.filter((p) => p.isFeatured);
  const featured = featuredPlayers.length > 0 ? featuredPlayers : players.slice(0, 6);
  const accent     = sectionStyle?.accentColor?.trim() || "#fd0000";
  const textCol    = sectionStyle?.textColor?.trim()   || "#ffffff";
  const titleCls   = titleSizeClass(sectionStyle, "text-4xl md:text-6xl");

  return (
    <section className="section-padding" style={{ backgroundColor: sectionStyle?.bgColor ?? "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] block mb-2" style={{ color: accent }}>
              {sectionStyle?.subtitle ?? "L'Effectif"}
            </span>
            <h2
              className={`font-black uppercase leading-none ${titleCls}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: textCol }}
            >
              {sectionStyle?.title ? sectionStyle.title : (<>L'<span style={{ color: accent }}>équipe</span></>)}
            </h2>
          </motion.div>

          <Link
            href="/effectif"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors group"
          >
            Effectif complet
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Grille ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {featured.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link href={`/effectif/${player.id}`} className="group block">
                <div className="relative bg-white hover:bg-[#fd0000] rounded-2xl overflow-hidden transition-all duration-300 border border-[#e5e5e5] hover:border-[#fd0000] hover:shadow-xl hover:shadow-[#fd0000]/25">

                  {/* Numéro en watermark */}
                  <div
                    className="absolute -top-2 -right-2 text-8xl md:text-9xl font-black text-black/[0.04] group-hover:text-white/[0.08] leading-none select-none transition-colors"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {player.number}
                  </div>

                  {/* Avatar */}
                  <div className="relative h-36 md:h-48 bg-[#f5f5f5] group-hover:bg-[#d40000] flex items-center justify-center overflow-hidden transition-colors">
                    {/* Numéro haut droite */}
                    <div
                      className="absolute top-3 right-3 text-[#0A0A0A]/20 group-hover:text-white/40 text-3xl font-black leading-none transition-colors z-10"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {player.number}
                    </div>

                    {player.photo?.trim() ? (
                      <>
                        {/* Photo principale */}
                        <Image
                          src={player.photo}
                          alt={`${player.firstName} ${player.name}`}
                          fill
                          className={`object-cover object-top transition-opacity duration-300 ${player.photoHover?.trim() ? "group-hover:opacity-0" : ""}`}
                          sizes="(max-width: 768px) 50vw, 33vw"
                          unoptimized={player.photo.startsWith("data:")}
                        />
                        {/* Photo hover */}
                        {player.photoHover?.trim() && (
                          <Image
                            src={player.photoHover}
                            alt={`${player.firstName} ${player.name} — action`}
                            fill
                            className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            unoptimized={player.photoHover.startsWith("data:")}
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-18 h-18 md:w-24 md:h-24 rounded-full bg-[#fd0000]/15 group-hover:bg-white/20 border border-[#fd0000]/20 group-hover:border-white/30 flex items-center justify-center transition-all">
                        <span
                          className="text-[#fd0000] group-hover:text-white text-2xl md:text-3xl font-black transition-colors"
                          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                          {player.firstName[0]}{player.name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Badge poste */}
                    <span className="inline-flex text-[10px] font-black px-2 py-0.5 rounded mb-2 bg-[#fd0000]/10 text-[#fd0000] group-hover:bg-white/20 group-hover:text-white uppercase tracking-wider transition-colors">
                      {POSITION_LABELS[player.position]}
                    </span>

                    <h3
                      className="font-black uppercase leading-tight"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      <span className="text-[#0A0A0A]/50 group-hover:text-white/60 text-xs block transition-colors">{player.firstName}</span>
                      <span className="text-[#0A0A0A] group-hover:text-white text-xl md:text-2xl transition-colors">{player.name}</span>
                    </h3>

                    {/* Stats */}
                    <div className="flex gap-4 mt-3 pt-3 border-t border-black/8 group-hover:border-white/15 transition-colors">
                      <div className="flex items-center gap-1.5 text-xs text-[#0A0A0A]/50 group-hover:text-white/60 transition-colors">
                        <Target className="w-3 h-3 text-[#fd0000] group-hover:text-white/80 transition-colors" />
                        <span className="text-[#0A0A0A] group-hover:text-white font-bold transition-colors">{player.stats.goals}</span>
                        <span>buts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#0A0A0A]/50 group-hover:text-white/60 transition-colors">
                        <Zap className="w-3 h-3 text-amber-500 group-hover:text-amber-300 transition-colors" />
                        <span className="text-[#0A0A0A] group-hover:text-white font-bold transition-colors">{player.stats.assists}</span>
                        <span>passes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/effectif"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors"
          >
            Voir l'effectif complet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
