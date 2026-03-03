"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ChevronDown, Ticket } from "lucide-react";
import { TICKETING } from "@/lib/constants";
import { trackTicketingClick } from "@/lib/analytics";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ticketingUrl?: string;
}

export function HeroSection({ title, subtitle, ticketingUrl }: HeroProps) {
  const ticketUrl = ticketingUrl ?? TICKETING.nextMatchUrl;
  return (
    <section className="relative h-[100svh] min-h-[600px] max-h-[1000px] overflow-hidden flex items-center">

      {/* ── Fond photo ── */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1920&q=80')",
          }}
        />
      </div>

      {/* ── Overlay rouge diagonal — signature visuelle ASNL ── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(110deg, rgba(200,16,46,0.75) 0%, rgba(200,16,46,0.45) 35%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Bas vers noir pour transition avec section suivante */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,10,10,1))",
        }}
      />

      {/* ── Bande blanche verticale décorative ── */}
      <div className="absolute left-0 top-0 bottom-0 z-20 w-1.5 bg-white/20" />
      <div className="absolute left-3 top-0 bottom-0 z-20 w-0.5 bg-white/10" />

      {/* ── Logo watermark côté droit ── */}
      <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 z-[15] w-56 h-56 md:w-80 md:h-80 opacity-[0.08] pointer-events-none">
        <Image
          src="/logo.jpeg"
          alt=""
          fill
          className="object-contain"
          sizes="320px"
          aria-hidden="true"
        />
      </div>

      {/* ── Grain ── */}
      <div
        className="absolute inset-0 z-10 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Contenu ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="w-10 h-0.5 bg-white" />
            <span className="text-white text-xs font-bold uppercase tracking-[0.4em]">
              Saison 2025 – 2026
            </span>
          </motion.div>

          {/* Titre — blanc puis rouge */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-black uppercase leading-none tracking-tighter"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-white text-7xl sm:text-9xl md:text-[9.5rem] drop-shadow-2xl">
              AS Nancy
            </span>
            <span
              className="block text-7xl sm:text-9xl md:text-[9.5rem]"
              style={{
                WebkitTextStroke: "3px white",
                color: "transparent",
              }}
            >
              Lorraine
            </span>
          </motion.h1>

          {/* Sous-titre blanc */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/85 text-base md:text-lg mt-6 mb-10 max-w-lg leading-relaxed font-medium"
          >
            {subtitle ?? "Fondé en 1913. Fier. Lorrain. Irréductible."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-wrap gap-4"
          >
            {/* CTA Billetterie — blanc avec texte rouge */}
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => trackTicketingClick("hero_cta", "Derby vs Metz")}
              className="cta-pulse inline-flex items-center gap-3 bg-white hover:bg-white/90 text-[#C8102E] font-black text-base px-8 py-4 rounded-full transition-all hover:scale-105 uppercase tracking-wider shadow-2xl shadow-black/40"
            >
              <Ticket className="w-5 h-5" />
              Prendre ma place
            </a>
            {/* CTA secondaire — contour blanc */}
            <Link
              href="/medias"
              className="inline-flex items-center gap-3 bg-transparent text-white border-2 border-white/70 hover:bg-white hover:text-[#C8102E] font-bold text-base px-8 py-4 rounded-full transition-all hover:scale-105 uppercase tracking-wider"
            >
              <Play className="w-5 h-5 fill-current" />
              Derniers médias
            </Link>
          </motion.div>
        </div>

        {/* Stats côté droit — sur fond semi-transparent blanc */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="absolute bottom-20 right-4 sm:right-8 flex flex-col gap-1"
        >
          {[
            { value: "2ème", label: "au classement" },
            { value: "48", label: "points" },
            { value: "+18", label: "diff. buts" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-right px-4 py-2"
            >
              <div
                className="text-white text-3xl font-black leading-none drop-shadow-lg"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">{stat.label}</div>
            </div>
          ))}
          {/* Barre rouge à droite des stats */}
          <div className="absolute right-0 top-2 bottom-2 w-0.5 bg-white/40" />
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <span className="text-white/50 text-[10px] uppercase tracking-[0.35em] font-semibold">Découvrir</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
