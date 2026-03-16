"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PLAYERS, STAFF_MEMBERS } from "@/lib/mock-data";
import type { Player, StaffMember } from "@/types";

interface EffectifClientProps { players?: Player[]; staff?: StaffMember[] }

type Tab = "PLAYERS" | "STAFF";
type PositionFilter = "ALL" | "GK" | "DEF" | "MID" | "ATT";
type CategoryFilter = "ALL" | "SENIOR" | "FEMININE" | "YOUTH";

const TABS: { key: Tab; label: string }[] = [
  { key: "PLAYERS", label: "Joueurs" },
  { key: "STAFF",   label: "Staff & coach" },
];

const POSITION_FILTERS: { key: PositionFilter; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "GK", label: "Gardiens" },
  { key: "DEF", label: "Défenseurs" },
  { key: "MID", label: "Milieux" },
  { key: "ATT", label: "Attaquants" },
];

const CATEGORY_FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: "ALL",      label: "Tout l'effectif" },
  { key: "SENIOR",   label: "Séniors" },
  { key: "FEMININE", label: "Féminines" },
  { key: "YOUTH",    label: "Jeunes" },
];

export function EffectifClient({ players: playersProp, staff: staffProp }: EffectifClientProps) {
  const players = playersProp?.length ? playersProp : PLAYERS;
  const staff = staffProp?.length ? staffProp : STAFF_MEMBERS;
  const [tab, setTab] = useState<Tab>("PLAYERS");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");

  const normalized = players.map((p) => ({ ...p, category: p.category ?? "SENIOR" as const }));
  const byCategory =
    categoryFilter === "ALL" ? normalized : normalized.filter((p) => p.category === categoryFilter);
  const filtered =
    positionFilter === "ALL" ? byCategory : byCategory.filter((p) => p.position === positionFilter);

  // Ouvre directement l'onglet "Staff & coach" si l'URL contient #staff
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#staff") {
      setTab("STAFF");
    }
  }, []);

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
        {/* ── Onglets Joueurs / Staff ── */}
        <div className="flex gap-2 mb-8">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all ${
                tab === key
                  ? "bg-[#fd0000] text-white shadow-lg shadow-[#fd0000]/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "PLAYERS" && (
          <>
            {/* Filtres catégories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setCategoryFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all uppercase tracking-wide ${
                    categoryFilter === f.key
                      ? "bg-white text-[#0A0A0A]"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Filtres postes */}
            <div className="flex flex-wrap gap-2 mb-10">
              {POSITION_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setPositionFilter(f.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all uppercase tracking-wide ${
                    positionFilter === f.key
                      ? "bg-[#fd0000] text-white shadow-lg shadow-[#fd0000]/30"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Grid joueurs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {filtered.map((player, i) => (
                <PlayerCard key={player.id} player={player} index={i} />
              ))}
            </div>
          </>
        )}

        {tab === "STAFF" && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className="bg-[#141414] border border-white/5 rounded-2xl px-5 py-4 flex flex-col gap-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  {member.role}
                </p>
                <p className="text-white text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {member.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const POS_LABELS: Record<Player["position"], string> = {
  GK: "Gardien",
  DEF: "Défenseur",
  MID: "Milieu",
  ATT: "Attaquant",
};

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
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#111]">
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

        {/* Badge numéro + poste au survol */}
        <div className="absolute inset-0 flex items-end justify-center p-3 pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/10">
              <span
                className="text-white font-black text-sm leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                #{player.number}
              </span>
              <span className="text-white/70 text-[11px] uppercase tracking-[0.18em]">
                {POS_LABELS[player.position]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nom toujours visible sous la carte */}
      <div className="mt-2 text-center">
        <p
          className="text-white font-black uppercase leading-tight"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1rem, 2.4vw, 1.35rem)" }}
        >
          {player.firstName} {player.name}
        </p>
      </div>
    </motion.div>
  );
}
