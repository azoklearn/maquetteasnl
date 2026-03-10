"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { trackNewsletterSignup } from "@/lib/analytics";
import type { NewsletterConfig } from "@/lib/db";

const DEFAULTS = {
  subtitle: "Newsletter officielle",
  title: "Rejoignez\nla famille\nASNL",
  description: "Résultats en direct, avant-premières exclusives, offres billetterie prioritaires — directement dans votre boîte mail.",
  formTitle: "S'abonner gratuitement",
  formSubtitle: "Pas de spam. Désabonnement en un clic.",
  successTitle: "Bienvenue dans la famille !",
  successMessage: "Vous recevrez bientôt nos dernières nouvelles.",
  benefits: ["Résultats en direct", "Offres billetterie prioritaires", "Exclusivités club"],
  bgColor: "#fd0000",
  accentColor: "#fd0000",
  textColor: "#ffffff",
};

export function NewsletterSection({ config }: { config: NewsletterConfig | null }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "already">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const c = config ?? {};
  const subtitle = c.subtitle ?? DEFAULTS.subtitle;
  const title = (c.title ?? DEFAULTS.title).split("\n");
  const description = c.description ?? DEFAULTS.description;
  const formTitle = c.formTitle ?? DEFAULTS.formTitle;
  const formSubtitle = c.formSubtitle ?? DEFAULTS.formSubtitle;
  const successTitle = c.successTitle ?? DEFAULTS.successTitle;
  const successMessage = c.successMessage ?? DEFAULTS.successMessage;
  const benefits = (c.benefits?.length ? c.benefits : DEFAULTS.benefits) as string[];
  const bgColor = c.bgColor ?? DEFAULTS.bgColor;
  const accentColor = c.accentColor ?? DEFAULTS.accentColor;
  const textColor = c.textColor ?? DEFAULTS.textColor;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error ?? "Une erreur est survenue.");
        return;
      }
      if (data.alreadySubscribed) {
        setStatus("already");
        setEmail("");
        return;
      }
      trackNewsletterSignup(email);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Erreur de connexion.");
    }
  }

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 30px)",
        }}
      />

      <div
        className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none overflow-hidden"
      >
        <span
          className="font-black uppercase leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(80px, 15vw, 200px)",
            color: `${textColor}0D`,
          }}
        >
          ASNL
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 relative mb-5">
              <Image src="/logo.jpeg" alt="AS Nancy Lorraine" fill className="object-contain drop-shadow-lg" sizes="64px" />
            </div>
            <span
              className="text-xs font-bold uppercase tracking-[0.35em] block mb-4"
              style={{ color: `${textColor}99` }}
            >
              {subtitle}
            </span>
            <h2
              className="text-5xl md:text-7xl font-black uppercase leading-none mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: textColor }}
            >
              {title.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < title.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: `${textColor}B3` }}
            >
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/30"
            style={{ ["--accent" as string]: accentColor } as React.CSSProperties}
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
                <p className="text-[#0A0A0A] font-black text-xl">{successTitle}</p>
                <p className="text-[#0A0A0A]/50 text-sm mt-2">{successMessage}</p>
              </motion.div>
            ) : status === "already" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <p className="text-[#0A0A0A] font-bold text-lg">Vous êtes déjà inscrit !</p>
                <p className="text-[#0A0A0A]/50 text-sm mt-2">Cet email figure déjà dans notre liste.</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-[#0A0A0A] font-black text-xl mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {formTitle}
                </h3>
                <p className="text-[#0A0A0A]/50 text-sm mb-6">{formSubtitle}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-[#f5f5f5] text-[#0A0A0A] placeholder-[#0A0A0A]/30 border border-[#e5e5e5] focus:outline-none focus:border-2 focus:border-[var(--accent)] transition-colors text-sm font-medium"
                  />
                  {status === "error" && (
                    <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 disabled:opacity-60 text-white font-black text-base py-4 rounded-xl transition-colors uppercase tracking-wider"
                    style={{ backgroundColor: accentColor }}
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

                <div className="mt-6 flex flex-col gap-2">
                  {benefits.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-[#0A0A0A]/50 font-medium">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
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
