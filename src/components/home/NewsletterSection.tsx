"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { trackNewsletterSignup } from "@/lib/analytics";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    trackNewsletterSignup(email);
    setStatus("success");
    setEmail("");
  }

  return (
    /* ── Fond rouge — texte blanc — inversion totale ── */
    <section className="relative bg-[#fd0000] overflow-hidden py-20 md:py-28">

      {/* Texture diagonale blanche subtile */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 30px)",
        }}
      />

      {/* Gros texte fantôme */}
      <div
        className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none overflow-hidden"
      >
        <span
          className="text-white/[0.05] font-black uppercase leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(80px, 15vw, 200px)",
          }}
        >
          ASNL
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── Gauche — texte ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo en haut */}
            <div className="w-16 h-16 relative mb-5">
              <Image src="/logo.jpeg" alt="AS Nancy Lorraine" fill className="object-contain drop-shadow-lg" sizes="64px" />
            </div>
            <span className="text-white/60 text-xs font-bold uppercase tracking-[0.35em] block mb-4">
              Newsletter officielle
            </span>
            <h2
              className="text-white text-5xl md:text-7xl font-black uppercase leading-none mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Rejoignez<br />la famille<br />
              <span
                style={{
                  WebkitTextStroke: "2px white",
                  color: "transparent",
                }}
              >
                ASNL
              </span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Résultats en direct, avant-premières exclusives, offres billetterie prioritaires — directement dans votre boîte mail.
            </p>
          </motion.div>

          {/* ── Droite — formulaire ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/30"
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-[#0A0A0A] font-black text-xl">Bienvenue dans la famille !</p>
                <p className="text-[#0A0A0A]/50 text-sm mt-2">Vous recevrez bientôt nos dernières nouvelles.</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-[#0A0A0A] font-black text-xl mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  S'abonner gratuitement
                </h3>
                <p className="text-[#0A0A0A]/50 text-sm mb-6">Pas de spam. Désabonnement en un clic.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-[#f5f5f5] text-[#0A0A0A] placeholder-[#0A0A0A]/30 border border-[#e5e5e5] focus:outline-none focus:border-[#fd0000] transition-colors text-sm font-medium"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 bg-[#fd0000] hover:bg-[#cc0000] disabled:opacity-60 text-white font-black text-base py-4 rounded-xl transition-colors uppercase tracking-wider"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        S'abonner
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Avantages */}
                <div className="mt-6 flex flex-col gap-2">
                  {["Résultats en direct", "Offres billetterie prioritaires", "Exclusivités club"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-[#0A0A0A]/50 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fd0000]" />
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
