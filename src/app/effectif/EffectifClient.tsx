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

const POSITION_COLORS: Record<string, string> = {
  GK: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  DEF: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  MID: "text-green-400 border-green-400/30 bg-green-400/10",
  ATT: "text-[#fd0000] border-[#fd0000]/30 bg-[#fd0000]/10",
};

const POSITION_LABELS: Record<string, string> = {
  GK: "Gardien",
  DEF: "Défenseur",
  MID: "Milieu",
  ATT: "Attaquant",
};

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((player, i) => (
            <PlayerCard key={player.id} player={player} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player, index }: { player: Player; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group glass-dark rounded-2xl overflow-hidden transition-all cursor-pointer px-5 py-4 flex items-center gap-5"
    >
      {player.photo?.trim() ? (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <Image
            src={player.photo}
            alt={`${player.firstName} ${player.name}`}
            fill
            className="object-cover object-top"
            sizes="80px"
            unoptimized={player.photo.startsWith("data:")}
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-xl bg-[#fd0000]/20 border border-[#fd0000]/20 flex items-center justify-center shrink-0">
          <span
            className="text-[#fd0000] text-lg font-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {player.firstName[0]}{player.name[0]}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider mb-1 ${POSITION_COLORS[player.position]}`}>
          {POSITION_LABELS[player.position]}
        </span>
        <h3 className="text-white font-black uppercase leading-tight truncate" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          <span className="text-white/50 text-sm block">{player.firstName}</span>
          <span className="text-lg group-hover:text-[#fd0000] transition-colors">{player.name}</span>
        </h3>
        <p className="text-white/40 text-xs mt-1 line-clamp-2">
          N°{player.number} · {player.stats?.appearances ?? 0} matchs cette saison
        </p>
      </div>
    </motion.div>
  );
}
