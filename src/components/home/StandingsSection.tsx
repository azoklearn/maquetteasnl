"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Ticket, TrendingUp, ArrowRight } from "lucide-react";
import { LiveStandingsWidget } from "@/components/ui/LiveStandingsWidget";
import { TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";

export function StandingsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* ── Colonne gauche — texte + stats ── */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#C8102E] text-xs font-bold uppercase tracking-[0.3em] block mb-2">
                Ligue 2 BKT · Saison 2025–26
              </span>
              <h2
                className="text-[#0A0A0A] text-5xl md:text-7xl font-black uppercase leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Classement<br />
                <span className="text-[#C8102E]">en direct</span>
              </h2>
            </motion.div>

            {/* Stats clés */}
            <motion.div
              className="mt-10 grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {[
                { value: "3ème",  label: "Position actuelle",   highlight: false },
                { value: "51",    label: "Points",              highlight: true  },
                { value: "27",    label: "Matchs joués",        highlight: false },
                { value: "+18",   label: "Diff. de buts",       highlight: false },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl px-5 py-4 text-center border ${
                    stat.highlight
                      ? "bg-[#C8102E] border-[#C8102E]"
                      : "bg-[#f5f5f5] border-[#ebebeb]"
                  }`}
                >
                  <div
                    className={`text-3xl font-black leading-none ${stat.highlight ? "text-white" : "text-[#0A0A0A]"}`}
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className={`text-[10px] uppercase tracking-wider mt-1 font-semibold ${stat.highlight ? "text-white/70" : "text-[#0A0A0A]/40"}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Message montée */}
            <motion.div
              className="mt-5 p-4 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
            >
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-green-800 font-bold text-sm">Course à la montée ouverte</p>
                <p className="text-green-700/70 text-xs mt-0.5">
                  À 1 pt de Caen (2e). La montée directe en Ligue 1 est à portée.
                </p>
              </div>
            </motion.div>

            {/* Forme récente */}
            <motion.div
              className="mt-5 p-4 rounded-2xl bg-[#f8f8f8] border border-[#ebebeb]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-[#0A0A0A]/40 text-[10px] uppercase tracking-widest font-bold mb-3">
                Forme récente — 5 derniers matchs
              </p>
              <div className="flex gap-2">
                {(["W","W","W","D","W"] as const).map((r, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black ${
                        r === "W" ? "bg-green-500 text-white" :
                        r === "D" ? "bg-[#0A0A0A]/10 text-[#0A0A0A]/50" :
                        "bg-[#C8102E] text-white"
                      }`}
                    >
                      {r === "W" ? "V" : r === "D" ? "N" : "D"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[#0A0A0A]/40 text-[10px] mt-3 font-medium">
                4 victoires · 1 nul · 0 défaite sur les 5 derniers matchs
              </p>
            </motion.div>

            {/* CTA billetterie */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
            >
              <a
                href={TICKETING.nextMatchUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => trackTicketingClick("standings_section", "Prochain match")}
                className="flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#A00C24] text-white font-black text-base py-4 rounded-2xl transition-all hover:scale-[1.02] uppercase tracking-wider shadow-lg shadow-[#C8102E]/25"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <Ticket className="w-5 h-5" />
                Soutenir l'équipe — Prendre sa place
              </a>
              <Link
                href="/calendrier"
                className="flex items-center justify-center gap-2 mt-3 text-sm font-semibold text-[#0A0A0A]/40 hover:text-[#C8102E] transition-colors group"
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
