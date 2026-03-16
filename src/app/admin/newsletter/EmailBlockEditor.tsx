"use client";

import { useState } from "react";
import type { EmailBlock } from "@/lib/db";
import { Image, Type, Heading, Minus, Link2, Code, GripVertical, Trash2, Plus } from "lucide-react";
import DragImageUpload from "@/components/admin/DragImageUpload";

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

function genId() {
  return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const BLOCK_TYPES: { type: EmailBlock["type"]; label: string; icon: React.ElementType }[] = [
  { type: "logo", label: "Logo", icon: Image },
  { type: "heading", label: "Titre", icon: Heading },
  { type: "text", label: "Texte", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "divider", label: "Séparateur", icon: Minus },
  { type: "button", label: "Bouton", icon: Link2 },
  { type: "html", label: "HTML personnalisé", icon: Code },
];

interface Props {
  blocks: EmailBlock[];
  onChange: (blocks: EmailBlock[]) => void;
  accentColor: string;
}

export function EmailBlockEditor({ blocks, onChange, accentColor }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function updateBlock(id: string, partial: Partial<EmailBlock>) {
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, ...partial } : b)) as EmailBlock[]
    );
  }

  function removeBlock(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function addBlock(type: EmailBlock["type"]) {
    const id = genId();
    const newBlock: EmailBlock =
      type === "logo"
        ? { id, type: "logo", url: "/logo.jpeg" }
        : type === "heading"
          ? { id, type: "heading", content: "Nouveau titre", level: 1 }
          : type === "text"
            ? { id, type: "text", content: "Nouveau paragraphe..." }
            : type === "image"
              ? { id, type: "image", url: "", alt: "" }
              : type === "divider"
                ? { id, type: "divider" }
                : type === "button"
                  ? { id, type: "button", label: "En savoir plus", url: "https://" }
                  : { id, type: "html", content: "<p>HTML personnalisé</p>" };
    onChange([...blocks, newBlock]);
    setSelectedId(id);
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= blocks.length) return;
    const arr = [...blocks];
    [arr[index], arr[next]] = [arr[next], arr[index]];
    onChange(arr);
  }

  const selected = blocks.find((b) => b.id === selectedId);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Éditeur */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={LABEL}>Blocs du mail</span>
          <div className="flex flex-wrap gap-1">
            {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 text-xs font-medium transition-colors"
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {blocks.map((block, i) => (
            <div
              key={block.id}
              className={`rounded-xl border transition-colors ${
                selectedId === block.id ? "border-[#fd0000] bg-white/5" : "border-white/10 bg-[#161616] hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => moveBlock(i, -1)}
                  disabled={i === 0}
                  className="p-1 text-white/40 hover:text-white disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(i, 1)}
                  disabled={i === blocks.length - 1}
                  className="p-1 text-white/40 hover:text-white disabled:opacity-30"
                >
                  ↓
                </button>
                <GripVertical className="w-4 h-4 text-white/30" />
                <span className="text-white/60 text-xs font-medium flex-1 capitalize">
                  {block.type}
                </span>
                <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedId(selectedId === block.id ? null : block.id)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-white text-xs font-bold"
                >
                  {selectedId === block.id ? "Masquer" : "Modifier"}
                </button>
              </div>
              {selectedId === block.id && (
                <div className="p-4 pt-0 space-y-3 border-t border-white/5 mt-0">
                  {block.type === "logo" && (
                    <div className="space-y-3">
                      <DragImageUpload
                        value={block.url}
                        onChange={(val) => updateBlock(block.id, { url: val ?? "" })}
                        label="Logo de l'email"
                        hint="Glisse ton logo ou clique pour l'uploader. Il sera intégré directement dans le mail."
                        maxW={260}
                        maxH={120}
                      />
                    </div>
                  )}
                  {block.type === "heading" && (
                    <>
                      <div>
                        <label className={LABEL}>Contenu</label>
                        <input
                          className={FIELD}
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={LABEL}>Niveau</label>
                        <select
                          className={FIELD}
                          value={block.level ?? 1}
                          onChange={(e) => updateBlock(block.id, { level: parseInt(e.target.value, 10) as 1 | 2 })}
                        >
                          <option value={1}>H1 (grand)</option>
                          <option value={2}>H2 (moyen)</option>
                        </select>
                      </div>
                    </>
                  )}
                  {block.type === "text" && (
                    <div>
                      <label className={LABEL}>Contenu</label>
                      <textarea
                        className={FIELD + " resize-none"}
                        rows={4}
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      />
                    </div>
                  )}
                  {block.type === "image" && (
                    <>
                      <div>
                        <label className={LABEL}>URL de l&apos;image</label>
                        <input
                          className={FIELD}
                          value={block.url}
                          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className={LABEL}>Texte alternatif</label>
                        <input
                          className={FIELD}
                          value={block.alt ?? ""}
                          onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  {block.type === "button" && (
                    <>
                      <div>
                        <label className={LABEL}>Texte du bouton</label>
                        <input
                          className={FIELD}
                          value={block.label}
                          onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={LABEL}>URL</label>
                        <input
                          className={FIELD}
                          value={block.url}
                          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </>
                  )}
                  {block.type === "html" && (
                    <div>
                      <label className={LABEL}>HTML personnalisé</label>
                      <textarea
                        className={FIELD + " font-mono text-xs resize-none"}
                        rows={6}
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="<p>Votre HTML...</p>"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {blocks.length === 0 && (
          <p className="text-white/40 text-sm py-8 text-center">
            Aucun bloc. Cliquez sur un type ci-dessus pour ajouter.
          </p>
        )}
      </div>

      {/* Aperçu */}
      <div className="lg:sticky lg:top-4">
        <div className={LABEL}>Aperçu du mail</div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/10">
          <div className="bg-[#f5f5f5] px-4 py-2 border-b border-gray-200 text-gray-500 text-xs font-medium">
            Aperçu — comme vu dans la boîte mail
          </div>
          <div className="p-6 max-w-[600px] mx-auto" style={{ minHeight: 200 }}>
            <EmailPreview blocks={blocks} accentColor={accentColor} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailPreview({ blocks, accentColor }: { blocks: EmailBlock[]; accentColor: string }) {
  if (blocks.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic">Aucun contenu. Ajoutez des blocs pour voir l&apos;aperçu.</p>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {blocks.map((block) => {
        if (block.type === "logo") {
          const logoUrl = block.url || "/logo.jpeg";
          return (
            <div key={block.id} className="flex justify-center py-4">
              <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
            </div>
          );
        }
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h1";
          return (
            <Tag
              key={block.id}
              className="font-black uppercase tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: block.level === 2 ? "1.5rem" : "2rem",
                color: "#0A0A0A",
              }}
            >
              {block.content}
            </Tag>
          );
        }
        if (block.type === "text") {
          return (
            <p key={block.id} className="text-[#0A0A0A]/80 text-sm leading-relaxed whitespace-pre-wrap">
              {block.content}
            </p>
          );
        }
        if (block.type === "image") {
          return (
            <div key={block.id} className="py-2">
              <img
                src={block.url || "https://via.placeholder.com/600x200?text=Image"}
                alt={block.alt || ""}
                className="w-full max-w-full h-auto rounded-lg"
              />
            </div>
          );
        }
        if (block.type === "divider") {
          return (
            <hr key={block.id} className="border-t border-gray-200 my-4" />
          );
        }
        if (block.type === "button") {
          return (
            <div key={block.id} className="py-2">
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 font-bold text-white text-sm uppercase tracking-wider rounded-xl"
                style={{ backgroundColor: accentColor }}
              >
                {block.label}
              </a>
            </div>
          );
        }
        if (block.type === "html") {
          return (
            <div
              key={block.id}
              className="prose prose-sm max-w-none [&_img]:max-w-full [&_a]:text-[#fd0000]"
              dangerouslySetInnerHTML={{ __html: block.content || "<p></p>" }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
