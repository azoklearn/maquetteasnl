"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowUp, ArrowDown, WifiOff } from "lucide-react";
import { STANDINGS } from "@/lib/mock-data";
import type { StandingEntry } from "@/types";
import { cn } from "@/lib/utils";

// ── Zones Ligue 2 ──────────────────────────────────────────────────────────────
type Zone = "promotion" | "playoff" | "safe" | "relegation";

function getZone(pos: number): Zone {
  if (pos <= 2)  return "promotion";
  if (pos === 3) return "playoff";
  if (pos >= 16) return "relegation";
  return "safe";
}

const ZONE_CONFIG: Record<Zone, { bar: string }> = {
  promotion:  { bar: "bg-green-500"  },
  playoff:    { bar: "bg-blue-500"   },
  safe:       { bar: "bg-transparent"},
  relegation: { bar: "bg-red-500"    },
};

const FORM_STYLE: Record<"W" | "D" | "L", string> = {
  W: "bg-green-500 text-white",
  D: "bg-[#e5e5e5] text-[#0A0A0A]/60",
  L: "bg-red-500 text-white",
};
const FORM_FR: Record<"W" | "D" | "L", string> = { W: "V", D: "N", L: "D" };

// ── Response API ───────────────────────────────────────────────────────────────
interface ApiResponse {
  standings: StandingEntry[];
  source: "live" | "mock" | "fallback";
  updatedAt: string;
  error?: string;
}

// ── Widget ─────────────────────────────────────────────────────────────────────
export function LiveStandingsWidget() {
  const [standings,   setStandings]   = useState<StandingEntry[]>(STANDINGS);
  const [source,      setSource]      = useState<ApiResponse["source"]>("mock");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing,setIsRefreshing]= useState(false);
  const [showAll,     setShowAll]     = useState(false);
  const [flashRow,    setFlashRow]    = useState<string | null>(null);
  const [journee,     setJournee]     = useState<number | null>(null);

  const fetchStandings = useCallback(async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      const res  = await fetch("/api/standings", { cache: "no-store" });
      const data: ApiResponse = await res.json();

      setStandings(data.standings);
      setSource(data.source);
      setLastUpdated(new Date(data.updatedAt));

      // Calcule la journée depuis le nombre de matchs joués
      const played = data.standings[0]?.played;
      if (played) setJournee(played);

      // Flash la ligne ASNL
      const asnlName = data.standings.find((e) => e.isASNL)?.team;
      if (asnlName) {
        setFlashRow(asnlName);
        setTimeout(() => setFlashRow(null), 2000);
      }
    } catch {
      // silencieux : on conserve les données actuelles
    } finally {
      if (showLoader) setIsRefreshing(false);
    }
  }, []);

  // Fetch initial
  useEffect(() => { fetchStandings(true); }, [fetchStandings]);

  // Auto-refresh toutes les 5 minutes
  useEffect(() => {
    const t = setInterval(() => fetchStandings(false), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [fetchStandings]);

  const displayed = showAll ? standings : standings.slice(0, 8);
  const asnl      = standings.find((e) => e.isASNL);
  const isLive    = source === "live";

  return (
    <div className="rounded-2xl overflow-hidden border border-[#e5e5e5] shadow-xl shadow-black/8 bg-white">

      {/* ── Header ── */}
      <div className="bg-[#0A0A0A] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo ASNL */}
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden p-0.5">
            <div className="relative w-full h-full">
              <Image src="/logo.jpeg" alt="ASNL" fill className="object-contain" sizes="36px" />
            </div>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Ligue 2 BKT
            </p>
            <p className="text-white/40 text-[10px] font-medium mt-0.5">
              Saison 2024–25{journee ? ` · J${journee}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Indicateur source */}
          <div className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 border",
            isLive
              ? "bg-[#fd0000]/20 border-[#fd0000]/40"
              : "bg-amber-500/20 border-amber-500/40",
          )}>
            {isLive
              ? <><span className="w-1.5 h-1.5 rounded-full bg-[#fd0000] animate-pulse" />
                  <span className="text-[#fd0000] text-[10px] font-black uppercase tracking-wider">Live</span></>
              : <><WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 text-[10px] font-black uppercase tracking-wider">Local</span></>
            }
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchStandings(true)}
            disabled={isRefreshing}
            className="p-1.5 text-white/40 hover:text-white transition-colors disabled:opacity-40"
            aria-label="Rafraîchir le classement"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* ── Skeleton loader ── */}
      {isRefreshing && standings.length === 0 && (
        <div className="p-5 flex flex-col gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-[#f5f5f5] rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Bandeau ASNL ── */}
      {asnl && (
        <div className="bg-[#fd0000] px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden p-0.5">
              <div className="relative w-full h-full">
                <Image src="/logo.jpeg" alt="ASNL" fill className="object-contain" sizes="32px" />
              </div>
            </div>
            <div>
              <p className="text-white font-black text-sm leading-none">{asnl.team}</p>
              <p className="text-white/60 text-[10px] mt-0.5 font-medium">{asnl.played} matchs joués</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {[
              { val: `${asnl.position}e`, lbl: "Rang" },
              { val: String(asnl.points),  lbl: "Pts"  },
              { val: asnl.goalDiff > 0 ? `+${asnl.goalDiff}` : String(asnl.goalDiff), lbl: "Diff" },
            ].map((s, i, arr) => (
              <div key={s.lbl} className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-white font-black text-xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.val}</p>
                  <p className="text-white/50 text-[9px] uppercase tracking-wider">{s.lbl}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px h-8 bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── En-têtes colonnes ── */}
      <div className="bg-[#f8f8f8] border-b border-[#f0f0f0] px-4 py-2 grid grid-cols-[1.5rem_1fr_2rem_2rem_2rem_2rem_2.5rem_auto] gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#0A0A0A]/30">
        <span className="text-center">#</span>
        <span>Équipe</span>
        <span className="text-center">J</span>
        <span className="text-center">G</span>
        <span className="text-center hidden sm:block">N</span>
        <span className="text-center hidden sm:block">P</span>
        <span className="text-center font-black text-[#0A0A0A]/50">Pts</span>
        <span className="hidden lg:block text-right">Forme</span>
      </div>

      {/* ── Lignes ── */}
      <div className="divide-y divide-[#f5f5f5]">
        <AnimatePresence>
          {displayed.map((entry, i) => {
            const zone = getZone(entry.position);
            const zc   = ZONE_CONFIG[zone];

            return (
              <motion.div
                key={entry.team}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.025, duration: 0.25 }}
              >
                {/* Séparateurs de zones */}
                {entry.position === 3  && <ZoneSeparator label="Barrage promotion" dotColor="bg-blue-400"  lineColor="border-blue-300" />}
                {entry.position === 4  && <ZoneSeparator label="Zone de maintien"  dotColor="bg-gray-300"  lineColor="border-gray-200"  dim />}
                {entry.position === 16 && <ZoneSeparator label="Zone de relégation"dotColor="bg-red-400"   lineColor="border-red-300" />}

                <motion.div
                  animate={flashRow === entry.team ? { backgroundColor: ["#ffffff", "#fd00000A", "#ffffff"] } : {}}
                  transition={{ duration: 1.5 }}
                  className={cn(
                    "grid grid-cols-[1.5rem_1fr_2rem_2rem_2rem_2rem_2.5rem_auto] gap-1.5 px-4 py-3 items-center relative transition-colors",
                    entry.isASNL ? "bg-[#fd0000]/[0.04] hover:bg-[#fd0000]/[0.08]" : "hover:bg-[#fafafa]",
                  )}
                >
                  {/* Barre zone colorée */}
                  <div className={cn("absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full", zc.bar)} />

                  {/* # Position */}
                  <span
                    className={cn(
                      "font-black text-sm text-center leading-none tabular-nums",
                      zone === "promotion"  ? "text-green-600" :
                      zone === "playoff"    ? "text-blue-500"  :
                      zone === "relegation" ? "text-red-500"   :
                      entry.isASNL         ? "text-[#fd0000]" : "text-[#0A0A0A]/35",
                    )}
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {entry.position}
                  </span>

                  {/* Équipe */}
                  <div className="flex items-center gap-2 min-w-0">
                    {entry.isASNL ? (
                      /* Logo ASNL réel */
                      <div className="w-6 h-6 rounded-full bg-white border border-[#fd0000]/20 flex items-center justify-center shrink-0 overflow-hidden p-0.5 shadow-sm">
                        <div className="relative w-full h-full">
                          <Image src="/logo.jpeg" alt="ASNL" fill className="object-contain" sizes="24px" />
                        </div>
                      </div>
                    ) : entry.logo ? (
                      /* Logo API pour les autres équipes */
                      <div className="w-6 h-6 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                        <div className="relative w-full h-full">
                          <Image
                            src={entry.logo}
                            alt={entry.shortName}
                            fill
                            className="object-contain"
                            sizes="24px"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Fallback initiales */
                      <div
                        className="w-6 h-6 rounded-full bg-[#f0f0f0] border border-[#e5e5e5] flex items-center justify-center shrink-0 text-[7px] font-black text-[#0A0A0A]/40"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {entry.shortName.slice(0, 3)}
                      </div>
                    )}

                    <span className={cn(
                      "text-sm truncate",
                      entry.isASNL ? "font-black text-[#fd0000]" : "font-medium text-[#0A0A0A]/80",
                    )}>
                      {entry.team}
                    </span>
                  </div>

                  {/* Stats */}
                  <span className="text-center text-xs text-[#0A0A0A]/40 tabular-nums">{entry.played}</span>
                  <span className="text-center text-xs text-[#0A0A0A]/40 tabular-nums">{entry.won}</span>
                  <span className="text-center text-xs text-[#0A0A0A]/40 tabular-nums hidden sm:block">{entry.drawn}</span>
                  <span className="text-center text-xs text-[#0A0A0A]/40 tabular-nums hidden sm:block">{entry.lost}</span>

                  {/* Points */}
                  <span
                    className={cn(
                      "text-center font-black text-base leading-none tabular-nums",
                      entry.isASNL ? "text-[#fd0000]" : "text-[#0A0A0A]",
                    )}
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {entry.points}
                  </span>

                  {/* Forme — 5 derniers matchs */}
                  <div className="hidden lg:flex items-center gap-0.5 justify-end">
                    {entry.form.slice(-5).map((r, fi) => (
                      <span
                        key={fi}
                        className={cn("w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-black", FORM_STYLE[r])}
                        title={r === "W" ? "Victoire" : r === "D" ? "Nul" : "Défaite"}
                      >
                        {FORM_FR[r]}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Légende ── */}
      <div className="bg-[#f9f9f9] border-t border-[#f0f0f0] px-5 py-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
        {[
          { dot: "bg-green-500",  label: "Montée directe Ligue 1 (1-2)" },
          { dot: "bg-blue-500",   label: "Barrage (3)"                  },
          { dot: "bg-red-500",    label: "Relégation (16-18)"            },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full shrink-0", z.dot)} />
            <span className="text-[10px] text-[#0A0A0A]/35 font-medium">{z.label}</span>
          </div>
        ))}
      </div>

      {/* ── Voir tout / Réduire ── */}
      <div className="border-t border-[#f0f0f0]">
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3.5 text-xs font-bold text-[#fd0000] hover:bg-[#fd0000]/5 transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
        >
          {showAll
            ? <><ArrowUp className="w-3.5 h-3.5" /> Réduire</>
            : <><ArrowDown className="w-3.5 h-3.5" /> Classement complet ({standings.length} équipes)</>
          }
        </button>
      </div>

    </div>
  );
}

// ── Séparateur de zone ─────────────────────────────────────────────────────────
function ZoneSeparator({
  label, dotColor, lineColor, dim,
}: { label: string; dotColor: string; lineColor: string; dim?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 px-4 py-1 bg-[#fafafa]", dim && "opacity-40")}>
      <div className={cn("flex-1 h-px border-t border-dashed", lineColor)} />
      <div className="flex items-center gap-1 shrink-0">
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#0A0A0A]/30">{label}</span>
      </div>
      <div className={cn("flex-1 h-px border-t border-dashed", lineColor)} />
    </div>
  );
}
