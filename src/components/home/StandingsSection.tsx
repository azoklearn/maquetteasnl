"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Ticket, ArrowRight } from "lucide-react";
import { LiveStandingsWidget } from "@/components/ui/LiveStandingsWidget";
import { TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";
import type { SectionStyle } from "@/lib/db";
import { titleSizeClass } from "@/lib/sectionStyle";

export function StandingsSection({ sectionStyle }: { sectionStyle?: SectionStyle }) {
  const accent   = sectionStyle?.accentColor ?? "#fd0000";
  const textCol  = sectionStyle?.textColor   ?? "#0A0A0A";
  const titleCls = titleSizeClass(sectionStyle, "text-5xl md:text-7xl");
  return (
    <section className="section-padding" style={{ backgroundColor: sectionStyle?.bgColor ?? "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* ── Colonne gauche — texte + stats ── */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] block mb-2" style={{ color: accent }}>
                {sectionStyle?.subtitle ?? "Ligue 2 BKT · Saison 2025–26"}
              </span>
              <h2
                className={`font-black uppercase leading-none ${titleCls}`}
                style={{ fontFamily: "'Bebas Neue', sans-serif", color: textCol }}
              >
                {sectionStyle?.title ? sectionStyle.title : (<>Classement<br /><span style={{ color: accent }}>en direct</span></>)}
              </h2>
            </motion.div>

            {/* CTA billetterie */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a
                href={TICKETING.nextMatchUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => trackTicketingClick("standings_section", "Prochain match")}
                className="flex items-center justify-center gap-2 bg-[#fd0000] hover:bg-[#cc0000] text-white font-black text-base py-4 rounded-2xl transition-all hover:scale-[1.02] uppercase tracking-wider shadow-lg shadow-[#fd0000]/25"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <Ticket className="w-5 h-5" />
                Soutenir l'équipe — Prendre sa place
              </a>
              <Link
                href="/calendrier"
                className="flex items-center justify-center gap-2 mt-3 text-sm font-semibold text-[#0A0A0A]/40 hover:text-[#fd0000] transition-colors group"
              >
                Voir le calendrier complet
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* ── Widget classement live ── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <LiveStandingsWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
