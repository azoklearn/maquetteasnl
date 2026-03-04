"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, EyeOff, ChevronDown, ChevronUp, RotateCcw, Image as ImageIcon, Video, Trash2 } from "lucide-react";
import type { SectionStyle, HeroBg } from "@/lib/db";
import DragImageUpload from "@/components/admin/DragImageUpload";

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

// ── Presets voile dégradé ───────────────────────────────────────────────────────

const OVERLAY_PRESETS: {
  label: string;
  topColor: string;
  topOpacity: number;
  bottomColor: string;
  bottomOpacity: number;
  direction: number;
}[] = [
  { label: "Noir → Rouge", topColor: "#000000", topOpacity: 50, bottomColor: "#c8102e", bottomOpacity: 85, direction: 180 },
  { label: "Sombre uniforme", topColor: "#000000", topOpacity: 70, bottomColor: "#000000", bottomOpacity: 90, direction: 180 },
  { label: "Rouge dominant", topColor: "#c8102e", topOpacity: 60, bottomColor: "#8b0000", bottomOpacity: 95, direction: 180 },
  { label: "Transparent → Rouge", topColor: "#000000", topOpacity: 20, bottomColor: "#c8102e", bottomOpacity: 90, direction: 180 },
  { label: "Gauche → Droite", topColor: "#000000", topOpacity: 50, bottomColor: "#c8102e", bottomOpacity: 85, direction: 90 },
  { label: "Diagonal", topColor: "#000000", topOpacity: 40, bottomColor: "#c8102e", bottomOpacity: 80, direction: 135 },
];

function OverlayEditor({
  style,
  onChange,
}: {
  style: SectionStyle;
  onChange: (p: Partial<SectionStyle>) => void;
}) {
  const topColor = style.overlayTopColor ?? "#000000";
  const topOpacity = style.overlayTopOpacity ?? 50;
  const bottomColor = style.overlayBottomColor ?? "#c8102e";
  const bottomOpacity = style.overlayBottomOpacity ?? 85;
  const direction = style.overlayDirection ?? 180;

  const setOverlay = (p: Partial<SectionStyle>) => onChange({ ...p });

  const gradientRgba = (hex: string, a: number) => {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return `rgba(0,0,0,${a / 100})`;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a / 100})`;
  };
  const previewGradient = `linear-gradient(${direction}deg, ${gradientRgba(topColor, topOpacity)} 0%, ${gradientRgba(bottomColor, bottomOpacity)} 100%)`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Voile dégradé sur l&apos;image
      </label>

      {/* Presets visuels */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {OVERLAY_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setOverlay({
              overlayTopColor: preset.topColor,
              overlayTopOpacity: preset.topOpacity,
              overlayBottomColor: preset.bottomColor,
              overlayBottomOpacity: preset.bottomOpacity,
              overlayDirection: preset.direction,
            })}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
              borderRadius: 8, border: "1px solid #374151", background: "#1f2937",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#fd0000";
              e.currentTarget.style.background = "#1f2937";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#374151";
              e.currentTarget.style.background = "#1f2937";
            }}
          >
            <div
              style={{
                width: 32, height: 24, borderRadius: 4, overflow: "hidden",
                background: `linear-gradient(${preset.direction}deg, ${gradientRgba(preset.topColor, preset.topOpacity)} 0%, ${gradientRgba(preset.bottomColor, preset.bottomOpacity)} 100%)`,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
            <span style={{ fontSize: 12, color: "#fff" }}>{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Aperçu du dégradé actuel */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11, color: "#6b7280" }}>Aperçu :</span>
        <div
          style={{
            flex: 1, height: 28, borderRadius: 6, background: previewGradient,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        />
      </div>

      {/* Direction */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Direction
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { deg: 180, label: "Haut → Bas" },
            { deg: 0, label: "Bas → Haut" },
            { deg: 90, label: "Gauche → Droite" },
            { deg: 270, label: "Droite → Gauche" },
            { deg: 135, label: "Diagonal ↘" },
            { deg: 45, label: "Diagonal ↗" },
          ].map(({ deg, label }) => (
            <button
              key={deg}
              type="button"
              onClick={() => setOverlay({ overlayDirection: deg })}
              style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                border: direction === deg ? "1px solid #fd0000" : "1px solid #374151",
                background: direction === deg ? "#fd000020" : "#1f2937",
                color: direction === deg ? "#fd0000" : "#9ca3af",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Couleurs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, display: "block" }}>
            Couleur haut
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="color"
              value={topColor}
              onChange={(e) => setOverlay({ overlayTopColor: e.target.value })}
              style={{ width: 36, height: 36, padding: 2, border: "1px solid #374151", borderRadius: 8, cursor: "pointer", background: "transparent" }}
            />
            <input
              type="text"
              value={topColor}
              onChange={(e) => setOverlay({ overlayTopColor: e.target.value })}
              style={{ flex: 1, padding: "6px 10px", background: "#1f2937", border: "1px solid #374151", borderRadius: 6, color: "#f9fafb", fontSize: 13, fontFamily: "monospace" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#6b7280" }}>Opacité</span>
            <input
              type="range"
              min={0}
              max={100}
              value={topOpacity}
              onChange={(e) => setOverlay({ overlayTopOpacity: parseInt(e.target.value, 10) })}
              style={{ flex: 1, accentColor: "#fd0000" }}
            />
            <span style={{ fontSize: 12, color: "#9ca3af", minWidth: 28 }}>{topOpacity}%</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, display: "block" }}>
            Couleur bas
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="color"
              value={bottomColor}
              onChange={(e) => setOverlay({ overlayBottomColor: e.target.value })}
              style={{ width: 36, height: 36, padding: 2, border: "1px solid #374151", borderRadius: 8, cursor: "pointer", background: "transparent" }}
            />
            <input
              type="text"
              value={bottomColor}
              onChange={(e) => setOverlay({ overlayBottomColor: e.target.value })}
              style={{ flex: 1, padding: "6px 10px", background: "#1f2937", border: "1px solid #374151", borderRadius: 6, color: "#f9fafb", fontSize: 13, fontFamily: "monospace" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#6b7280" }}>Opacité</span>
            <input
              type="range"
              min={0}
              max={100}
              value={bottomOpacity}
              onChange={(e) => setOverlay({ overlayBottomOpacity: parseInt(e.target.value, 10) })}
              style={{ flex: 1, accentColor: "#fd0000" }}
            />
            <span style={{ fontSize: 12, color: "#9ca3af", minWidth: 28 }}>{bottomOpacity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
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
                {meta.key === "hero" ? "Saison (texte eyebrow)" : "Titre"}
              </label>
              <input
                type="text"
                value={style.title ?? ""}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder={meta.key === "hero" ? "ex: Saison 2025 – 2026" : "Titre par défaut"}
                style={{
                  padding: "8px 12px", background: "#1f2937", border: "1px solid #374151",
                  borderRadius: 6, color: "#f9fafb", fontSize: 14,
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {meta.key === "hero" ? "Slogan / Sous-titre" : "Sous-titre"}
              </label>
              <input
                type="text"
                value={style.subtitle ?? ""}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                placeholder={meta.key === "hero" ? "ex: Fondé en 1913. Fier. Lorrain." : "Texte au-dessus du titre"}
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

          {/* Image de fond Prochain match (utilisée aussi dans le hero) */}
          {meta.key === "nextMatch" && (
            <>
              <DragImageUpload
                label="Image de fond section Prochain match"
                hint="Utilisée dans le hero et la section dédiée · 1280×720 recommandé"
                value={style.bgImage}
                onChange={(v) => onChange({ bgImage: v ?? "" })}
                maxW={1280}
                maxH={720}
              />
              <OverlayEditor style={style} onChange={onChange} />
            </>
          )}

          {/* Stats Hero (uniquement pour la section Hero) */}
          {meta.key === "hero" && (() => {
            const stats: { value: string; label: string }[] = style.stats?.length
              ? style.stats
              : [
                  { value: "2ème", label: "au classement" },
                  { value: "48",   label: "points" },
                  { value: "+18",  label: "diff. buts" },
                ];
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Statistiques affichées (côté droit du hero)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {stats.map((s, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 6, alignItems: "center" }}>
                      <input
                        type="text"
                        value={s.value}
                        placeholder="ex: 2ème"
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[i] = { ...updated[i], value: e.target.value };
                          onChange({ stats: updated });
                        }}
                        style={{ padding: "6px 10px", background: "#1f2937", border: "1px solid #374151", borderRadius: 6, color: "#f9fafb", fontSize: 14, fontWeight: 700 }}
                      />
                      <input
                        type="text"
                        value={s.label}
                        placeholder="ex: au classement"
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[i] = { ...updated[i], label: e.target.value };
                          onChange({ stats: updated });
                        }}
                        style={{ padding: "6px 10px", background: "#1f2937", border: "1px solid #374151", borderRadius: 6, color: "#9ca3af", fontSize: 13 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = stats.filter((_, idx) => idx !== i);
                          onChange({ stats: updated });
                        }}
                        style={{ background: "#7f1d1d", border: "none", borderRadius: 6, color: "#fca5a5", cursor: "pointer", padding: "6px 10px", fontSize: 12 }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {stats.length < 5 && (
                    <button
                      type="button"
                      onClick={() => onChange({ stats: [...stats, { value: "", label: "" }] })}
                      style={{ padding: "6px 12px", background: "#1f2937", border: "1px dashed #374151", borderRadius: 6, color: "#6b7280", cursor: "pointer", fontSize: 12, textAlign: "left" }}
                    >
                      + Ajouter une stat
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Aperçu */}
          {(() => {
            const PREVIEW_SIZES: Record<string, number> = { sm: 18, md: 26, lg: 34, xl: 44 };
            const previewFontSize = PREVIEW_SIZES[style.titleSize ?? "md"] ?? 26;
            return (
              <div
                style={{
                  borderRadius: 8, padding: "14px 18px",
                  background: style.bgColor?.trim() || meta.defaultBg,
                  color: style.textColor?.trim() || meta.defaultText,
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", flexDirection: "column", gap: 4,
                  transition: "all 0.2s",
                }}
              >
                {style.subtitle?.trim() && (
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: style.accentColor?.trim() || "#fd0000" }}>
                    {style.subtitle}
                  </span>
                )}
                <span style={{
                  fontSize: previewFontSize,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  fontFamily: "'Bebas Neue', sans-serif",
                  color: style.textColor?.trim() || meta.defaultText,
                  lineHeight: 1.1,
                  transition: "font-size 0.2s",
                }}>
                  {style.title?.trim() || meta.label}
                </span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ── Composant principal ─────────────────────────────────────────────────────────

export function SectionsEditor({
  initialData,
  initialHeroBg,
  username,
}: {
  initialData?: Partial<SectionsConfig>;
  initialHeroBg?: HeroBg | null;
  username?: string;
}) {
  const router = useRouter();
  const [sections, setSections] = useState<SectionsConfig>(() => buildInitial(initialData));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const sectionsRef = useRef(sections);

  // ── Hero background ──
  const [heroBg, setHeroBgState] = useState<HeroBg | null>(initialHeroBg ?? null);
  const [bgTab, setBgTab] = useState<"image" | "video">(initialHeroBg?.type ?? "image");
  const [bgSaving, setBgSaving] = useState(false);
  const [bgSaved, setBgSaved] = useState(false);
  const [bgError, setBgError] = useState<string | null>(null);

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
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "sections", data: sectionsRef.current }),
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

  async function saveHeroBg(bg: HeroBg | null) {
    setBgSaving(true);
    setBgError(null);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "heroBg", data: bg }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Erreur ${res.status}`);
      }
      setBgSaved(true);
      setHeroBgState(bg);
      router.refresh();
      setTimeout(() => setBgSaved(false), 2500);
    } catch (e) {
      setBgError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setBgSaving(false);
    }
  }

  return (
    <div style={{ padding: "24px 0", maxWidth: 800, margin: "0 auto" }}>

      {/* ── Bloc fond Hero ── */}
      <div style={{ marginBottom: 32, border: "1px solid #374151", borderRadius: 12, background: "#0f172a", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #1f2937" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: "#fd0000", flexShrink: 0 }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#f9fafb" }}>Fond du Hero (Image ou Vidéo)</span>
          </div>
          {heroBg && (
            <button
              type="button"
              onClick={() => saveHeroBg(null)}
              title="Supprimer le fond personnalisé"
              style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
            >
              <Trash2 size={14} /> Réinitialiser
            </button>
          )}
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Onglets Image / Vidéo */}
          <div style={{ display: "flex", gap: 8 }}>
            {(["image", "video"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setBgTab(t)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                  border: "1px solid",
                  borderColor: bgTab === t ? "#fd0000" : "#374151",
                  background: bgTab === t ? "#fd000020" : "#1f2937",
                  color: bgTab === t ? "#fd0000" : "#9ca3af",
                  fontWeight: 600,
                }}
              >
                {t === "image" ? <ImageIcon size={14} /> : <Video size={14} />}
                {t === "image" ? "Image" : "Vidéo"}
              </button>
            ))}
          </div>

          {bgTab === "image" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* URL externe */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  URL d&apos;image externe
                </label>
                <input
                  type="url"
                  placeholder="https://exemple.com/photo-stade.jpg"
                  value={heroBg?.type === "image" && !heroBg.value.startsWith("data:") ? heroBg.value : ""}
                  onChange={(e) => setHeroBgState({ type: "image", value: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: 6, color: "#f9fafb", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#6b7280", fontSize: 12 }}>
                <div style={{ flex: 1, height: 1, background: "#374151" }} />
                <span>ou</span>
                <div style={{ flex: 1, height: 1, background: "#374151" }} />
              </div>
              {/* Upload */}
              <DragImageUpload
                label="Uploader une image (1280×720 recommandé)"
                hint="JPG/PNG — sera compressée automatiquement"
                value={heroBg?.type === "image" && heroBg.value.startsWith("data:") ? heroBg.value : undefined}
                onChange={(v) => v && setHeroBgState({ type: "image", value: v })}
                maxW={1280}
                maxH={720}
              />
              {/* Aperçu */}
              {heroBg?.type === "image" && heroBg.value?.trim() && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroBg.value}
                  alt="Aperçu fond hero"
                  style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, border: "1px solid #374151" }}
                />
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  URL de la vidéo (MP4 direct)
                </label>
                <input
                  type="url"
                  placeholder="https://exemple.com/video-stade.mp4"
                  value={heroBg?.type === "video" ? heroBg.value : ""}
                  onChange={(e) => setHeroBgState({ type: "video", value: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: 6, color: "#f9fafb", fontSize: 14, boxSizing: "border-box" }}
                />
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
                  Utilisez un lien direct vers un fichier .mp4 (hébergé sur votre serveur ou un CDN). Les liens YouTube ne sont pas compatibles.
                </p>
              </div>
              {heroBg?.type === "video" && heroBg.value?.trim() && (
                <video
                  src={heroBg.value}
                  muted autoPlay loop playsInline
                  style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, border: "1px solid #374151" }}
                />
              )}
            </div>
          )}

          {/* Bouton sauvegarder le fond */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() => saveHeroBg(heroBg)}
              disabled={bgSaving}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 20px", background: bgSaved ? "#10b981" : bgSaving ? "#374151" : "#fd0000",
                color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14,
                cursor: bgSaving ? "not-allowed" : "pointer",
              }}
            >
              <Save size={15} />
              {bgSaving ? "Sauvegarde…" : bgSaved ? "Sauvegardé !" : "Appliquer le fond"}
            </button>
            {bgError && <span style={{ color: "#fca5a5", fontSize: 12 }}>{bgError}</span>}
          </div>
        </div>
      </div>

      {/* ── Header sections ── */}
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
