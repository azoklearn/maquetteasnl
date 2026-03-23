"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroSection } from "./HeroSection";
import { NextMatchSection } from "./NextMatchSection";
import type { SectionStyle, HeroBg } from "@/lib/db";
import type { Match, NewsArticle, MediaVideo } from "@/types";

interface Props {
  heroSubtitle?: string;
  heroSeason?: string;
  ticketingUrl?: string;
  heroStyle?: SectionStyle;
  heroBg?: HeroBg | null;
  nextMatch?: Match;
  nextMatchStyle?: SectionStyle;
  news?: NewsArticle[];
  latestVideo?: MediaVideo | null;
}

export function HeroWithNextMatch({
  heroSubtitle,
  heroSeason,
  ticketingUrl,
  heroStyle,
  heroBg,
  nextMatch,
  nextMatchStyle,
  news = [],
  latestVideo,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.985]);
  // Le prochain match monte puis reste en place avant d'enchaîner sur les actus.
  const nextMatchY = useTransform(scrollYProgress, [0, 0.55, 1], ["100%", "0%", "0%"]);

  return (
    <section ref={containerRef} className="relative h-[260vh] -mt-16 md:-mt-20">
      {/* Hero fixé, qui s'estompe en fin de scroll */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="sticky top-0 z-10 h-[100svh]"
      >
        <HeroSection
          subtitle={heroSubtitle}
          season={heroSeason}
          ticketingUrl={ticketingUrl}
          sectionStyle={heroStyle}
          heroBg={heroBg}
          // On masque le bloc prochain match du Hero pour garder
          // une seule transition claire vers la section dédiée.
          nextMatch={undefined}
          nextMatchBgImage={nextMatchStyle?.bgImage}
          news={news}
          latestVideo={latestVideo}
        />
      </motion.div>

      {/* Section prochain match qui glisse par-dessus le hero */}
      <motion.div style={{ y: nextMatchY }} className="relative z-20 pt-[100svh]">
        <NextMatchSection match={nextMatch} sectionStyle={nextMatchStyle} />
      </motion.div>
    </section>
  );
}

