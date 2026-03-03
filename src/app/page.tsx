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
  const { nextMatch, news, players, sponsors, config } = await getAllCmsData();

  return (
    <>
      <HeroSection title={config.heroTitle} subtitle={config.heroSubtitle} ticketingUrl={config.ticketingUrl} />
      <NextMatchSection match={nextMatch} />
      <NewsSection articles={news} />
      <PlayersSection players={players} />
      <StandingsSection />
      <SponsorsSection sponsors={sponsors} />
      <NewsletterSection />
    </>
  );
}
