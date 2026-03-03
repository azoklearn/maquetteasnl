import type { Metadata } from "next";
import { getMatches } from "@/lib/db";
import { CalendrierClient } from "./CalendrierClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Calendrier & Résultats",
  description: "Calendrier complet et résultats de l'AS Nancy Lorraine. Prochains matchs et billetterie.",
};

export default async function CalendrierPage() {
  const matches = await getMatches();
  return <CalendrierClient matches={matches} />;
}
