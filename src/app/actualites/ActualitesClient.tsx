"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, Tag } from "lucide-react";
import type { NewsArticle } from "@/types";
import { formatShortDate } from "@/lib/utils";
import { NEWS } from "@/lib/mock-data";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Match:       { bg: "bg-[#fd0000]",      text: "text-white",          dot: "bg-[#fd0000]"    },
  Transfert:   { bg: "bg-blue-600",        text: "text-white",          dot: "bg-blue-500"     },
  Billetterie: { bg: "bg-amber-500",       text: "text-black",          dot: "bg-amber-500"    },
  Club:        { bg: "bg-[#0A0A0A]",       text: "text-white",          dot: "bg-[#0A0A0A]"   },
};

function CategoryBadge({ cat }: { cat: string }) {
  const c = CATEGORY_COLORS[cat] ?? { bg: "bg-[#0A0A0A]", text: "text-white", dot: "bg-gray-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1 h-1 rounded-full ${c.text === "text-white" ? "bg-white/40" : "bg-black/20"}`} />
      {cat}
    </span>
  );
}

interface Props { articles?: NewsArticle[] }

export function ActualitesClient({ articles }: Props) {
  const all = articles?.length ? articles : NEWS;
  const categories = ["Tout", ...Array.from(new Set(all.map((a) => a.category)))];
  const [activeCategory, setActiveCategory] = useState("Tout");

  const filtered = activeCategory === "Tout"
    ? all
    : all.filter((a) => a.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Header ── */}
      <div className="relative bg-[#111] border-b border-white/5 pt-20 pb-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className="text-[#fd0000] text-xs font-bold uppercase tracking-[0.35em] mb-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Centre médias
          </motion.p>
          <motion.h1
            className="text-white font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 10vw, 96px)" }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            Actualités
          </motion.h1>

          {/* Filtres catégories */}
          <motion.div
            className="flex flex-wrap gap-2 mt-8 pb-0"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-[#fd0000] text-white shadow-lg shadow-[#fd0000]/30"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
                {cat !== "Tout" && (
                  <span className="ml-2 text-[10px] opacity-60">
                    {all.filter((a) => a.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Ligne rouge bas */}
        <div className="h-0.5 bg-[#fd0000] mt-6" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-24 text-white/20"
            >
              <p className="text-xl font-semibold">Aucun article dans cette catégorie</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* ── Article featured ── */}
              {featured && (
                <Link
                  href={`/actualites/${featured.slug}`}
                  className="group block mb-10"
                >
                  <motion.div
                    className="relative h-72 sm:h-96 md:h-[520px] rounded-3xl overflow-hidden bg-[#1a1a1a]"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-75"
                      sizes="100vw"
                      priority
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/20 to-transparent" />

                    {/* Badge featured */}
                    <div className="absolute top-5 left-5">
                      <span className="flex items-center gap-2 bg-[#fd0000] text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        À la une
                      </span>
                    </div>

                    {/* Contenu bas */}
                    <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
                      <CategoryBadge cat={featured.category} />
                      <h2
                        className="text-white font-black uppercase leading-tight mt-3 mb-3 group-hover:text-[#fd0000] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 4vw, 52px)" }}
                      >
                        {featured.title}
                      </h2>
                      <p className="text-white/60 text-sm md:text-base leading-relaxed line-clamp-2 max-w-3xl mb-4">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-white/40 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {formatShortDate(featured.publishedAt)}
                        </div>
                        <span className="flex items-center gap-1.5 text-[#fd0000] text-sm font-bold group-hover:gap-2.5 transition-all">
                          Lire l&apos;article <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )}

              {/* ── Grille articles ── */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        href={`/actualites/${article.slug}`}
                        className="group block bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all h-full"
                      >
                        {/* Image */}
                        <div className="relative h-44 overflow-hidden bg-[#1e1e1e]">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <CategoryBadge cat={article.category} />
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-5">
                          <h3
                            className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-[#fd0000] transition-colors mb-2"
                          >
                            {article.title}
                          </h3>
                          <p className="text-white/35 text-sm line-clamp-2 leading-relaxed mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-white/25 font-medium">
                              <Clock className="w-3 h-3" />
                              {formatShortDate(article.publishedAt)}
                            </div>
                            <span className="flex items-center gap-1 text-white/30 group-hover:text-[#fd0000] transition-colors font-semibold">
                              Lire <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
