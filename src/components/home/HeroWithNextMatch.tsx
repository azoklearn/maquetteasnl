"use client";

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
  return (
    <section className="relative">
      {/* Slide 1 : Hero */}
      <div className="sticky top-0 z-10 h-[100svh]">
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
      </div>

      {/* Slide 2 : Prochain match qui remplace le Hero */}
      <div className="sticky top-0 z-20 min-h-[100svh]">
        <NextMatchSection match={nextMatch} sectionStyle={nextMatchStyle} />
      </div>
    </section>
  );
}

