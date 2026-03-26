"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  const displayed = (articles ?? []).slice(0, 3);
  const sectionTitle = sectionStyle?.title?.trim() || "Dernieres actualites";
  const sectionSubtitle = sectionStyle?.subtitle?.trim() || "Restez informes des dernieres nouvelles du club";

  return (
    <section className="h-full min-h-[100dvh] overflow-hidden bg-[#0A0A0A]" style={sectionStyle?.bgColor ? { backgroundColor: sectionStyle.bgColor } : undefined}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-10 md:py-12 flex flex-col">

        {/* ── Header section ── */}
        <div className="flex items-end justify-between mb-8 md:mb-10 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-[3px] w-14 bg-[#fd0000] mb-4" />
            <h2
              className={`font-black uppercase leading-none ${titleCls}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: sectionStyle?.textColor?.trim() || "#ffffff" }}
            >
              {sectionTitle}
            </h2>
            <p className="text-white/45 text-sm mt-3">
              {sectionSubtitle}
            </p>
          </motion.div>

          <Link
            href="/actualites"
            className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#fd0000] hover:text-[#ff3b3b] transition-colors group"
          >
            Toutes les actus
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayed.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                href={`/actualites/${article.slug}`}
                className="group block rounded-xl overflow-hidden bg-[#171717] border border-white/10 hover:border-white/20 transition-colors h-full"
              >
                <div className="relative h-52 overflow-hidden bg-[#202020]">
                  {article.image?.trim() && (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider ${CATEGORY_COLORS[article.category] ?? "bg-[#0A0A0A] text-white"}`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col h-[220px]">
                  <p className="text-white/35 text-[11px] mb-2">{formatShortDate(article.publishedAt)}</p>
                  <h3
                    className="text-white font-black uppercase text-xl leading-tight line-clamp-2 group-hover:text-[#fd0000] transition-colors"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {article.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed line-clamp-2 mt-2">
                    <ExcerptWithLinks text={article.excerpt} linkClassName="text-white/60 hover:text-white underline" />
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[#fd0000] text-sm font-semibold">
                    Lire la suite <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 text-center md:hidden shrink-0">
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
