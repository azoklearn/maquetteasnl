"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save, Plus, Trash2, AlertCircle, Check, Loader2,
  AlertTriangle, ChevronUp, ChevronDown, Camera,
} from "lucide-react";
import type { StandingEntry } from "@/types";
import { cn } from "@/lib/utils";
import { AdminShell } from "@/components/admin/AdminShell";
import DragImageUpload from "@/components/admin/DragImageUpload";

// ── Helpers ────────────────────────────────────────────────────────────────────

const FORM_COLORS: Record<"W" | "D" | "L", string> = {
  W: "#22c55e",
  D: "#eab308",
  L: "#ef4444",
};
const FORM_FR: Record<"W" | "D" | "L", string> = { W: "V", D: "N", L: "D" };

function emptyEntry(position: number): StandingEntry {
  return {
    position,
    team: "Nouvelle équipe",
    shortName: "NOU",
    logo: undefined,
    played: 0, won: 0, drawn: 0, lost: 0,
    goalsFor: 0, goalsAgainst: 0, goalDiff: 0,
    points: 0,
    form: [],
    isASNL: false,
  };
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

// ── Composant principal ────────────────────────────────────────────────────────

interface Props { initialData: StandingEntry[]; username?: string }

export function StandingsEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [rows, setRowsState] = useState<StandingEntry[]>(initialData);
  const rowsRef = useRef<StandingEntry[]>(initialData);
  const [expanded, setExpanded] = useState<number | null>(null); // position
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  function setRows(val: StandingEntry[] | ((prev: StandingEntry[]) => StandingEntry[])) {
    setRowsState((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      rowsRef.current = next;
      return next;
    });
  }

  function update(position: number, patch: Partial<StandingEntry>) {
    setRows((prev) => prev.map((r) => r.position === position ? { ...r, ...patch } : r));
    setDirty(true);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setRows((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next.map((r, i) => ({ ...r, position: i + 1 }));
    });
    setDirty(true);
  }

  function moveDown(idx: number) {
    setRows((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next.map((r, i) => ({ ...r, position: i + 1 }));
    });
    setDirty(true);
  }

  function add() {
    setRows((prev) => [...prev, emptyEntry(prev.length + 1)]);
    setDirty(true);
  }

  function remove(position: number) {
    setRows((prev) => {
      const next = prev.filter((r) => r.position !== position);
      return next.map((r, i) => ({ ...r, position: i + 1 }));
    });
    setConfirmDel(null);
    setExpanded(null);
    setDirty(true);
  }

  function setForm(position: number, idx: number, val: "W" | "D" | "L") {
    setRows((prev) => prev.map((r) => {
      if (r.position !== position) return r;
      const form = [...r.form] as ("W" | "D" | "L")[];
      form[idx] = val;
      return { ...r, form };
    }));
    setDirty(true);
  }

  function addForm(position: number) {
    setRows((prev) => prev.map((r) =>
      r.position === position && r.form.length < 5
        ? { ...r, form: [...r.form, "W"] as ("W" | "D" | "L")[] }
        : r
    ));
    setDirty(true);
  }

  function removeForm(position: number, idx: number) {
    setRows((prev) => prev.map((r) => {
      if (r.position !== position) return r;
      const form = r.form.filter((_, i) => i !== idx);
      return { ...r, form };
    }));
    setDirty(true);
  }

  async function save() {
    setSaveStatus("saving");
    setSaveError(null);
    try {
      const body = JSON.stringify({ section: "standings", data: rowsRef.current });
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Erreur ${res.status}`);
      }
      setSaveStatus("saved");
      setDirty(false);
      router.refresh();
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setSaveError(msg);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 6000);
    }
  }

  const isSaving = saveStatus === "saving";

  return (
    <AdminShell username={username}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Classement
            </h1>
            <p className="text-white/40 text-sm mt-1">{rows.length} équipe{rows.length > 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {dirty && (
              <span className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Non sauvegardé
              </span>
            )}
            <button
              onClick={add}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all border border-white/10"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className={[
                "flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all",
                saveStatus === "saved"  ? "bg-green-500 text-white" :
                saveStatus === "error"  ? "bg-red-500 text-white" :
                isSaving ? "bg-[#fd0000]/60 text-white cursor-wait" :
                "bg-[#fd0000] hover:bg-[#cc0000] text-white",
              ].join(" ")}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> :
               saveStatus === "saved" ? <Check className="w-4 h-4" /> :
               saveStatus === "error" ? <AlertCircle className="w-4 h-4" /> :
               <Save className="w-4 h-4" />}
              {isSaving ? "Enregistrement…" : saveStatus === "saved" ? "Enregistré !" : saveStatus === "error" ? "Erreur" : "Sauvegarder"}
            </button>
          </div>
        </div>

        {saveError && (
          <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div><p className="font-bold">Échec de la sauvegarde</p><p className="text-xs mt-0.5 font-mono">{saveError}</p></div>
          </div>
        )}


        {/* En-tête tableau */}
        <div className="hidden sm:grid grid-cols-[32px_40px_48px_1fr_48px_48px_48px_48px_48px_48px_56px_80px_32px] gap-2 px-4 py-2 text-white/30 text-[10px] font-bold uppercase tracking-wider border-b border-white/5 mb-1">
          <span></span>
          <span className="text-center">#</span>
          <span></span>
          <span>Équipe</span>
          <span className="text-center">Mj</span>
          <span className="text-center">V</span>
          <span className="text-center">N</span>
          <span className="text-center">D</span>
          <span className="text-center">Bp</span>
          <span className="text-center">Bc</span>
          <span className="text-center">Diff</span>
          <span className="text-center">Pts</span>
          <span></span>
        </div>

        {/* Lignes */}
        <div className="flex flex-col gap-1">
          {rows.map((row, idx) => {
            const isOpen = expanded === row.position;
            const isConfirming = confirmDel === row.position;

            return (
              <div
                key={`${row.position}-${row.team}`}
                className={[
                  "rounded-xl border transition-colors",
                  row.isASNL ? "border-[#fd0000]/40 bg-[#fd0000]/5" : "border-white/5 bg-[#141414]",
                  isOpen ? "border-white/15" : "",
                ].join(" ")}
              >
                {/* Ligne résumé */}
                <div className="hidden sm:grid grid-cols-[32px_40px_48px_1fr_48px_48px_48px_48px_48px_48px_56px_80px_32px] gap-2 items-center px-4 py-3">
                  {/* Flèches réordonnement */}
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveUp(idx)} className="text-white/20 hover:text-white transition-colors p-0.5"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => moveDown(idx)} className="text-white/20 hover:text-white transition-colors p-0.5"><ChevronDown className="w-3 h-3" /></button>
                  </div>

                  {/* Position */}
                  <span className={[
                    "text-center text-sm font-black",
                    row.position <= 2 ? "text-green-400" : row.position === 3 ? "text-blue-400" : row.position >= 16 ? "text-red-400" : "text-white/60",
                  ].join(" ")}>{row.position}</span>

                  {/* Logo — clic pour déplier et uploader */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : row.position)}
                    title="Cliquer pour modifier le logo"
                    className={cn(
                      "relative group w-8 h-8 rounded-full flex items-center justify-center overflow-hidden p-0.5 mx-auto shrink-0",
                      row.logo?.trim() ? "bg-transparent" : "bg-white"
                    )}
                  >
                    {row.logo?.trim() ? (
                      <div className="relative w-full h-full">
                        <Image src={row.logo} alt={row.team} fill className={cn("object-contain", row.team === "Montpellier" && "mix-blend-multiply")} sizes="32px" unoptimized />
                      </div>
                    ) : (
                      <span className="text-[#0A0A0A] text-[8px] font-black group-hover:hidden">{row.shortName.slice(0, 3)}</span>
                    )}
                    <div className={[
                      "absolute inset-0 rounded-full bg-black/60 items-center justify-center transition-opacity",
                      row.logo?.trim() ? "hidden group-hover:flex" : "hidden group-hover:flex",
                    ].join(" ")}>
                      <Camera className="w-3 h-3 text-white" />
                    </div>
                  </button>

                  {/* Nom — cliquable pour déplier */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : row.position)}
                    className="text-left text-white font-semibold text-sm hover:text-[#fd0000] transition-colors truncate"
                  >
                    {row.team}
                    {row.isASNL && <span className="ml-2 text-[10px] text-[#fd0000] font-black uppercase">ASNL</span>}
                  </button>

                  {/* Stats numériques */}
                  {[row.played, row.won, row.drawn, row.lost, row.goalsFor, row.goalsAgainst].map((v, i) => (
                    <input
                      key={i}
                      type="number"
                      value={v}
                      onChange={(e) => {
                        const fields = ["played","won","drawn","lost","goalsFor","goalsAgainst"] as const;
                        const val = parseInt(e.target.value) || 0;
                        const diff = i === 4 ? val - row.goalsAgainst : i === 5 ? row.goalsFor - val : undefined;
                        update(row.position, {
                          [fields[i]]: val,
                          ...(diff !== undefined ? { goalDiff: diff } : {}),
                        });
                      }}
                      className="w-full text-center bg-transparent border border-transparent hover:border-white/10 focus:border-[#fd0000]/60 focus:outline-none rounded-lg text-white text-xs py-1 transition-colors"
                    />
                  ))}

                  {/* Diff */}
                  <span className={["text-center text-xs font-bold", row.goalDiff > 0 ? "text-green-400" : row.goalDiff < 0 ? "text-red-400" : "text-white/40"].join(" ")}>
                    {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                  </span>

                  {/* Points */}
                  <input
                    type="number"
                    value={row.points}
                    onChange={(e) => update(row.position, { points: parseInt(e.target.value) || 0 })}
                    className="w-full text-center bg-transparent border border-transparent hover:border-white/10 focus:border-[#fd0000]/60 focus:outline-none rounded-lg text-[#fd0000] font-black text-sm py-1 transition-colors"
                  />

                  {/* Supprimer */}
                  {isConfirming ? (
                    <div className="flex gap-1">
                      <button onClick={() => remove(row.position)} className="text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/40 px-1.5 py-1 rounded font-bold">Oui</button>
                      <button onClick={() => setConfirmDel(null)} className="text-[10px] bg-white/5 text-white/40 hover:bg-white/10 px-1.5 py-1 rounded font-bold">Non</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDel(row.position)}
                      className="text-white/20 hover:text-red-400 transition-colors p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Version mobile (condensée) */}
                <button
                  className="sm:hidden w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setExpanded(isOpen ? null : row.position)}
                >
                  <span className="text-white/40 text-xs font-black w-5">{row.position}</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black text-white/40">
                    {row.shortName.slice(0, 3)}
                  </div>
                  <span className="flex-1 text-white font-semibold text-sm">{row.team}</span>
                  <span className="text-[#fd0000] font-black text-sm">{row.points} pts</span>
                </button>

                {/* Formulaire déplié */}
                {isOpen && (
                  <div className="px-4 pb-5 pt-1 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Noms */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/40 text-xs font-bold uppercase tracking-wider mb-1.5">Nom complet</label>
                        <input
                          value={row.team}
                          onChange={(e) => update(row.position, { team: e.target.value })}
                          className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#fd0000]/60 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-bold uppercase tracking-wider mb-1.5">Nom court (3 lettres)</label>
                        <input
                          value={row.shortName}
                          maxLength={5}
                          onChange={(e) => update(row.position, { shortName: e.target.value.toUpperCase() })}
                          className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm uppercase focus:outline-none focus:border-[#fd0000]/60 transition-colors"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!row.isASNL}
                          onChange={(e) => update(row.position, { isASNL: e.target.checked })}
                          className="w-4 h-4 accent-[#fd0000]"
                        />
                        <span className="text-white/60 text-sm">C'est l'AS Nancy Lorraine (surlignage rouge)</span>
                      </label>
                    </div>

                    {/* Logo */}
                    <div>
                      <DragImageUpload
                        label="Logo du club"
                        hint="PNG transparent recommandé · 200×200 px · Glissez ou cliquez pour uploader"
                        value={row.logo}
                        onChange={(v) => update(row.position, { logo: v ?? "" })}
                        maxW={200}
                        maxH={200}
                      />
                      {row.logo?.trim() && (
                        <button
                          type="button"
                          onClick={() => update(row.position, { logo: "" })}
                          className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Supprimer le logo
                        </button>
                      )}
                    </div>

                    {/* Forme récente */}
                    <div className="sm:col-span-2">
                      <label className="block text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Forme récente (5 derniers matchs)</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {row.form.map((f, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <select
                              value={f}
                              onChange={(e) => setForm(row.position, i, e.target.value as "W" | "D" | "L")}
                              style={{ background: FORM_COLORS[f], color: "white" }}
                              className="border-none rounded-lg text-xs font-black px-2 py-1.5 cursor-pointer focus:outline-none"
                            >
                              <option value="W">V — Victoire</option>
                              <option value="D">N — Nul</option>
                              <option value="L">D — Défaite</option>
                            </select>
                            <button onClick={() => removeForm(row.position, i)} className="text-white/20 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {row.form.length < 5 && (
                          <button
                            onClick={() => addForm(row.position)}
                            className="flex items-center gap-1 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-2 py-1.5 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Ajouter
                          </button>
                        )}
                        {row.form.length > 0 && (
                          <div className="flex items-center gap-1 ml-3">
                            {row.form.map((f, i) => (
                              <span
                                key={i}
                                className="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center text-white"
                                style={{ background: FORM_COLORS[f] }}
                              >
                                {FORM_FR[f]}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {rows.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <p className="text-lg font-semibold">Aucune équipe</p>
            <p className="text-sm mt-1">Cliquez sur « Ajouter » pour commencer.</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={save}
            disabled={isSaving}
            className={[
              "flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all",
              saveStatus === "saved"  ? "bg-green-500 text-white" :
              saveStatus === "error"  ? "bg-red-500 text-white" :
              isSaving ? "bg-[#fd0000]/60 text-white cursor-wait" :
              "bg-[#fd0000] hover:bg-[#cc0000] text-white",
            ].join(" ")}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Sauvegarder
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
