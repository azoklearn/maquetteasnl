"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminShell from "@/components/admin/AdminShell";
import {
  Plus, Trash2, Save, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle, Loader2,
} from "lucide-react";
import type { Match } from "@/types";

const EMPTY_MATCH: Omit<Match, "id"> = {
  homeTeam: "",
  awayTeam: "",
  date: "",
  time: "20:00",
  competition: "Ligue 2 BKT",
  stadium: "Stade Marcel-Picot",
  isHome: true,
  status: "upcoming",
  ticketingUrl: "",
  isHighProfile: false,
  homeScore: undefined,
  awayScore: undefined,
};

function uid() {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

interface Props { initialData: Match[]; username?: string }

export default function CalendrierEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(initialData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { setMatches(initialData); }, [initialData]);

  function mark() { setDirty(true); setSaved(false); }

  function update(id: string, field: keyof Match, value: unknown) {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
    mark();
  }

  function addMatch() {
    const newMatch: Match = { id: uid(), ...EMPTY_MATCH };
    setMatches((prev) => [newMatch, ...prev]);
    setExpandedId(newMatch.id);
    mark();
  }

  function removeMatch(id: string) {
    setMatches((prev) => prev.filter((m) => m.id !== id));
    setDeleteConfirm(null);
    if (expandedId === id) setExpandedId(null);
    mark();
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "matches", data: matches }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setSaved(true);
      setDirty(false);
      router.refresh();
    } catch {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  const upcoming = matches.filter((m) => m.status === "upcoming");
  const finished  = matches.filter((m) => m.status === "finished");

  return (
    <AdminShell username={username}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1
              className="text-white font-black text-3xl uppercase tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Calendrier
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {upcoming.length} à venir · {finished.length} terminé(s)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {dirty && (
              <span className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Modifications non sauvegardées
              </span>
            )}
            {saved && (
              <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Sauvegardé
              </span>
            )}
            <button
              onClick={addMatch}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all border border-white/10"
            >
              <Plus className="w-4 h-4" />
              Ajouter un match
            </button>
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="flex items-center gap-2 bg-[#fd0000] hover:bg-[#cc0000] disabled:opacity-40 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {matches.map((match) => {
              const isOpen = expandedId === match.id;

              return (
                <motion.div
                  key={match.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden"
                >
                  {/* Ligne résumé (toujours visible) */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
                    onClick={() => setExpandedId(isOpen ? null : match.id)}
                  >
                    {/* Statut */}
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 ${
                      match.status === "upcoming"
                        ? "bg-[#fd0000]/20 text-[#fd0000]"
                        : match.status === "live"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-white/40"
                    }`}>
                      {match.status === "upcoming" ? "À venir" : match.status === "live" ? "Live" : "Terminé"}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">
                        {match.homeTeam || "Domicile"} <span className="text-white/30">vs</span> {match.awayTeam || "Extérieur"}
                        {match.status === "finished" && match.homeScore !== undefined && (
                          <span className="ml-2 text-white/50 font-normal text-xs">({match.homeScore}–{match.awayScore})</span>
                        )}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">
                        {match.date} · {match.time} · {match.competition}
                      </p>
                    </div>

                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
                    }
                  </div>

                  {/* Formulaire déplié */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                          <Field label="Équipe domicile">
                            <input value={match.homeTeam} onChange={(e) => update(match.id, "homeTeam", e.target.value)} className={input} placeholder="AS Nancy Lorraine" />
                          </Field>
                          <Field label="Équipe extérieur">
                            <input value={match.awayTeam} onChange={(e) => update(match.id, "awayTeam", e.target.value)} className={input} placeholder="FC Metz" />
                          </Field>

                          <Field label="Date (YYYY-MM-DD)">
                            <input type="date" value={match.date} onChange={(e) => update(match.id, "date", e.target.value)} className={input} />
                          </Field>
                          <Field label="Heure">
                            <input type="time" value={match.time} onChange={(e) => update(match.id, "time", e.target.value)} className={input} />
                          </Field>

                          <Field label="Compétition">
                            <input value={match.competition} onChange={(e) => update(match.id, "competition", e.target.value)} className={input} placeholder="Ligue 2 BKT" />
                          </Field>
                          <Field label="Stade">
                            <input value={match.stadium} onChange={(e) => update(match.id, "stadium", e.target.value)} className={input} placeholder="Stade Marcel-Picot" />
                          </Field>

                          <Field label="Statut">
                            <select value={match.status} onChange={(e) => update(match.id, "status", e.target.value as Match["status"])} className={input}>
                              <option value="upcoming">À venir</option>
                              <option value="live">En direct</option>
                              <option value="finished">Terminé</option>
                            </select>
                          </Field>

                          <Field label="Domicile / Extérieur">
                            <select value={match.isHome ? "home" : "away"} onChange={(e) => update(match.id, "isHome", e.target.value === "home")} className={input}>
                              <option value="home">Match à domicile</option>
                              <option value="away">Match à l&apos;extérieur</option>
                            </select>
                          </Field>

                          {match.status === "finished" && (
                            <>
                              <Field label="Score domicile">
                                <input type="number" min={0} value={match.homeScore ?? ""} onChange={(e) => update(match.id, "homeScore", e.target.value === "" ? undefined : Number(e.target.value))} className={input} placeholder="0" />
                              </Field>
                              <Field label="Score extérieur">
                                <input type="number" min={0} value={match.awayScore ?? ""} onChange={(e) => update(match.id, "awayScore", e.target.value === "" ? undefined : Number(e.target.value))} className={input} placeholder="0" />
                              </Field>
                            </>
                          )}

                          <Field label="URL billetterie" className="sm:col-span-2">
                            <input value={match.ticketingUrl ?? ""} onChange={(e) => update(match.id, "ticketingUrl", e.target.value)} className={input} placeholder="https://..." />
                          </Field>

                          <div className="sm:col-span-2 flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!match.isHighProfile}
                                onChange={(e) => update(match.id, "isHighProfile", e.target.checked)}
                                className="w-4 h-4 accent-[#fd0000]"
                              />
                              <span className="text-white/60 text-sm">Choc de la saison (badge)</span>
                            </label>

                            {deleteConfirm === match.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-red-400 text-xs font-semibold">Confirmer ?</span>
                                <button onClick={() => removeMatch(match.id)} className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold px-3 py-1.5 rounded-lg transition-colors">Oui, supprimer</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-xs bg-white/5 hover:bg-white/10 text-white/50 font-bold px-3 py-1.5 rounded-lg transition-colors">Annuler</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(match.id)}
                                className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Supprimer
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {matches.length === 0 && (
            <div className="text-center py-20 text-white/20">
              <p className="text-lg font-semibold">Aucun match</p>
              <p className="text-sm mt-1">Cliquez sur « Ajouter un match » pour commencer.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

// ── Helpers UI ─────────────────────────────────────────────────────────────────
const input =
  "w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#fd0000]/60 transition-colors";

function Field({
  label, children, className = "",
}: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
