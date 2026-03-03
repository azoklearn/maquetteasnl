"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Sponsor } from "@/types";
import type { SectionStyle } from "@/lib/db";
import { titleSizeClass } from "@/lib/sectionStyle";

export function SponsorsSection({ sponsors = [], sectionStyle }: { sponsors?: Sponsor[]; sectionStyle?: SectionStyle }) {
  const platinum = sponsors.filter((s) => s.tier === "platinum");
  const others   = sponsors.filter((s) => s.tier !== "platinum");
  const accent   = sectionStyle?.accentColor ?? "#fd0000";
  const textCol  = sectionStyle?.textColor   ?? "#ffffff";
  const titleCls = titleSizeClass(sectionStyle, "text-4xl md:text-6xl");

  return (
    <section className="section-padding border-t border-white/5" style={{ backgroundColor: sectionStyle?.bgColor ?? "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] block mb-2" style={{ color: accent }}>
              {sectionStyle?.subtitle ?? "Ils nous soutiennent"}
            </span>
            <h2
              className={`font-black uppercase leading-none ${titleCls}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: textCol }}
            >
              {sectionStyle?.title ?? "Partenaires"}
            </h2>
          </motion.div>
          <Link
            href="/partenaires"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors group"
          >
            Devenir partenaire
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Platinum — cartes blanches sur noir */}
        <div className="mb-10">
          <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-5 font-bold">Partenaire Titre</p>
          <div className="flex flex-wrap gap-4">
            {platinum.map((sponsor, i) => (
              <motion.a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={sponsor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-center justify-center bg-white rounded-2xl px-8 py-6 min-w-[160px] h-20 hover:scale-105 hover:shadow-lg hover:shadow-[#fd0000]/20 transition-all border-2 border-transparent hover:border-[#fd0000]"
              >
                {sponsor.logo?.trim() && <img src={sponsor.logo} alt={sponsor.name} className="max-h-10 max-w-[140px] object-contain" />}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Séparateur rouge */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#fd0000]/40 to-transparent mb-10" />

        {/* Autres — semi-transparent */}
        <div className="flex flex-wrap gap-3">
          {others.map((sponsor, i) => (
            <motion.a
              key={sponsor.id}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={sponsor.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group flex items-center justify-center bg-white/90 hover:bg-white border border-white/20 rounded-xl px-6 py-4 min-w-[120px] h-16 hover:scale-105 transition-all hover:shadow-md hover:shadow-[#fd0000]/15"
            >
              {sponsor.logo?.trim() && <img src={sponsor.logo} alt={sponsor.name} className="max-h-8 max-w-[110px] object-contain opacity-70 group-hover:opacity-100 transition-opacity" />}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
