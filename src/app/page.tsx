import type { Metadata } from "next";
import { getAllCmsData } from "@/lib/db";
import { HeroSection } from "@/components/home/HeroSection";
import { NextMatchSection } from "@/components/home/NextMatchSection";
import { NewsSection } from "@/components/home/NewsSection";
import { PlayersSection } from "@/components/home/PlayersSection";
import { StandingsSection } from "@/components/home/StandingsSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

// Dynamique — les changements admin apparaissent immédiatement
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AS Nancy Lorraine – Site Officiel",
  description:
    "Bienvenue sur le site officiel de l'AS Nancy Lorraine. Actualités, billetterie, effectif, résultats et boutique du club historique de Lorraine.",
};

export default async function HomePage() {
  const { nextMatch, news, players, sponsors, config, heroBg } = await getAllCmsData();
  const s = config.sections ?? {};

  return (
    <>
      {s.hero?.visible !== false && (
        <HeroSection subtitle={config.heroSubtitle} season={config.heroSeason} ticketingUrl={config.ticketingUrl} sectionStyle={s.hero} heroBg={heroBg} />
      )}
      {s.nextMatch?.visible !== false && (
        <NextMatchSection match={nextMatch} sectionStyle={s.nextMatch} />
      )}
      {s.news?.visible !== false && (
        <NewsSection articles={news} sectionStyle={s.news} />
      )}
      {s.players?.visible !== false && (
        <PlayersSection players={players} sectionStyle={s.players} />
      )}
      {s.standings?.visible !== false && (
        <StandingsSection sectionStyle={s.standings} />
      )}
      {s.sponsors?.visible !== false && (
        <SponsorsSection sponsors={sponsors} sectionStyle={s.sponsors} />
      )}
      <NewsletterSection />
    </>
  );
}
