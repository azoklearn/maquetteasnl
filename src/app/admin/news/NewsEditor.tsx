"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsArticle } from "@/types";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Plus, Trash2, ChevronDown, ChevronUp, Star } from "lucide-react";

interface Props { initialData: NewsArticle[]; username: string }

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#C8102E] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

const CATEGORIES = ["Match", "Transfert", "Jeunes", "Club", "Partenaires", "Communiqué"];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
}

function newArticle(): NewsArticle {
  const id = Date.now().toString();
  return {
    id,
    title: "Nouvel article",
    excerpt: "",
    content: "",
    image: "/images/news-placeholder.jpg",
    category: "Club",
    publishedAt: new Date().toISOString().split("T")[0],
    slug: `article-${id}`,
    isFeatured: false,
  };
}

export default function NewsEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>(initialData);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  function remove(id: string) {
    if (!confirm("Supprimer cet article définitivement ?")) return;
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  function add() {
    const article = newArticle();
    setArticles((prev) => [article, ...prev]);
    setExpanded(article.id);
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

        <div className="flex flex-col gap-3">
          {articles.map((article) => {
            const open = expanded === article.id;
            return (
              <div key={article.id} className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden">
                {/* Header carte */}
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
                  onClick={() => setExpanded(open ? null : article.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[#C8102E] text-xs font-bold uppercase tracking-wider">{article.category}</span>
                      {article.isFeatured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                    </div>
                    <p className="text-white font-semibold text-sm truncate">{article.title}</p>
                    <p className="text-white/30 text-xs mt-0.5">{article.publishedAt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(article.id); }}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </div>
                </button>

                {/* Formulaire d'édition */}
                {open && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                    <div>
                      <label className={LABEL}>Titre</label>
                      <input className={FIELD} value={article.title} onChange={(e) => update(article.id, "title", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={LABEL}>Catégorie</label>
                        <select
                          className={FIELD}
                          value={article.category}
                          onChange={(e) => update(article.id, "category", e.target.value)}
                        >
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={LABEL}>Date publication</label>
                        <input type="date" className={FIELD} value={article.publishedAt} onChange={(e) => update(article.id, "publishedAt", e.target.value)} />
                      </div>
                      <div>
                        <label className={LABEL}>Slug URL</label>
                        <input className={FIELD} value={article.slug} onChange={(e) => update(article.id, "slug", e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className={LABEL}>Image (URL ou chemin)</label>
                      <input className={FIELD} value={article.image} onChange={(e) => update(article.id, "image", e.target.value)} placeholder="/images/article.jpg" />
                    </div>

                    <div>
                      <label className={LABEL}>Extrait (résumé visible sur la homepage)</label>
                      <textarea
                        className={FIELD + " resize-none"}
                        rows={3}
                        value={article.excerpt}
                        onChange={(e) => update(article.id, "excerpt", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={LABEL}>Contenu complet</label>
                      <textarea
                        className={FIELD + " resize-none"}
                        rows={8}
                        value={article.content ?? ""}
                        onChange={(e) => update(article.id, "content", e.target.value)}
                        placeholder="Contenu de l'article en texte libre ou HTML..."
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`feat-${article.id}`}
                        checked={!!article.isFeatured}
                        onChange={(e) => update(article.id, "isFeatured", e.target.checked)}
                        className="w-4 h-4 accent-[#C8102E]"
                      />
                      <label htmlFor={`feat-${article.id}`} className="text-white/60 text-sm cursor-pointer flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-400" /> Article mis en avant (hero de la section actualités)
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {articles.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <p>Aucun article. Clique sur "Nouvel article" pour commencer.</p>
            </div>
          )}
        </div>

        {articles.length > 0 && (
          <div className="mt-6 flex justify-end">
            <SaveButton onSave={save} />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
