"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Clock } from "lucide-react";

export function BoutiqueComingSoon() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* ── Fond texture ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* ── Gros texte fantôme ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="text-white/[0.03] font-black uppercase leading-none whitespace-nowrap select-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(100px, 18vw, 260px)",
          }}
        >
          BOUTIQUE
        </span>
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Logo */}
        <motion.div
          className="w-24 h-24 rounded-full bg-[#C8102E] flex items-center justify-center mb-8 shadow-2xl shadow-[#C8102E]/30 overflow-hidden p-1.5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative w-full h-full">
            <Image src="/logo.jpeg" alt="ASNL" fill className="object-contain" sizes="96px" />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Clock className="w-3.5 h-3.5" />
          Bientôt disponible
        </motion.div>

        {/* Titre */}
        <motion.h1
          className="text-white font-black uppercase leading-none mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 10vw, 96px)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          Boutique<br />
          <span className="text-[#C8102E]">Officielle</span>
        </motion.h1>

        {/* Texte */}
        <motion.p
          className="text-white/40 text-base leading-relaxed mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          Notre boutique officielle est en cours de préparation. Maillots, écharpes et accessoires aux couleurs de l&apos;ASNL arrivent très bientôt.
        </motion.p>

        {/* CTA retour */}
        <motion.a
          href="/"
          className="flex items-center gap-2.5 bg-[#C8102E] hover:bg-[#A00C24] text-white font-black uppercase tracking-wider px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-[#C8102E]/25"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <ShoppingBag className="w-5 h-5" />
          Retour à l&apos;accueil
        </motion.a>
      </motion.div>
    </div>
  );
}
