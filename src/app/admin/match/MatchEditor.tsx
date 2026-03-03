"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Match } from "@/types";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Calendar } from "lucide-react";

interface Props { initialData: Match; username: string }

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

export default function MatchEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [data, setData] = useState<Match>(initialData);

  function set(field: keyof Match, value: string | boolean | number) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "nextMatch", data }),
    });
    if (!res.ok) throw new Error("Erreur sauvegarde");
    router.refresh();
  }

  return (
    <AdminShell username={username}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Prochain match
            </h1>
            <p className="text-white/40 text-sm mt-1">Modifie toutes les informations du prochain match</p>
          </div>
          <SaveButton onSave={save} />
        </div>

        {/* Aperçu */}
        <div className="bg-[#fd0000] rounded-2xl p-5 mb-6 flex items-center gap-6 flex-wrap">
          <Calendar className="w-8 h-8 text-white/60 shrink-0" />
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wider font-bold">{data.competition}</p>
            <p className="text-white font-black text-2xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {data.homeTeam} — {data.awayTeam}
            </p>
            <p className="text-white/60 text-sm">{data.date} · {data.time} · {data.stadium}</p>
          </div>
          {data.isHighProfile && (
            <span className="ml-auto bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Choc de la saison
            </span>
          )}
        </div>

        <div className="space-y-6">
          {/* Équipes */}
          <div className="bg-[#161616] rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#fd0000] rounded-full inline-block" />
              Équipes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Équipe domicile</label>
                <input className={FIELD} value={data.homeTeam} onChange={(e) => set("homeTeam", e.target.value)} />
              </div>
              <div>
                <label className={LABEL}>Équipe extérieure</label>
                <input className={FIELD} value={data.awayTeam} onChange={(e) => set("awayTeam", e.target.value)} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="isHome"
                checked={data.isHome}
                onChange={(e) => set("isHome", e.target.checked)}
                className="w-4 h-4 accent-[#fd0000]"
              />
              <label htmlFor="isHome" className="text-white/60 text-sm cursor-pointer">Match à domicile (Marcel Picot)</label>
            </div>
          </div>

          {/* Date & Lieu */}
          <div className="bg-[#161616] rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#fd0000] rounded-full inline-block" />
              Date, heure & lieu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={LABEL}>Date</label>
                <input className={FIELD} value={data.date} onChange={(e) => set("date", e.target.value)} placeholder="2025-03-14" />
              </div>
              <div>
                <label className={LABEL}>Heure</label>
                <input className={FIELD} value={data.time} onChange={(e) => set("time", e.target.value)} placeholder="20:00" />
              </div>
              <div>
                <label className={LABEL}>Stade</label>
                <input className={FIELD} value={data.stadium} onChange={(e) => set("stadium", e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <label className={LABEL}>Compétition</label>
              <input className={FIELD} value={data.competition} onChange={(e) => set("competition", e.target.value)} />
            </div>
          </div>

          {/* Billetterie */}
          <div className="bg-[#161616] rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#fd0000] rounded-full inline-block" />
              Billetterie
            </h2>
            <div>
              <label className={LABEL}>URL billetterie externe</label>
              <input
                className={FIELD}
                value={data.ticketingUrl ?? ""}
                onChange={(e) => set("ticketingUrl", e.target.value)}
                placeholder="https://billetterie.asnl.net/..."
              />
              <p className="text-white/30 text-xs mt-2">Ce lien sera utilisé pour le bouton "PRENDRE MA PLACE" sur le site.</p>
            </div>
          </div>

          {/* Marketing */}
          <div className="bg-[#161616] rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#fd0000] rounded-full inline-block" />
              Mise en avant
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isHighProfile"
                checked={!!data.isHighProfile}
                onChange={(e) => set("isHighProfile", e.target.checked)}
                className="w-4 h-4 accent-[#fd0000]"
              />
              <label htmlFor="isHighProfile" className="text-white/60 text-sm cursor-pointer">
                Afficher le badge "Choc de la saison" (urgence marketing)
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <SaveButton onSave={save} />
        </div>
      </div>
    </AdminShell>
  );
}
