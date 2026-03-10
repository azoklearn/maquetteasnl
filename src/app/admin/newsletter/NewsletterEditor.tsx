"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { NewsletterConfig, NewsletterSubscriber, EmailBlock } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { EmailBlockEditor } from "./EmailBlockEditor";
import { Mail, Palette, Calendar, Users, Copy, Check, FileText, Send, Loader2 } from "lucide-react";

interface Props {
  initialConfig: NewsletterConfig;
  initialSubscribers: NewsletterSubscriber[];
  username: string;
}

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default function NewsletterEditor({ initialConfig, initialSubscribers, username }: Props) {
  const router = useRouter();
  const [config, setConfig] = useState<NewsletterConfig>(initialConfig);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(initialSubscribers);
  const [tab, setTab] = useState<"content" | "appearance" | "schedule" | "email" | "emails">("content");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; sent?: number; error?: string } | null>(null);

  useEffect(() => {
    setConfig(initialConfig);
    setSubscribers(initialSubscribers);
  }, [initialConfig, initialSubscribers]);

  function updateConfig(partial: Partial<NewsletterConfig>) {
    setConfig((prev) => ({ ...prev, ...partial }));
  }

  function updateBenefits(index: number, value: string) {
    const benefits = [...(config.benefits ?? [])];
    benefits[index] = value;
    updateConfig({ benefits });
  }

  function addBenefit() {
    updateConfig({ benefits: [...(config.benefits ?? []), ""] });
  }

  function removeBenefit(index: number) {
    const benefits = (config.benefits ?? []).filter((_, i) => i !== index);
    updateConfig({ benefits });
  }

  async function save() {
    const res = await fetch("/api/admin/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    if (!res.ok) throw new Error();
    router.refresh();
  }

  async function refreshSubscribers() {
    const res = await fetch("/api/admin/newsletter");
    if (res.ok) {
      const data = await res.json();
      setSubscribers(data.subscribers ?? []);
    }
    router.refresh();
  }

  function copyEmails() {
    const emails = subscribers.map((s) => s.email).join("\n");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function sendNewsletter() {
    if (subscribers.length === 0) {
      setSendResult({ ok: false, error: "Aucun abonné" });
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/newsletter/send", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSendResult({ ok: false, error: data?.error ?? "Erreur" });
        return;
      }
      setSendResult({ ok: true, sent: data.sent });
    } catch {
      setSendResult({ ok: false, error: "Erreur de connexion" });
    } finally {
      setSending(false);
    }
  }

  return (
    <AdminShell username={username}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Newsletter
            </h1>
            <p className="text-white/40 text-sm mt-1">{subscribers.length} abonné{subscribers.length > 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={sendNewsletter}
              disabled={sending || subscribers.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Envoi..." : "Envoyer la newsletter"}
            </button>
            <SaveButton onSave={save} />
          </div>
        </div>
        {sendResult && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
              sendResult.ok ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {sendResult.ok
              ? `✓ Newsletter envoyée à ${sendResult.sent} abonné${(sendResult.sent ?? 0) > 1 ? "s" : ""}`
              : `✕ ${sendResult.error}`}
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "content" as const, label: "Contenu", icon: Mail },
            { key: "appearance" as const, label: "Aspect", icon: Palette },
            { key: "schedule" as const, label: "Envoi", icon: Calendar },
            { key: "email" as const, label: "Modèle email", icon: FileText },
            { key: "emails" as const, label: "Abonnés", icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === key ? "bg-[#fd0000] text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {tab === "content" && (
          <div className="space-y-6">
            <div>
              <label className={LABEL}>Sous-titre (eyebrow)</label>
              <input className={FIELD} value={config.subtitle ?? ""} onChange={(e) => updateConfig({ subtitle: e.target.value })} placeholder="Newsletter officielle" />
            </div>
            <div>
              <label className={LABEL}>Titre principal</label>
              <input className={FIELD} value={config.title ?? ""} onChange={(e) => updateConfig({ title: e.target.value })} placeholder="Rejoignez la famille ASNL" />
              <p className="text-white/30 text-xs mt-1">Utilisez \n pour un saut de ligne</p>
            </div>
            <div>
              <label className={LABEL}>Description</label>
              <textarea className={FIELD + " resize-none"} rows={3} value={config.description ?? ""} onChange={(e) => updateConfig({ description: e.target.value })} placeholder="Résultats en direct, avant-premières..." />
            </div>
            <div>
              <label className={LABEL}>Titre formulaire</label>
              <input className={FIELD} value={config.formTitle ?? ""} onChange={(e) => updateConfig({ formTitle: e.target.value })} placeholder="S'abonner gratuitement" />
            </div>
            <div>
              <label className={LABEL}>Sous-titre formulaire</label>
              <input className={FIELD} value={config.formSubtitle ?? ""} onChange={(e) => updateConfig({ formSubtitle: e.target.value })} placeholder="Pas de spam. Désabonnement en un clic." />
            </div>
            <div>
              <label className={LABEL}>Message succès</label>
              <input className={FIELD} value={config.successTitle ?? ""} onChange={(e) => updateConfig({ successTitle: e.target.value })} placeholder="Bienvenue dans la famille !" />
            </div>
            <div>
              <label className={LABEL}>Avantages (liste)</label>
              {(config.benefits ?? []).map((b, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={FIELD} value={b} onChange={(e) => updateBenefits(i, e.target.value)} placeholder="Ex: Résultats en direct" />
                  <button type="button" onClick={() => removeBenefit(i)} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 shrink-0">
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={addBenefit} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                + Ajouter
              </button>
            </div>
          </div>
        )}

        {/* Aspect */}
        {tab === "appearance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={LABEL}>Couleur fond</label>
                <div className="flex gap-2">
                  <input type="color" value={config.bgColor ?? "#fd0000"} onChange={(e) => updateConfig({ bgColor: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border border-white/10" />
                  <input className={FIELD} value={config.bgColor ?? "#fd0000"} onChange={(e) => updateConfig({ bgColor: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Couleur accent</label>
                <div className="flex gap-2">
                  <input type="color" value={config.accentColor ?? "#fd0000"} onChange={(e) => updateConfig({ accentColor: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border border-white/10" />
                  <input className={FIELD} value={config.accentColor ?? "#fd0000"} onChange={(e) => updateConfig({ accentColor: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Couleur texte</label>
                <div className="flex gap-2">
                  <input type="color" value={config.textColor ?? "#ffffff"} onChange={(e) => updateConfig({ textColor: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border border-white/10" />
                  <input className={FIELD} value={config.textColor ?? "#ffffff"} onChange={(e) => updateConfig({ textColor: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modèle email (contenu du mail envoyé) */}
        {tab === "email" && (
          <div className="space-y-6">
            <div>
              <label className={LABEL}>Sujet du mail</label>
              <input
                className={FIELD}
                value={config.emailSubject ?? ""}
                onChange={(e) => updateConfig({ emailSubject: e.target.value })}
                placeholder="Newsletter ASNL — Actualités du club"
              />
            </div>
            <EmailBlockEditor
              blocks={config.emailBlocks ?? []}
              onChange={(blocks: EmailBlock[]) => updateConfig({ emailBlocks: blocks })}
              accentColor={config.accentColor ?? "#fd0000"}
            />
          </div>
        )}

        {/* Planning envoi */}
        {tab === "schedule" && (
          <div className="space-y-6">
            <div>
              <label className={LABEL}>Jour d'envoi</label>
              <select className={FIELD} value={config.sendDay ?? 1} onChange={(e) => updateConfig({ sendDay: parseInt(e.target.value, 10) })}>
                {DAYS.map((day, i) => (
                  <option key={i} value={i}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Heure d'envoi</label>
              <input type="time" className={FIELD} value={config.sendTime ?? "10:00"} onChange={(e) => updateConfig({ sendTime: e.target.value })} />
            </div>
            <p className="text-white/40 text-sm">
              L&apos;envoi manuel se fait via le bouton « Envoyer la newsletter » ci-dessus. Pour un envoi automatique selon ce planning, configurez un cron (Vercel Cron, QStash, etc.).
            </p>
          </div>
        )}

        {/* Liste emails */}
        {tab === "emails" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-white/60 text-sm">{subscribers.length} adresse{subscribers.length > 1 ? "s" : ""} enregistrée{subscribers.length > 1 ? "s" : ""}</p>
              <div className="flex gap-2">
                <button onClick={refreshSubscribers} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                  Actualiser
                </button>
                <button onClick={copyEmails} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copié !" : "Copier tout"}
                </button>
              </div>
            </div>
            <div className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden max-h-96 overflow-y-auto">
              {subscribers.length === 0 ? (
                <p className="p-8 text-center text-white/40">Aucun abonné pour le moment.</p>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-[#161616] border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 text-white/50 text-xs font-bold uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-white/50 text-xs font-bold uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-white font-medium">{s.email}</td>
                        <td className="px-4 py-3 text-white/40 text-sm">
                          {new Date(s.subscribedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <SaveButton onSave={save} />
        </div>
      </div>
    </AdminShell>
  );
}
