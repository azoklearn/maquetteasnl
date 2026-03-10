"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { HistoryConfig, HistoryEvent } from "@/lib/db";

const FALLBACK: HistoryConfig = {
  heroSubtitle: "Depuis 1967",
  heroImage: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80",
  timeline: [
    { year: "1967", title: "Fondation de l'ASNL", desc: "L'AS Nancy-Lorraine est fondée pour succéder au FC Nancy. Le rouge et le blanc s'imposent comme couleurs emblématiques du club lorrain." },
  ],
};

export function HistoireClient() {
  const [config, setConfig] = useState<HistoryConfig | null>(null);

  useEffect(() => {
    fetch("/api/histoire")
      .then((res) => res.json())
      .then((data: HistoryConfig) => setConfig(data))
      .catch(() => setConfig(FALLBACK));
  }, []);

  const heroSubtitle = config?.heroSubtitle ?? FALLBACK.heroSubtitle!;
  const heroImage = config?.heroImage ?? FALLBACK.heroImage!;
  const timeline: HistoryEvent[] = config?.timeline?.length ? config.timeline : FALLBACK.timeline;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-end pb-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.35em] mb-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {heroSubtitle}
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
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#fd0000] via-[#fd0000]/30 to-transparent" />

          {TIMELINE.map((event, i) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative flex gap-8 mb-12"
            >
              <div className="shrink-0 w-32 text-right">
                <span
                  className="text-[#fd0000] text-2xl md:text-3xl font-black leading-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {event.year}
                </span>
              </div>
              {/* Dot */}
              <div className="relative shrink-0 flex items-start pt-1.5">
                {event.trophy ? (
                  <div className="w-5 h-5 rounded-full bg-[#fd0000] flex items-center justify-center ring-4 ring-[#fd0000]/20">
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-[#fd0000]/60 border-2 border-[#0A0A0A] ring-2 ring-[#fd0000]/20 mt-1" />
                )}
              </div>
              <div className={`flex-1 pb-4 ${event.trophy ? "bg-[#fd0000]/5 border border-[#fd0000]/15 rounded-xl p-4 -mt-1" : ""}`}>
                <h3 className={`font-bold text-lg mb-1.5 ${event.trophy ? "text-white" : "text-white/90"}`}>
                  {event.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
