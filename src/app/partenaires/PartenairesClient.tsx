"use client";

import { motion } from "framer-motion";
import type { Sponsor } from "@/types";

interface Props { sponsors: Sponsor[] }

const TIER_LABELS: Record<Sponsor["tier"], string> = {
  platinum: "Partenaire Titre",
  gold: "Partenaire Or",
  silver: "Partenaire Argent",
  official: "Partenaire Officiel",
};

const TIER_ORDER: Sponsor["tier"][] = ["platinum", "gold", "silver", "official"];

export function PartenairesClient({ sponsors }: Props) {
  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    label: TIER_LABELS[tier],
    items: sponsors.filter((s) => s.tier === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* Header */}
      <div className="bg-[#fd0000] py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 60px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 60px)",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/60 text-xs font-bold uppercase tracking-[0.4em] mb-3">Club</p>
          <h1
            className="text-white text-6xl md:text-8xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Partenaires
          </h1>
          <p className="text-white/70 mt-4 text-base max-w-lg">
            Les entreprises qui soutiennent l'AS Nancy Lorraine.
          </p>
        </div>
      </div>

      {/* Partenaires groupés par niveau */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {grouped.map(({ tier, label, items }) => (
          <section key={tier}>
            {/* Titre du niveau */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">{label}</span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            {/* Grille */}
            <div className={`grid gap-5 ${
              tier === "platinum"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            }`}>
              {items.map((sponsor, i) => (
                <motion.a
                  key={sponsor.id}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`group flex flex-col items-center justify-center bg-white rounded-2xl transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-[#fd0000]/15 ${
                    tier === "platinum" ? "py-10 px-8" : "py-7 px-6"
                  }`}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className={`object-contain ${tier === "platinum" ? "max-h-14 max-w-[180px]" : "max-h-10 max-w-[130px]"}`}
                  />
                  <p className="mt-4 text-[#0A0A0A]/50 text-xs font-semibold group-hover:text-[#fd0000] transition-colors text-center">
                    {sponsor.name}
                  </p>
                </motion.a>
              ))}
            </div>
          </section>
        ))}

        {sponsors.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <p className="text-lg">Aucun partenaire configuré.</p>
            <p className="text-sm mt-2">Ajoute des partenaires depuis l'espace admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
