"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { NEWS } from "@/lib/mock-data";
import { formatShortDate } from "@/lib/utils";

const CATEGORIES = ["Tout", "Match", "Transfert", "Club", "Billetterie"];

const CATEGORY_COLORS: Record<string, string> = {
  Match: "bg-[#C8102E] text-white",
  Transfert: "bg-blue-600 text-white",
  Billetterie: "bg-amber-500 text-black",
  Club: "bg-white/10 text-white",
};

export function MediasClient() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-xs font-semibold uppercase tracking-[0.35em] mb-3">Centre Médias</p>
          <h1 className="text-white text-6xl md:text-8xl font-black uppercase leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Actualités
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5 transition-all uppercase tracking-wide first:bg-[#C8102E] first:text-white first:border-[#C8102E]"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...NEWS, ...NEWS].map((article, i) => (
            <motion.div
              key={`${article.id}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.07 }}
            >
              <Link href={`/medias/${article.slug}`} className="group block bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all">
                <div className="relative h-48 overflow-hidden bg-[#2A2A2A]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <span className={`inline-flex text-xs font-bold px-2.5 py-0.5 rounded-full mb-3 ${CATEGORY_COLORS[article.category] ?? "bg-white/10 text-white"}`}>
                    {article.category}
                  </span>
                  <h3 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors mb-3">
                    {article.title}
                  </h3>
                  <p className="text-white/40 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-white/30">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {formatShortDate(article.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-[#C8102E] transition-colors">
                      Lire <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
