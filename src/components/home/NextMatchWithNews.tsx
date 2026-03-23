"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { NextMatchSection } from "./NextMatchSection";
import { NewsSection } from "./NewsSection";
import type { SectionStyle } from "@/lib/db";
import type { Match, NewsArticle } from "@/types";

interface Props {
  nextMatch?: Match;
  nextMatchStyle?: SectionStyle;
  news: NewsArticle[];
  newsStyle?: SectionStyle;
}

export function NextMatchWithNews({
  nextMatch,
  nextMatchStyle,
  news,
  newsStyle,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const blockOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 1, 0]);
  const blockScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.98]);
  const newsY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      {/* Bloc Next match fixé qui s'estompe */}
      <motion.div
        style={{ opacity: blockOpacity, scale: blockScale }}
        className="sticky top-0"
      >
        <NextMatchSection match={nextMatch} sectionStyle={nextMatchStyle} />
      </motion.div>

      {/* Bloc actualités qui glisse par-dessus */}
      <motion.div
        style={{ y: newsY }}
        className="absolute inset-x-0 top-0 pt-[100vh]"
      >
        <NewsSection articles={news} sectionStyle={newsStyle} />
      </motion.div>
    </section>
  );
}

