"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteConfig } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Plus, Trash2 } from "lucide-react";

interface Props { initialData: SiteConfig; username: string }

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#C8102E] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#161616] rounded-2xl p-6 border border-white/5">
      <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#C8102E] rounded-full inline-block" />
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function ConfigEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig>(initialData);

  function set<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function setSocial(key: keyof SiteConfig["social"], value: string) {
    setConfig((prev) => ({ ...prev, social: { ...prev.social, [key]: value } }));
  }

  function setTicker(i: number, value: string) {
    setConfig((prev) => {
      const msgs = [...prev.tickerMessages];
      msgs[i] = value;
      return { ...prev, tickerMessages: msgs };
    });
  }

  function addTicker() {
    setConfig((prev) => ({ ...prev, tickerMessages: [...prev.tickerMessages, ""] }));
  }

  function removeTicker(i: number) {
    setConfig((prev) => ({
      ...prev,
      tickerMessages: prev.tickerMessages.filter((_, idx) => idx !== i),
    }));
  }

  async function save() {
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "config", data: config }),
    });
    if (!res.ok) throw new Error();
    router.refresh();
  }

  return (
    <AdminShell username={username}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Configuration
            </h1>
            <p className="text-white/40 text-sm mt-1">Paramètres généraux du site</p>
          </div>
          <SaveButton onSave={save} />
        </div>

        <div className="space-y-6">
          {/* Hero */}
          <Section title="Page d'accueil — Hero">
            <div className="space-y-4">
              <div>
                <label className={LABEL}>Saison (ex: Saison 2025 – 2026)</label>
                <input className={FIELD} value={config.heroSeason ?? ""} onChange={(e) => set("heroSeason", e.target.value)} placeholder="Saison 2025 – 2026" />
              </div>
              <div>
                <label className={LABEL}>Sous-titre / Slogan</label>
                <input className={FIELD} value={config.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
              </div>
            </div>
          </Section>

          {/* Ticker */}
          <Section title="Bandeau défilant (ticker)">
            <div className="space-y-3 mb-4">
              {config.tickerMessages.map((msg, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={FIELD}
                    value={msg}
                    onChange={(e) => setTicker(i, e.target.value)}
                    placeholder="⚽ Message du ticker..."
                  />
                  <button
                    onClick={() => removeTicker(i)}
                    className="p-3 rounded-xl hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addTicker}
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Ajouter un message
            </button>
          </Section>

          {/* Billetterie */}
          <Section title="URLs Billetterie">
            <div className="space-y-4">
              <div>
                <label className={LABEL}>Lien prochain match</label>
                <input className={FIELD} value={config.ticketingUrl} onChange={(e) => set("ticketingUrl", e.target.value)} placeholder="https://billetterie.asnl.net/..." />
              </div>
              <div>
                <label className={LABEL}>Abonnement saison</label>
                <input className={FIELD} value={config.seasonTicketUrl} onChange={(e) => set("seasonTicketUrl", e.target.value)} placeholder="https://billetterie.asnl.net/abonnement" />
              </div>
              <div>
                <label className={LABEL}>Groupes / CE</label>
                <input className={FIELD} value={config.groupUrl} onChange={(e) => set("groupUrl", e.target.value)} placeholder="https://billetterie.asnl.net/groupes" />
              </div>
            </div>
          </Section>

          {/* Réseaux sociaux */}
          <Section title="Réseaux sociaux">
            {(["twitter", "instagram", "facebook", "youtube"] as const).map((network) => (
              <div key={network} className="mb-4">
                <label className={LABEL}>{network.charAt(0).toUpperCase() + network.slice(1)}</label>
                <input
                  className={FIELD}
                  value={config.social[network]}
                  onChange={(e) => setSocial(network, e.target.value)}
                  placeholder={`https://${network}.com/asnl`}
                />
              </div>
            ))}
          </Section>
        </div>

        <div className="mt-8 flex justify-end">
          <SaveButton onSave={save} />
        </div>
      </div>
    </AdminShell>
  );
}
