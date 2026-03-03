"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, EyeOff, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import type { SectionStyle } from "@/lib/db";

// ── Config des sections éditables ──────────────────────────────────────────────

const SECTION_META: { key: SectionKey; label: string; defaultBg: string; defaultText: string }[] = [
  { key: "hero",      label: "Héro (bannière principale)", defaultBg: "#000000", defaultText: "#ffffff" },
  { key: "nextMatch", label: "Prochain match",             defaultBg: "#fd0000", defaultText: "#ffffff" },
  { key: "news",      label: "Actualités",                 defaultBg: "#ffffff", defaultText: "#0A0A0A" },
  { key: "players",   label: "Joueurs",                    defaultBg: "#0A0A0A", defaultText: "#ffffff" },
  { key: "standings", label: "Classement",                 defaultBg: "#ffffff", defaultText: "#0A0A0A" },
  { key: "sponsors",  label: "Partenaires",                defaultBg: "#0A0A0A", defaultText: "#ffffff" },
];

type SectionKey = "hero" | "nextMatch" | "news" | "players" | "standings" | "sponsors";
type SectionsConfig = Record<SectionKey, SectionStyle>;

const TITLE_SIZE_OPTIONS: { value: SectionStyle["titleSize"]; label: string }[] = [
  { value: "sm", label: "Petit" },
  { value: "md", label: "Moyen (défaut)" },
  { value: "lg", label: "Grand" },
  { value: "xl", label: "Très grand" },
];

const EMPTY_STYLE: SectionStyle = {
  title: "",
  subtitle: "",
  bgColor: "",
  textColor: "",
  accentColor: "",
  titleSize: "md",
  visible: true,
};

function buildInitial(data?: Partial<SectionsConfig>): SectionsConfig {
  const result = {} as SectionsConfig;
  for (const { key } of SECTION_META) {
    result[key] = { ...EMPTY_STYLE, visible: true, ...(data?.[key] ?? {}) };
  }
  return result;
}

// ── Composant ColorInput ────────────────────────────────────────────────────────

function ColorInput({
  label,
  value,
  onChange,
  defaultColor,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  defaultColor: string;
}) {
  const displayVal = value || defaultColor;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="color"
          value={displayVal}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 40, height: 40, padding: 2, border: "1px solid #374151",
            borderRadius: 8, cursor: "pointer", background: "transparent",
          }}
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={defaultColor}
          style={{
            flex: 1, padding: "6px 10px", background: "#1f2937", border: "1px solid #374151",
            borderRadius: 6, color: "#f9fafb", fontSize: 13, fontFamily: "monospace",
          }}
        />
        {value && value !== defaultColor && (
          <button
            type="button"
            onClick={() => onChange("")}
            title="Réinitialiser"
            style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: 4 }}
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Panneau d'une section ───────────────────────────────────────────────────────

function SectionPanel({
  meta,
  style,
  onChange,
}: {
  meta: (typeof SECTION_META)[0];
  style: SectionStyle;
  onChange: (patch: Partial<SectionStyle>) => void;
}) {
  const [open, setOpen] = useState(false);
  const visible = style.visible !== false;

  return (
    <div
      style={{
        border: "1px solid #374151",
        borderRadius: 12,
        overflow: "hidden",
        background: open ? "#111827" : "#0f172a",
        transition: "background 0.2s",
      }}
    >
      {/* ── Header cliquable ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", background: "none", border: "none", cursor: "pointer",
          color: "#f9fafb", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Pastille couleur */}
          <div
            style={{
              width: 20, height: 20, borderRadius: 6,
              background: style.bgColor || meta.defaultBg,
              border: "2px solid rgba(255,255,255,0.15)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 15 }}>{meta.label}</span>
          {!visible && (
            <span style={{ fontSize: 11, background: "#374151", color: "#9ca3af", borderRadius: 20, padding: "2px 8px" }}>
              Masquée
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange({ visible: !visible }); }}
            title={visible ? "Masquer cette section" : "Afficher cette section"}
            style={{ background: "none", border: "none", color: visible ? "#10b981" : "#6b7280", cursor: "pointer", padding: 4 }}
          >
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          {open ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
        </div>
      </button>

      {/* ── Corps ── */}
      {open && (
        <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ borderTop: "1px solid #1f2937", marginBottom: 6 }} />

          {/* Titre & Sous-titre */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Titre
              </label>
              <input
                type="text"
                value={style.title ?? ""}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Titre par défaut"
                style={{
                  padding: "8px 12px", background: "#1f2937", border: "1px solid #374151",
                  borderRadius: 6, color: "#f9fafb", fontSize: 14,
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Sous-titre / Eyebrow
              </label>
              <input
                type="text"
                value={style.subtitle ?? ""}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                placeholder="Texte au-dessus du titre"
                style={{
                  padding: "8px 12px", background: "#1f2937", border: "1px solid #374151",
                  borderRadius: 6, color: "#f9fafb", fontSize: 14,
                }}
              />
            </div>
          </div>

          {/* Taille du titre */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Taille du titre
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TITLE_SIZE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ titleSize: value })}
                  style={{
                    padding: "6px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                    border: "1px solid",
                    borderColor: (style.titleSize ?? "md") === value ? "#fd0000" : "#374151",
                    background: (style.titleSize ?? "md") === value ? "#fd000020" : "#1f2937",
                    color: (style.titleSize ?? "md") === value ? "#fd0000" : "#9ca3af",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Couleurs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <ColorInput
              label="Fond"
              value={style.bgColor}
              onChange={(v) => onChange({ bgColor: v })}
              defaultColor={meta.defaultBg}
            />
            <ColorInput
              label="Texte"
              value={style.textColor}
              onChange={(v) => onChange({ textColor: v })}
              defaultColor={meta.defaultText}
            />
            <ColorInput
              label="Accent"
              value={style.accentColor}
              onChange={(v) => onChange({ accentColor: v })}
              defaultColor="#fd0000"
            />
          </div>

          {/* Aperçu */}
          <div
            style={{
              borderRadius: 8, padding: "14px 18px",
              background: style.bgColor || meta.defaultBg,
              color: style.textColor || meta.defaultText,
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", flexDirection: "column", gap: 4,
            }}
          >
            {(style.subtitle) && (
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: style.accentColor || "#fd0000" }}>
                {style.subtitle}
              </span>
            )}
            <span style={{ fontSize: 22, fontWeight: 900, textTransform: "uppercase", fontFamily: "'Bebas Neue', sans-serif" }}>
              {style.title || meta.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Composant principal ─────────────────────────────────────────────────────────

export function SectionsEditor({ initialData, username }: { initialData?: Partial<SectionsConfig>; username?: string }) {
  const router = useRouter();
  const [sections, setSections] = useState<SectionsConfig>(() => buildInitial(initialData));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const sectionsRef = useRef(sections);

  function patchSection(key: SectionKey, patch: Partial<SectionStyle>) {
    setSections((prev) => {
      const next = { ...prev, [key]: { ...prev[key], ...patch } };
      sectionsRef.current = next;
      return next;
    });
    setDirty(true);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/data?type=sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionsRef.current),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      setDirty(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: "24px 0", maxWidth: 800, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f9fafb", margin: 0 }}>
            Sections — Apparence
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Modifiez le titre, le sous-titre, les couleurs et la visibilité de chaque section de la homepage.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {dirty && !saved && (
            <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>● Modifications non sauvegardées</span>
          )}
          {saved && (
            <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>✓ Sauvegardé</span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 22px",
              background: saving ? "#374151" : "#fd0000", color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            <Save size={16} />
            {saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 16px", color: "#fca5a5", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* ── Sections ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SECTION_META.map((meta) => (
          <SectionPanel
            key={meta.key}
            meta={meta}
            style={sections[meta.key]}
            onChange={(patch) => patchSection(meta.key, patch)}
          />
        ))}
      </div>

      {/* ── Note bas ── */}
      <p style={{ fontSize: 12, color: "#4b5563", marginTop: 20, textAlign: "center" }}>
        Les modifications sont appliquées instantanément sur le site après sauvegarde.
      </p>
    </div>
  );
}
