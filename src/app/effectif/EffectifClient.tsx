"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PLAYERS } from "@/lib/mock-data";
import type { Player } from "@/types";

interface EffectifClientProps { players?: Player[] }

type Filter = "ALL" | "GK" | "DEF" | "MID" | "ATT";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "GK", label: "Gardiens" },
  { key: "DEF", label: "Défenseurs" },
  { key: "MID", label: "Milieux" },
  { key: "ATT", label: "Attaquants" },
];

export function EffectifClient({ players: playersProp }: EffectifClientProps) {
  const players = playersProp?.length ? playersProp : PLAYERS;
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = filter === "ALL" ? players : players.filter((p) => p.position === filter);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-8">
      {/* ── Page header ── */}
      <div className="relative bg-[#111] border-b border-white/5 py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.35em] mb-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Saison 2025 – 2026
          </motion.p>
          <motion.h1
            className="text-white text-6xl md:text-8xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            L'Effectif
          </motion.h1>
          <motion.p
            className="text-white/50 mt-4 text-base max-w-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {players.length} joueur{players.length > 1 ? "s" : ""} professionnel{players.length > 1 ? "s" : ""} sous les couleurs rouge et blanc.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all uppercase tracking-wide ${
                filter === f.key
                  ? "bg-[#fd0000] text-white shadow-lg shadow-[#fd0000]/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {filtered.map((player, i) => (
            <PlayerCard key={player.id} player={player} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player, index }: { player: Player; index: number }) {
  const hasPhoto = player.photo?.trim();
  const hasHoverPhoto = player.photoHover?.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col"
    >
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#111]">
        {hasPhoto ? (
          <>
            <Image
              src={player.photo!}
              alt={`${player.firstName} ${player.name}`}
              fill
              className={`object-cover object-top transition-all duration-300 group-hover:scale-105 ${hasHoverPhoto ? "group-hover:opacity-0" : ""}`}
              sizes="(max-width: 640px) 50vw, 33vw"
              unoptimized={player.photo!.startsWith("data:")}
            />
            {hasHoverPhoto && (
              <Image
                src={player.photoHover!}
                alt={`${player.firstName} ${player.name} — action`}
                fill
                className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
                sizes="(max-width: 640px) 50vw, 33vw"
                unoptimized={player.photoHover!.startsWith("data:")}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-[#fd0000] text-5xl font-black"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {player.firstName[0]}{player.name[0]}
            </span>
          </div>
        )}
        {/* Nom en overlay au survol */}
        <div
          className="absolute inset-0 flex items-end justify-center p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <h3
            className="text-white font-black uppercase leading-tight text-center drop-shadow-lg"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
          >
            {player.firstName} {player.name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
