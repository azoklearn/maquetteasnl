"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { HistoryConfig, HistoryEvent } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  initialConfig: HistoryConfig;
  username: string;
}

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

export default function HistoireEditor({ initialConfig, username }: Props) {
  const router = useRouter();
  const [config, setConfig] = useState<HistoryConfig>(initialConfig);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  function update(partial: Partial<HistoryConfig>) {
    setConfig((prev) => ({ ...prev, ...partial }));
  }

  function updateEvent(index: number, partial: Partial<HistoryEvent>) {
    const timeline = [...(config.timeline ?? [])];
    timeline[index] = { ...timeline[index], ...partial };
    update({ timeline });
  }

  function addEvent() {
    const next: HistoryEvent = {
      year: "2026",
      title: "Nouvelle entrée",
      desc: "Description à compléter.",
      trophy: false,
    };
    update({ timeline: [...(config.timeline ?? []), next] });
  }

  function removeEvent(idx: number) {
    update({ timeline: (config.timeline ?? []).filter((_, i) => i !== idx) });
  }

  async function save() {
    const res = await fetch("/api/admin/histoire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    if (!res.ok) throw new Error();
    router.refresh();
  }

  const timeline = config.timeline ?? [];

  return (
    <AdminShell username={username}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1
              className="text-white font-black text-3xl uppercase tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Histoire du club
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Modifier le visuel et la frise chronologique de la page histoire.
            </p>
          </div>
          <SaveButton onSave={save} />
        </div>

        {/* Hero */}
        <div className="space-y-6 mb-10">
          <div>
            <label className={LABEL}>Sous-titre du hero</label>
            <input
              className={FIELD}
              value={config.heroSubtitle ?? ""}
              onChange={(e) => update({ heroSubtitle: e.target.value })}
              placeholder="Depuis 1967"
            />
          </div>
          <div>
            <label className={LABEL}>Image de fond du hero (URL)</label>
            <input
              className={FIELD}
              value={config.heroImage ?? ""}
              onChange={(e) => update({ heroImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-white/30 text-xs mt-1">
              Utilisez une image large (format paysage) pour le bandeau en haut de page.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-black text-xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Frise chronologique
          </h2>
          <button
            type="button"
            onClick={addEvent}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter une entrée
          </button>
        </div>

        {timeline.length === 0 ? (
          <p className="text-white/40 text-sm mb-8">Aucune entrée. Ajoutez une première date pour commencer la frise.</p>
        ) : (
          <div className="space-y-4 mb-8">
            {timeline.map((event, idx) => (
              <div key={idx} className="bg-[#161616] rounded-2xl border border-white/5 px-4 py-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      className={`${FIELD} w-24`}
                      value={event.year}
                      onChange={(e) => updateEvent(idx, { year: e.target.value })}
                      placeholder="Année"
                    />
                    <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!event.trophy}
                        onChange={(e) => updateEvent(idx, { trophy: e.target.checked })}
                        className="w-4 h-4 accent-[#fd0000]"
                      />
                      <span>Entrée marquée comme titre (trophée)</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvent(idx)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className={LABEL}>Titre</label>
                  <input
                    className={FIELD}
                    value={event.title}
                    onChange={(e) => updateEvent(idx, { title: e.target.value })}
                    placeholder="Ex: Coupe de France"
                  />
                </div>
                <div>
                  <label className={LABEL}>Description</label>
                  <textarea
                    className={`${FIELD} resize-none`}
                    rows={3}
                    value={event.desc}
                    onChange={(e) => updateEvent(idx, { desc: e.target.value })}
                    placeholder="Texte de description pour cette date clé."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <SaveButton onSave={save} />
      </div>
    </AdminShell>
  );
}

