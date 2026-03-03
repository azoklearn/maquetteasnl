"use client";

import { motion } from "framer-motion";
import { SPONSORS } from "@/lib/mock-data";
import { Eye, Users, TrendingUp, Mail } from "lucide-react";

const PACKAGES = [
  {
    tier: "Platinum",
    price: "Sur devis",
    color: "from-yellow-600/20 to-yellow-600/5",
    border: "border-yellow-600/30",
    badge: "bg-yellow-600 text-black",
    features: [
      "Naming du stade",
      "Jersey front placement",
      "Activation digitale premium",
      "Loges VIP saison",
      "Contenu dédié réseaux sociaux",
      "Visibilité site officiel homepage",
      "Accès data fans",
    ],
  },
  {
    tier: "Gold",
    price: "À partir de 30 000€",
    color: "from-[#C8102E]/20 to-[#C8102E]/5",
    border: "border-[#C8102E]/30",
    badge: "bg-[#C8102E] text-white",
    features: [
      "Logo maillot manche",
      "Panneau LED bord terrain",
      "Posts réseaux sociaux dédiés",
      "Invitations matchs domicile",
      "Visibilité site officiel",
      "Communiqués de presse",
    ],
  },
  {
    tier: "Silver",
    price: "À partir de 10 000€",
    color: "from-white/10 to-white/5",
    border: "border-white/10",
    badge: "bg-white/20 text-white",
    features: [
      "Logo sur site officiel",
      "Bannières LED stade",
      "Mentions réseaux sociaux",
      "Invitations ponctuelles",
      "Newsletter partenaires",
    ],
  },
];

const STATS = [
  { icon: Eye, value: "450K+", label: "Audience digitale mensuelle" },
  { icon: Users, value: "8 000", label: "Spectateurs par match" },
  { icon: TrendingUp, value: "120K+", label: "Abonnés réseaux sociaux" },
];

export function PartenairesClient() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-xs font-semibold uppercase tracking-[0.35em] mb-3">Business & Visibilité</p>
          <h1 className="text-white text-6xl md:text-8xl font-black uppercase leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Partenaires
          </h1>
          <p className="text-white/50 mt-4 text-base max-w-xl">
            Associez votre marque à l'ASNL. Bénéficiez de la passion de 8 000 supporters par match et d'une audience digitale engagée.
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-5 bg-[#141414] border border-white/5 rounded-2xl p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#C8102E]/15 border border-[#C8102E]/20 flex items-center justify-center shrink-0">
                  <stat.icon className="w-7 h-7 text-[#C8102E]" />
                </div>
                <div>
                  <div className="text-white text-3xl font-black leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{stat.value}</div>
                  <div className="text-white/40 text-sm mt-0.5">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-white text-5xl md:text-7xl font-black uppercase mb-12" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Nos packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-b ${pkg.color} border ${pkg.border} rounded-2xl p-7 flex flex-col`}
            >
              <span className={`inline-flex self-start text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider mb-5 ${pkg.badge}`}>
                {pkg.tier}
              </span>
              <div className="text-white font-bold text-xl mb-6">{pkg.price}</div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-1.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:partenaires@asnl.fr"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-sm py-3.5 rounded-xl transition-colors uppercase tracking-wider"
              >
                <Mail className="w-4 h-4" />
                Nous contacter
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Current sponsors */}
      <section className="py-16 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white text-4xl md:text-5xl font-black uppercase mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Nos partenaires actuels
          </h2>
          <div className="flex flex-wrap gap-4">
            {SPONSORS.map((sponsor, i) => (
              <motion.a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center justify-center bg-white rounded-xl px-6 py-4 h-16 hover:scale-105 transition-transform"
              >
                <img src={sponsor.logo} alt={sponsor.name} className="max-h-8 max-w-[110px] object-contain" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
