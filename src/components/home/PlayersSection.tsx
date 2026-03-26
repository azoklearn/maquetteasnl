"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Player } from "@/types";
import type { SectionStyle } from "@/lib/db";
import { titleSizeClass } from "@/lib/sectionStyle";

const POSITION_LABELS: Record<string, string> = {
  GK: "Gardien",
  DEF: "Défenseur",
  MID: "Milieu",
  ATT: "Attaquant",
};

const POSITION_BADGE: Record<string, string> = {
  GK: "bg-amber-500 text-black",
  DEF: "bg-blue-500 text-white",
  MID: "bg-emerald-500 text-white",
  ATT: "bg-[#fd0000] text-white",
};

export function PlayersSection({ players = [], sectionStyle }: { players?: Player[]; sectionStyle?: SectionStyle }) {
  const maxCards = 6;
  const featuredPlayers = players.filter((p) => p.isFeatured);
  const nonFeaturedPlayers = players.filter((p) => !p.isFeatured);
  const newestNonFeaturedFirst = [...nonFeaturedPlayers].reverse();
  let featured = [...featuredPlayers, ...newestNonFeaturedFirst].slice(0, maxCards);
  const latestAdded = players[players.length - 1];
  if (latestAdded && !featured.some((p) => p.id === latestAdded.id)) {
    featured = [...featured.slice(0, maxCards - 1), latestAdded];
  }
  const textCol = sectionStyle?.textColor?.trim() || "#ffffff";
  const titleCls = titleSizeClass(sectionStyle, "text-4xl md:text-6xl");
  const sectionTitle = sectionStyle?.title?.trim() || "Nos joueurs";
  const sectionSubtitle = sectionStyle?.subtitle?.trim() || "Les chardons qui portent nos couleurs";

  return (
    <section className="h-full min-h-[100dvh] overflow-hidden" style={{ backgroundColor: sectionStyle?.bgColor ?? "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-10 md:py-12 flex flex-col">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8 md:mb-10 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-[3px] w-14 bg-[#fd0000] mb-4" />
            <h2
              className={`font-black uppercase leading-none ${titleCls}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: textCol }}
            >
              {sectionTitle}
            </h2>
            <p className="text-white/45 text-sm mt-3">
              {sectionSubtitle}
            </p>
          </motion.div>

          <Link
            href="/effectif"
            className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#fd0000] hover:text-[#ff3b3b] transition-colors group"
          >
            Voir effectif complet
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 flex-1 min-h-0">
          {featured.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link href={`/effectif/${player.id}`} className="group block">
                <div className="relative h-full rounded-xl overflow-hidden bg-[#171717] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="relative h-32 bg-[#202020] flex items-center justify-center overflow-hidden">
                    <div className={`absolute top-2 left-2 inline-flex text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider ${POSITION_BADGE[player.position] ?? "bg-[#fd0000] text-white"}`}>
                      {player.position}
                    </div>
                    {player.photo?.trim() ? (
                      <>
                        <Image
                          src={player.photo}
                          alt={`${player.firstName} ${player.name}`}
                          fill
                          className={`object-cover object-top transition-opacity duration-300 ${player.photoHover?.trim() ? "group-hover:opacity-0" : ""} opacity-90`}
                          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
                          unoptimized={player.photo.startsWith("data:")}
                        />
                        {player.photoHover?.trim() && (
                          <Image
                            src={player.photoHover}
                            alt={`${player.firstName} ${player.name} — action`}
                            fill
                            className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
                            unoptimized={player.photoHover.startsWith("data:")}
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-18 h-18 md:w-24 md:h-24 rounded-full bg-[#fd0000]/15 border border-[#fd0000]/20 flex items-center justify-center transition-all">
                        <span
                          className="text-[#fd0000] text-2xl md:text-3xl font-black transition-colors"
                          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                          {player.firstName[0]}{player.name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-white/25 text-[11px] mb-1">#{player.number}</p>
                    <h3
                      className="font-black uppercase leading-tight"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      <span className="text-white text-xl block leading-none">{player.firstName}</span>
                      <span className="text-white text-xl block leading-none">{player.name}</span>
                    </h3>
                    <p className="text-white/45 text-xs mt-2">{POSITION_LABELS[player.position]}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center md:hidden shrink-0">
          <Link
            href="/effectif"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors"
          >
            Voir l&apos;effectif complet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
