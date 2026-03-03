"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Sponsor } from "@/types";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Props { initialData: Sponsor[]; username: string }

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";
const TIERS: Sponsor["tier"][] = ["platinum", "gold", "silver", "official"];
const TIER_LABELS: Record<Sponsor["tier"], string> = { platinum: "Platine", gold: "Or", silver: "Argent", official: "Officiel" };
const TIER_COLORS: Record<Sponsor["tier"], string> = {
  platinum: "text-white bg-white/10",
  gold: "text-yellow-400 bg-yellow-400/10",
  silver: "text-gray-300 bg-gray-400/10",
  official: "text-[#fd0000] bg-[#fd0000]/10",
};

function newSponsor(): Sponsor {
  return {
    id: Date.now().toString(),
    name: "Nouveau partenaire",
    logo: "/images/sponsor-placeholder.png",
    url: "https://",
    tier: "official",
  };
}

export default function SponsorsEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialData);

  useEffect(() => { setSponsors(initialData); }, [initialData]);

  function update(id: string, field: keyof Sponsor, value: string) {
    setSponsors((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  async function remove(id: string) {
    const updated = sponsors.filter((s) => s.id !== id);
    setSponsors(updated);
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "sponsors", data: updated }),
    });
    if (res.ok) router.refresh();
  }

  function add() {
    setSponsors((prev) => [...prev, newSponsor()]);
  }

  async function save() {
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "sponsors", data: sponsors }),
    });
    if (!res.ok) throw new Error();
    router.refresh();
  }

  return (
    <AdminShell username={username}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Partenaires
            </h1>
            <p className="text-white/40 text-sm mt-1">{sponsors.length} partenaire{sponsors.length > 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={add}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
            <SaveButton onSave={save} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-[#161616] rounded-2xl border border-white/5 p-5">
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-white/20 mt-3 shrink-0" />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className={LABEL}>Nom</label>
                    <input className={FIELD} value={sponsor.name} onChange={(e) => update(sponsor.id, "name", e.target.value)} />
                  </div>
                  <div>
                    <label className={LABEL}>Niveau</label>
                    <select className={FIELD} value={sponsor.tier} onChange={(e) => update(sponsor.id, "tier", e.target.value as Sponsor["tier"])}>
                      {TIERS.map((t) => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Logo (URL)</label>
                    <input className={FIELD} value={sponsor.logo} onChange={(e) => update(sponsor.id, "logo", e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <label className={LABEL}>Site web</label>
                    <input className={FIELD} value={sponsor.url} onChange={(e) => update(sponsor.id, "url", e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TIER_COLORS[sponsor.tier]}`}>
                    {TIER_LABELS[sponsor.tier]}
                  </span>
                  <button
                    onClick={() => { if(window.confirm("Supprimer ce partenaire ?")) remove(sponsor.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {sponsors.length === 0 && (
            <div className="text-center py-16 text-white/30">
              Aucun partenaire.
            </div>
          )}
        </div>

        {sponsors.length > 0 && (
          <div className="mt-6 flex justify-end">
            <SaveButton onSave={save} />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
