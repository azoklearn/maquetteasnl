"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Sponsor } from "@/types";
import type { SectionStyle } from "@/lib/db";
import { titleSizeClass } from "@/lib/sectionStyle";

// ── Carte sponsor ──────────────────────────────────────────────────────────────
function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sponsor.name}
      className="shrink-0 flex items-center justify-center bg-white rounded-xl mx-3 hover:scale-105 hover:shadow-lg hover:shadow-[#fd0000]/20 transition-all border-2 border-transparent hover:border-[#fd0000]"
      style={{ width: 140, height: 64, padding: 8 }}
    >
      {sponsor.logo?.trim() ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      ) : (
        <span className="text-[#0A0A0A] text-xs font-bold uppercase tracking-wider text-center leading-tight">{sponsor.name}</span>
      )}
    </a>
  );
}

// ── Section principale ─────────────────────────────────────────────────────────
export function SponsorsSection({ sponsors = [], sectionStyle }: { sponsors?: Sponsor[]; sectionStyle?: SectionStyle }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const accent   = sectionStyle?.accentColor?.trim() || "#fd0000";
  const textCol  = sectionStyle?.textColor?.trim()   || "#ffffff";
  const titleCls = titleSizeClass(sectionStyle, "text-4xl md:text-6xl");

  // On double la liste pour le défilement infini
  const doubled = [...sponsors, ...sponsors];

  return (
    <section className="pt-0 pb-20 md:pb-28 border-t border-white/5" style={{ backgroundColor: sectionStyle?.bgColor?.trim() || "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
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
      </div>

      {/* Bandeau sponsors — mobile swipe + desktop défilant */}
      {sponsors.length > 0 ? (
        <>
          {/* Mobile: scroll horizontal avec snap */}
          <div
            className="md:hidden -mt-2 px-4"
            style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
          >
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="snap-start shrink-0">
                  <SponsorCard sponsor={sponsor} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: bandeau défilant */}
          <div
            className="hidden md:block -mt-2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            onMouseEnter={() => trackRef.current && (trackRef.current.style.animationPlayState = "paused")}
            onMouseLeave={() => trackRef.current && (trackRef.current.style.animationPlayState = "running")}
          >
            <div
              ref={trackRef}
              className="flex"
              style={{
                animation: "sponsors-scroll 30s linear infinite",
                width: "max-content",
              }}
            >
              {doubled.map((sponsor, i) => (
                <SponsorCard key={`${sponsor.id}-${i}`} sponsor={sponsor} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-white/20 text-sm py-8">Aucun partenaire configuré.</p>
      )}

      {/* Keyframes injectés inline */}
      <style>{`
        @keyframes sponsors-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
