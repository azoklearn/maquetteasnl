import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAllCmsData, getMediaVideos, getNewsletterConfig } from "@/lib/db";
import { HeroSection } from "@/components/home/HeroSection";
import { NextMatchSection } from "@/components/home/NextMatchSection";
import { NewsSection } from "@/components/home/NewsSection";
import { PlayersSection } from "@/components/home/PlayersSection";
import { StandingsSection } from "@/components/home/StandingsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { MediasClient } from "@/app/medias/MediasClient";
import { PageScrollEffects } from "@/components/scroll/PageScrollEffects";

// Dynamique — les changements admin apparaissent immédiatement
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AS Nancy Lorraine – Site Officiel",
  description:
    "Bienvenue sur le site officiel de l'AS Nancy Lorraine. Actualités, billetterie, effectif, résultats et boutique du club historique de Lorraine.",
};

export default async function HomePage() {
  const { nextMatch, news, players, sponsors, config, heroBg } = await getAllCmsData();
  const [videos, newsletterConfig] = await Promise.all([
    getMediaVideos(),
    getNewsletterConfig(),
  ]);
  const s = config.sections ?? {};

  const sections: ReactNode[] = [];

  if (s.hero?.visible !== false) {
    sections.push(
      <HeroSection
        subtitle={config?.heroSubtitle ?? "Fondé en 1967. Fier. Lorrain. Irréductible."}
        season={config?.heroSeason ?? "Saison 2025 – 2026"}
        ticketingUrl={config?.ticketingUrl}
        sectionStyle={s.hero}
        heroBg={heroBg}
        nextMatch={nextMatch}
        nextMatchBgImage={s.nextMatch?.bgImage}
        news={news}
        latestVideo={videos[0]}
      />,
    );
  }

  if (s.nextMatch?.visible !== false) {
    sections.push(<NextMatchSection match={nextMatch} sectionStyle={s.nextMatch} />);
  }
  if (s.news?.visible !== false) {
    sections.push(<NewsSection articles={news} sectionStyle={s.news} />);
  }
  if (s.players?.visible !== false) {
    sections.push(<PlayersSection players={players} sectionStyle={s.players} />);
  }
  if (s.standings?.visible !== false) {
    sections.push(<StandingsSection sectionStyle={s.standings} />);
  }

  // Bloc Médias de la page principale, après le classement en direct
  sections.push(<MediasClient />);
  sections.push(<NewsletterSection config={newsletterConfig} />);

  return <PageScrollEffects hijacking={false} animation="scaleDown" sections={sections} />;
}
