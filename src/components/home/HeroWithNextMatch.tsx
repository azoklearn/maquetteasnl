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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.98]);
  const nextMatchY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  return (
    <section ref={containerRef} className="relative h-[220vh] -mt-16 md:-mt-20">
      {/* Hero fixé, qui s'estompe en fin de scroll */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="sticky top-0 h-[100svh]"
      >
        <HeroSection
          subtitle={heroSubtitle}
          season={heroSeason}
          ticketingUrl={ticketingUrl}
          sectionStyle={heroStyle}
          heroBg={heroBg}
          nextMatch={nextMatch}
          nextMatchBgImage={nextMatchStyle?.bgImage}
          news={news}
          latestVideo={latestVideo}
        />
      </motion.div>

      {/* Section prochain match qui glisse par-dessus le hero */}
      <motion.div style={{ y: nextMatchY }} className="relative pt-[100svh]">
        <NextMatchSection match={nextMatch} sectionStyle={nextMatchStyle} />
      </motion.div>

      {/* Espace tampon pour éviter que la section actualités ne remonte sur le prochain match */}
      <div className="h-[40vh]" />
    </section>
  );
}

