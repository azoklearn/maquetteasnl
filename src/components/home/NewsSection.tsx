"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { NewsArticle } from "@/types";
import { formatShortDate } from "@/lib/utils";
import { ExcerptWithLinks } from "@/components/ui/ExcerptWithLinks";
import type { SectionStyle } from "@/lib/db";
import { titleSizeClass } from "@/lib/sectionStyle";

const CATEGORY_COLORS: Record<string, string> = {
  Match: "bg-[#fd0000] text-white",
  Transfert: "bg-[#1a56db] text-white",
  Billetterie: "bg-amber-500 text-black",
  Club: "bg-[#0A0A0A] text-white",
};

export function NewsSection({ articles, sectionStyle }: { articles?: NewsArticle[]; sectionStyle?: SectionStyle }) {
  const titleCls = titleSizeClass(sectionStyle, "text-4xl md:text-6xl");
  const [featured, ...rest] = articles ?? [];

  return (
    /* ── Fond blanc — contraste maximal ── */
    <section className="section-padding bg-white" style={sectionStyle?.bgColor ? { backgroundColor: sectionStyle.bgColor } : undefined}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header section ── */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] block mb-2" style={{ color: sectionStyle?.accentColor?.trim() || "#fd0000" }}>
              {sectionStyle?.subtitle ?? "Les dernières nouveautés"}
            </span>
            <h2
              className={`font-black uppercase leading-none ${titleCls}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: sectionStyle?.textColor?.trim() || "#0A0A0A" }}
            >
              {sectionStyle?.title ?? "Actualités"}
            </h2>
          </motion.div>

          <Link
            href="/actualites"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#fd0000] hover:text-[#cc0000] transition-colors group"
          >
            Toutes les actus
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Article featured */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:row-span-2"
            >
              <Link href={`/actualites/${featured.slug}`} className="group block h-full">
                <div className="relative h-64 lg:h-full min-h-[420px] rounded-2xl overflow-hidden bg-[#f0f0f0] shadow-xl shadow-black/10">
                  {featured.image?.trim() && (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className={`inline-flex self-start text-xs font-black px-3 py-1 rounded-full mb-3 ${CATEGORY_COLORS[featured.category] ?? "bg-[#0A0A0A] text-white"}`}>
                      {featured.category}
                    </span>
                    <h3
                      className="text-white text-2xl md:text-3xl font-black uppercase leading-tight mb-2 group-hover:text-[#fd0000] transition-colors"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {featured.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                      <ExcerptWithLinks text={featured.excerpt} linkClassName="text-white/80 hover:text-white underline" />
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-white/40 text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      {formatShortDate(featured.publishedAt)}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Articles secondaires sur fond blanc */}
          <div className="flex flex-col gap-5">
            {rest.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/actualites/${article.slug}`}
                  className="group flex gap-4 bg-[#f7f7f7] hover:bg-[#fd0000]/5 border border-[#e5e5e5] hover:border-[#fd0000]/20 rounded-2xl p-4 transition-all"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#e0e0e0]">
                    {article.image?.trim() && (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="112px"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <span className={`inline-flex text-xs font-black px-2 py-0.5 rounded-full mb-2 ${CATEGORY_COLORS[article.category] ?? "bg-[#0A0A0A] text-white"}`}>
                        {article.category}
                      </span>
                      <h3 className="text-[#0A0A0A] font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#fd0000] transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-[#0A0A0A]/40 text-xs mt-2 font-medium">
                      <Clock className="w-3 h-3" />
                      {formatShortDate(article.publishedAt)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#fd0000] hover:text-[#cc0000] transition-colors"
          >
            Toutes les actualités <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
