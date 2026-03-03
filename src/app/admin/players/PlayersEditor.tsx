"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Player } from "@/types";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Plus, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import DragImageUpload from "@/components/admin/DragImageUpload";

interface Props { initialData: Player[]; username: string }

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";
const POSITIONS: Player["position"][] = ["GK", "DEF", "MID", "ATT"];
const POS_LABELS: Record<Player["position"], string> = { GK: "Gardien", DEF: "Défenseur", MID: "Milieu", ATT: "Attaquant" };
const POS_COLORS: Record<Player["position"], string> = { GK: "text-yellow-400", DEF: "text-blue-400", MID: "text-green-400", ATT: "text-red-400" };

function newPlayer(): Player {
  const id = Date.now().toString();
  return {
    id,
    name: "Nouveau joueur",
    firstName: "Prénom",
    number: 99,
    position: "MID",
    nationality: "France",
    photo: undefined,
    stats: { appearances: 0, goals: 0, assists: 0 },
  };
}

export default function PlayersEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>(initialData);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Resynchronise quand les données serveur changent (après router.refresh)
  useEffect(() => {
    setPlayers(initialData);
    setDirty(false);
  }, [initialData]);

  function update(id: string, field: keyof Player, value: unknown) {
    setPlayers((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
    setDirty(true);
  }

  function updateStat(id: string, stat: keyof Player["stats"], value: number) {
    setPlayers((prev) =>
      prev.map((p) => p.id === id ? { ...p, stats: { ...p.stats, [stat]: value } } : p)
    );
    setDirty(true);
  }

  async function remove(id: string) {
    const updated = players.filter((p) => p.id !== id);
    setPlayers(updated);
    setConfirmDelete(null);
    setExpanded(null);
    // Auto-save immédiatement après suppression
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "players", data: updated }),
    });
    if (res.ok) {
      setDirty(false);
      router.refresh();
    }
  }

  function add() {
    const p = newPlayer();
    setPlayers((prev) => [...prev, p]);
    setExpanded(p.id);
    setDirty(true);
  }

  async function save() {
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "players", data: players }),
    });
    if (!res.ok) throw new Error();
    setDirty(false);
    router.refresh();
  }

  const grouped = POSITIONS.map((pos) => ({
    pos,
    label: POS_LABELS[pos],
    players: players.filter((p) => p.position === pos),
  }));

  return (
    <AdminShell username={username}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Effectif
            </h1>
            <p className="text-white/40 text-sm mt-1">{players.length} joueur{players.length > 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            {dirty && (
              <span className="text-yellow-400 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
                Modifications non sauvegardées
              </span>
            )}
            <button
              onClick={add}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
            <SaveButton onSave={save} />
          </div>
        </div>

        {grouped.map(({ pos, label, players: group }) => (
          <div key={pos} className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-widest mb-3 ${POS_COLORS[pos]}`}>{label}s ({group.length})</h2>
            <div className="flex flex-col gap-2">
              {group.map((player) => {
                const open = expanded === player.id;
                const confirming = confirmDelete === player.id;

                return (
                  <div key={player.id} className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex items-center gap-4 px-5 py-4">
                      <span className="text-white/20 font-black text-lg w-8 shrink-0 text-center">
                        {player.number}
                      </span>

                      {/* Infos — cliquable pour ouvrir */}
                      <button
                        className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                        onClick={() => { setExpanded(open ? null : player.id); setConfirmDelete(null); }}
                      >
                        <p className="text-white font-semibold text-sm">{player.firstName} <span className="font-black uppercase">{player.name}</span></p>
                        <p className="text-white/30 text-xs">{player.nationality} · {POS_LABELS[player.position]}</p>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex gap-3 text-white/30 text-xs">
                          <span>{player.stats.appearances} app.</span>
                          <span>{player.stats.goals} buts</span>
                          <span>{player.stats.assists} pass.</span>
                        </div>

                        {/* Suppression avec confirmation inline */}
                        {confirming ? (
                          <div className="flex items-center gap-2">
                            <span className="text-red-400 text-xs font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Supprimer ?
                            </span>
                            <button
                              onClick={() => remove(player.id)}
                              className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Oui
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Non
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(player.id); }}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => { setExpanded(open ? null : player.id); setConfirmDelete(null); }}
                          className="p-1 text-white/40"
                        >
                          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {open && (
                      <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <label className={LABEL}>Prénom</label>
                            <input className={FIELD} value={player.firstName} onChange={(e) => update(player.id, "firstName", e.target.value)} />
                          </div>
                          <div>
                            <label className={LABEL}>Nom</label>
                            <input className={FIELD} value={player.name} onChange={(e) => update(player.id, "name", e.target.value)} />
                          </div>
                          <div>
                            <label className={LABEL}>Numéro</label>
                            <input type="number" className={FIELD} value={player.number} onChange={(e) => update(player.id, "number", parseInt(e.target.value) || 0)} />
                          </div>
                          <div>
                            <label className={LABEL}>Poste</label>
                            <select className={FIELD} value={player.position} onChange={(e) => update(player.id, "position", e.target.value as Player["position"])}>
                              {POSITIONS.map((p) => <option key={p} value={p}>{POS_LABELS[p]}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={LABEL}>Nationalité</label>
                          <input className={FIELD} value={player.nationality} onChange={(e) => update(player.id, "nationality", e.target.value)} />
                        </div>

                        {/* Photos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                          <DragImageUpload
                            label="Photo principale"
                            hint="Affichée par défaut sur la carte"
                            value={player.photo}
                            onChange={(v) => update(player.id, "photo", v)}
                          />
                          <DragImageUpload
                            label="Photo au survol"
                            hint="Affichée au hover (ex. action, célébration)"
                            value={player.photoHover}
                            onChange={(v) => update(player.id, "photoHover", v)}
                          />
                        </div>

                        <div>
                          <p className={LABEL}>Statistiques saison</p>
                          <div className="grid grid-cols-3 gap-4">
                            {(["appearances", "goals", "assists"] as const).map((stat) => (
                              <div key={stat}>
                                <label className="text-white/30 text-xs block mb-1">{stat === "appearances" ? "Matchs" : stat === "goals" ? "Buts" : "Passes D."}</label>
                                <input
                                  type="number"
                                  className={FIELD}
                                  value={player.stats[stat]}
                                  onChange={(e) => updateStat(player.id, stat, parseInt(e.target.value) || 0)}
                                  min={0}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Save inline */}
                        <div className="pt-2 flex justify-end">
                          <SaveButton onSave={save} label="Enregistrer les modifications" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {group.length === 0 && (
                <p className="text-white/20 text-sm px-2">Aucun joueur dans cette catégorie.</p>
              )}
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-end">
          <SaveButton onSave={save} />
        </div>
      </div>
    </AdminShell>
  );
}
