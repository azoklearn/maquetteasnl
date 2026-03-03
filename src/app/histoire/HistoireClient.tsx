"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Flag } from "lucide-react";

const TIMELINE = [
  { year: "1913", title: "Fondation du club", desc: "L'AS Nancy Lorraine est fondée le 2 juin 1913. Le rouge et le blanc deviennent les couleurs emblématiques." },
  { year: "1958", title: "Montée en Division 1", desc: "Le club accède pour la première fois à l'élite du football français. Une page historique s'écrit." },
  { year: "1978", title: "Coupe de France", desc: "Sacre historique en Coupe de France. L'ASNL entre définitivement dans la légende du football français." },
  { year: "2006", title: "Ligue des Champions", desc: "Qualification historique pour la phase de groupes de la Ligue des Champions. Nancy sur la scène européenne." },
  { year: "2013", title: "Centenaire du club", desc: "Celebration du centenaire. 100 ans d'histoire, de passion et de combativité lorraine." },
  { year: "2026", title: "En route pour la Ligue 2", desc: "En tête de National, le club vise le retour parmi les professionnels. La renaissance est en marche." },
];

const PALMARES = [
  { title: "Coupe de France", count: 1, year: "1978", icon: Trophy },
  { title: "Ligue 2", count: 3, year: "1958, 1983, 2002", icon: Star },
  { title: "Participations Ligue 1", count: 27, year: "", icon: Flag },
];

export function HistoireClient() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-end pb-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className="text-[#C8102E] text-xs font-semibold uppercase tracking-[0.35em] mb-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Depuis 1913
          </motion.p>
          <motion.h1
            className="text-white text-6xl md:text-9xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          >
            Notre Histoire
          </motion.h1>
        </div>
      </div>

      {/* Palmares */}
      <section className="bg-[#111] py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-xs font-semibold uppercase tracking-[0.35em] mb-10 text-center">Palmarès</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PALMARES.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center bg-[#1A1A1A] border border-white/5 rounded-2xl p-8"
              >
                <item.icon className="w-10 h-10 text-[#C8102E] mx-auto mb-4" />
                <div
                  className="text-6xl font-black text-white mb-2 leading-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {item.count}×
                </div>
                <div className="text-white font-bold text-lg mb-1">{item.title}</div>
                {item.year && <div className="text-white/40 text-sm">{item.year}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <h2
          className="text-white text-5xl md:text-7xl font-black uppercase mb-16 text-center"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Les grandes dates
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C8102E] via-[#C8102E]/30 to-transparent" />

          {TIMELINE.map((event, i) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-8 mb-12"
            >
              <div className="shrink-0 w-32 text-right">
                <span
                  className="text-[#C8102E] text-3xl font-black"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {event.year}
                </span>
              </div>
              {/* Dot */}
              <div className="relative shrink-0 flex items-start pt-2">
                <div className="w-3 h-3 rounded-full bg-[#C8102E] border-2 border-[#0A0A0A] ring-2 ring-[#C8102E]/30" />
              </div>
              <div className="flex-1 pb-4">
                <h3 className="text-white font-bold text-xl mb-2">{event.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
