"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { Sponsor } from "@/types";

interface Props { sponsors: Sponsor[] }

export function PartenairesClient({ sponsors }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled  = [...sponsors, ...sponsors];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero ── */}
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

      {/* ── Bandeau défilant ── */}
      {sponsors.length > 0 && (
        <div className="bg-white py-6 border-b border-black/5">
          <div
            className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
            onMouseEnter={() => trackRef.current && (trackRef.current.style.animationPlayState = "paused")}
            onMouseLeave={() => trackRef.current && (trackRef.current.style.animationPlayState = "running")}
          >
            <div
              ref={trackRef}
              className="flex items-center"
              style={{ animation: "sponsors-scroll 28s linear infinite", width: "max-content" }}
            >
              {doubled.map((s, i) => (
                <a
                  key={`${s.id}-${i}`}
                  href={s.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center justify-center mx-6 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
                >
                  {s.logo?.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logo} alt={s.name} className="h-8 max-w-[120px] object-contain" />
                  ) : (
                    <span className="text-[#0A0A0A] text-sm font-bold uppercase tracking-wide">{s.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes sponsors-scroll {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      )}

      {/* ── Grille tous partenaires ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {sponsors.length > 0 ? (
          <>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/30 text-xs font-bold uppercase tracking-[0.4em] mb-10 text-center"
            >
              {sponsors.length} partenaire{sponsors.length > 1 ? "s" : ""}
            </motion.p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sponsors.map((sponsor, i) => (
                <motion.a
                  key={sponsor.id}
                  href={sponsor.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group flex flex-col items-center justify-center bg-white rounded-2xl py-8 px-6 hover:scale-[1.04] hover:shadow-xl hover:shadow-[#fd0000]/15 transition-all"
                >
                  {sponsor.logo?.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-12 max-w-[130px] object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#fd0000]/10 flex items-center justify-center">
                      <span className="text-[#fd0000] text-lg font-black">{sponsor.name.charAt(0)}</span>
                    </div>
                  )}
                  <p className="mt-3 text-[#0A0A0A]/50 text-xs font-semibold group-hover:text-[#fd0000] transition-colors text-center leading-snug">
                    {sponsor.name}
                  </p>
                </motion.a>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-white/20">
            <p className="text-lg">Aucun partenaire configuré.</p>
            <p className="text-sm mt-2">Ajoute des partenaires depuis l'espace admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
