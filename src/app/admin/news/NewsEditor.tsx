"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { NewsArticle } from "@/types";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Plus, Trash2, ChevronDown, ChevronUp, Star } from "lucide-react";
import DragImageUpload from "@/components/admin/DragImageUpload";

interface Props { initialData: NewsArticle[]; username: string }

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

const CATEGORIES = ["Match", "Transfert", "Jeunes", "Club", "Partenaires", "Communiqué"];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
}

function createSubSection() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    content: "",
  };
}

function normalizeArticle(article: NewsArticle): NewsArticle {
  if (article.subSections?.length) return article;
  if (article.subSectionTitle?.trim() || article.subSectionContent?.trim()) {
    return {
      ...article,
      subSections: [
        {
          id: `legacy-${article.id}`,
          title: article.subSectionTitle ?? "",
          content: article.subSectionContent ?? "",
        },
      ],
    };
  }
  return { ...article, subSections: [] };
}

function newArticle(): NewsArticle {
  const id = Date.now().toString();
  return {
    id,
    title: "Nouvel article",
    excerpt: "",
    content: "",
    subSections: [],
    subSectionTitle: "",
    subSectionContent: "",
    image: "/images/news-placeholder.jpg",
    category: "Club",
    publishedAt: new Date().toISOString().split("T")[0],
    slug: `article-${id}`,
    isFeatured: false,
  };
}

export default function NewsEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>(() => initialData.map(normalizeArticle));
  const [expanded, setExpanded] = useState<string | null>(initialData[0]?.id ?? null);
  const selectedArticle = articles.find((a) => a.id === expanded) ?? null;

  useEffect(() => {
    setArticles(initialData.map(normalizeArticle));
    if (!expanded && initialData[0]?.id) {
      setExpanded(initialData[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  function update(id: string, field: keyof NewsArticle, value: string | boolean) {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const updated = { ...a, [field]: value };
        if (field === "title") updated.slug = slugify(String(value));
        return updated;
      })
    );
  }

  async function remove(id: string) {
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "news", data: updated }),
    });
    if (res.ok) router.refresh();
  }

  function add() {
    const article = newArticle();
    setArticles((prev) => [article, ...prev]);
    setExpanded(article.id);
  }

  function addSubSection(articleId: string) {
    setArticles((prev) =>
      prev.map((article) => {
        if (article.id !== articleId) return article;
        return {
          ...article,
          subSections: [...(article.subSections ?? []), createSubSection()],
          subSectionTitle: "",
          subSectionContent: "",
        };
      }),
    );
  }

  function updateSubSection(articleId: string, subSectionId: string, field: "title" | "content", value: string) {
    setArticles((prev) =>
      prev.map((article) => {
        if (article.id !== articleId) return article;
        return {
          ...article,
          subSections: (article.subSections ?? []).map((section) =>
            section.id === subSectionId ? { ...section, [field]: value } : section,
          ),
          subSectionTitle: "",
          subSectionContent: "",
        };
      }),
    );
  }

  function removeSubSection(articleId: string, subSectionId: string) {
    setArticles((prev) =>
      prev.map((article) => {
        if (article.id !== articleId) return article;
        return {
          ...article,
          subSections: (article.subSections ?? []).filter((section) => section.id !== subSectionId),
          subSectionTitle: "",
          subSectionContent: "",
        };
      }),
    );
  }

  async function save() {
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "news", data: articles }),
    });
    if (!res.ok) throw new Error();
    // Recharge les données fraîches depuis Redis
    router.refresh();
  }

  return (
    <AdminShell username={username}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Actualités
            </h1>
            <p className="text-white/40 text-sm mt-1">{articles.length} article{articles.length > 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={add}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Nouvel article
            </button>
            <SaveButton onSave={save} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {articles.map((article) => {
            const open = expanded === article.id;
            return (
              <div
                key={article.id}
                role="button"
                tabIndex={0}
                className={`h-28 rounded-2xl border transition-all px-4 py-3 flex flex-col justify-between ${
                  open
                    ? "bg-[#1b1b1b] border-[#fd0000]/40 shadow-lg shadow-[#fd0000]/10"
                    : "bg-[#161616] border-white/5 hover:border-white/20"
                }`}
                onClick={() => setExpanded(article.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpanded(article.id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#fd0000] text-[11px] font-bold uppercase tracking-wider truncate">{article.category}</span>
                    {article.isFeatured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Supprimer cet article ?")) remove(article.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-white font-semibold text-sm truncate">{article.title}</p>
                <div className="flex items-center justify-between">
                  <p className="text-white/30 text-xs">{article.publishedAt}</p>
                  {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
              </div>
            );
          })}

          {articles.length === 0 && (
            <div className="col-span-full text-center py-16 text-white/30">
              <p>Aucun article. Clique sur Nouvel article pour commencer.</p>
            </div>
          )}
        </div>

        {selectedArticle && (
          <div className="mt-4 bg-[#161616] rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[#fd0000] text-xs font-bold uppercase tracking-wider">{selectedArticle.category}</p>
                <p className="text-white font-semibold text-sm">{selectedArticle.title}</p>
              </div>
              <p className="text-white/30 text-xs">{selectedArticle.publishedAt}</p>
            </div>
            <div className="px-5 pb-5 pt-4 space-y-4">
                    <div>
                      <label className={LABEL}>Titre</label>
                      <input className={FIELD} value={selectedArticle.title} onChange={(e) => update(selectedArticle.id, "title", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={LABEL}>Catégorie</label>
                        <select
                          className={FIELD}
                          value={selectedArticle.category}
                          onChange={(e) => update(selectedArticle.id, "category", e.target.value)}
                        >
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={LABEL}>Date publication</label>
                        <input type="date" className={FIELD} value={selectedArticle.publishedAt} onChange={(e) => update(selectedArticle.id, "publishedAt", e.target.value)} />
                      </div>
                      <div>
                        <label className={LABEL}>Slug URL</label>
                        <input className={FIELD} value={selectedArticle.slug} onChange={(e) => update(selectedArticle.id, "slug", e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <DragImageUpload
                        label="Image de couverture"
                        hint="Photo principale affichée sur la carte article"
                        value={selectedArticle.image}
                        onChange={(v) => update(selectedArticle.id, "image", v ?? "")}
                        maxW={1200}
                        maxH={800}
                      />
                    </div>

                    <div>
                      <label className={LABEL}>Extrait (résumé visible sur la homepage)</label>
                      <textarea
                        className={FIELD + " resize-none"}
                        rows={3}
                        value={selectedArticle.excerpt}
                        onChange={(e) => update(selectedArticle.id, "excerpt", e.target.value)}
                        placeholder="Pour ajouter un lien : [texte cliquable](https://exemple.com)"
                      />
                      <p className="text-white/30 text-xs mt-1.5">
                        Liens : utilisez <code className="bg-white/10 px-1 rounded">[texte](url)</code> — ex. [Billetterie](https://billetterie.asnl.net)
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#fd0000]/25 bg-[#fd0000]/5 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[#fd0000] text-xs font-bold uppercase tracking-[0.2em]">
                          Sous-parties stylisees (blocs en avant)
                        </p>
                        <button
                          type="button"
                          onClick={() => addSubSection(selectedArticle.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#fd0000] hover:bg-[#d60000] text-white text-xs font-bold px-3 py-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Ajouter
                        </button>
                      </div>
                      {(selectedArticle.subSections ?? []).length === 0 ? (
                        <p className="text-white/45 text-xs">Aucune sous-partie. Clique sur + pour en ajouter une.</p>
                      ) : (
                        <div className="space-y-3">
                          {(selectedArticle.subSections ?? []).map((section, index) => (
                            <div key={section.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">
                                  Sous-partie {index + 1}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => removeSubSection(selectedArticle.id, section.id)}
                                  className="p-1.5 rounded-md hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                                  title="Supprimer la sous-partie"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className={LABEL}>Titre</label>
                                  <input
                                    className={FIELD}
                                    value={section.title ?? ""}
                                    onChange={(e) => updateSubSection(selectedArticle.id, section.id, "title", e.target.value)}
                                    placeholder="Ex: Ce qu'il faut retenir"
                                  />
                                </div>
                                <div>
                                  <label className={LABEL}>Contenu</label>
                                  <textarea
                                    className={FIELD + " resize-none"}
                                    rows={3}
                                    value={section.content ?? ""}
                                    onChange={(e) => updateSubSection(selectedArticle.id, section.id, "content", e.target.value)}
                                    placeholder="Texte de la sous-partie mise en avant."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={LABEL}>Contenu complet</label>
                      <textarea
                        className={FIELD + " resize-none"}
                        rows={8}
                        value={selectedArticle.content ?? ""}
                        onChange={(e) => update(selectedArticle.id, "content", e.target.value)}
                        placeholder="Texte libre. Liens [texte](https://url), images ![légende](https://image.jpg) ou HTML (&lt;h2&gt;, &lt;p&gt;, ...)."
                      />
                      <p className="text-white/30 text-xs mt-1.5 space-y-1">
                        <span className="block">
                          Liens : <code className="bg-white/10 px-1 rounded">[texte](https://url)</code>
                        </span>
                        <span className="block">
                          Images :{" "}
                          <code className="bg-white/10 px-1 rounded">![légende](https://image.jpg)</code>
                          {" "} ou tailles{" "}
                          <code className="bg-white/10 px-1 rounded">![légende|small](...)</code>,{" "}
                          <code className="bg-white/10 px-1 rounded">![légende|medium](...)</code>,{" "}
                          <code className="bg-white/10 px-1 rounded">![légende|large](...)</code>.
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`feat-${selectedArticle.id}`}
                        checked={!!selectedArticle.isFeatured}
                        onChange={(e) => update(selectedArticle.id, "isFeatured", e.target.checked)}
                        className="w-4 h-4 accent-[#fd0000]"
                      />
                      <label htmlFor={`feat-${selectedArticle.id}`} className="text-white/60 text-sm cursor-pointer flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-400" /> Article mis en avant (hero de la section actualités)
                      </label>
                    </div>
            </div>
          </div>
        )}

        {articles.length > 0 && !selectedArticle && (
          <div className="mt-4 text-center py-10 rounded-2xl border border-white/5 bg-[#161616] text-white/35">
            <p>Sélectionne une carte pour éditer l&apos;actualité.</p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="mt-6 flex justify-end">
            <SaveButton onSave={save} />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
