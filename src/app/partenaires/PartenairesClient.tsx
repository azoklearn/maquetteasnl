"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
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
          <p className="text-white/60 text-xs font-bold uppercase tracking-[0.4em] mb-3">Partenariats</p>
          <h1
            className="text-white text-5xl md:text-7xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Partenaires & sponsors
          </h1>
          <p className="text-white/80 mt-4 text-sm md:text-base max-w-xl">
            Associez votre image à celle d&apos;un club historique et bénéficiez d&apos;une visibilité
            forte au Stade Marcel-Picot, sur nos supports officiels et auprès de toute la
            communauté ASNL.
          </p>
          <p className="mt-4 text-white font-black text-lg md:text-2xl uppercase leading-snug max-w-xl">
            Boostez votre notoriété en vous affichant sur le maillot de l&apos;ASNL&nbsp;!
          </p>
        </div>
      </div>

      {/* ── Bloc offre sponsoring ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start md:items-center">
          <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#111] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/spons.jpeg"
              alt="Visuel sponsoring AS Nancy Lorraine"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          <section className="space-y-4 text-white/80 text-sm md:text-base leading-relaxed">
            <h2
              className="text-white text-lg md:text-xl font-black uppercase tracking-[0.18em] mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Vos bénéfices
            </h2>
            <div className="space-y-3">
              {[
                "Présence émergente du logo de votre entreprise sur l'équipement sportif lors des rencontres du championnat de France domicile et extérieur.",
                "Panneaux numériques LIVE AD (exposition LED face caméra), 6 passages de visibilité minimum par match.",
                "Droit d’utilisation du logo de l’ASNL pour toute action de communication interne ou externe.",
                "Création d’une charte graphique associant le logo de la société partenaire à celle de l’ASNL.",
                "Présence sur le footer du site internet du club (www.asnl.net).",
                "Un spot vidéo sur les écrans géants du stade lors des matchs.",
                "Votre logo sur tous les supports officiels de visibilité du club.",
                "Présence du partenaire et de son logo sur la photo officielle.",
              ].map((item, idx) => (
                <motion.div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#fd0000] shrink-0" />
                  <p>{item}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Contact commercial */}
        <section className="border-t border-white/10 pt-8 max-w-4xl">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Contact commercial
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Pour plus de renseignements, contactez notre service commercial par mail ou par
            téléphone&nbsp;:
          </p>
          <ul className="mt-4 space-y-2 text-white/80 text-sm md:text-base">
            <li>
              <span className="font-semibold">Stéphane Giroud</span>{" "}
              –{" "}
              <a href="tel:0685944841" className="hover:text-[#fd0000] transition-colors">
                06 85 94 48 41
              </a>
            </li>
            <li>
              <span className="font-semibold">Louis Braconot</span>{" "}
              –{" "}
              <a href="tel:0651380349" className="hover:text-[#fd0000] transition-colors">
                06 51 38 03 49
              </a>
            </li>
          </ul>
        </section>
      </div>

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
                  className="group flex flex-col items-center justify-center bg-white rounded-2xl p-4 hover:scale-[1.04] hover:shadow-xl hover:shadow-[#fd0000]/15 transition-all"
                >
                  {sponsor.logo?.trim() ? (
                    <div style={{ width: "100%", height: 80 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                      />
                    </div>
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
