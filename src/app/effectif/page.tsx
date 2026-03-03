import type { Metadata } from "next";
import { getPlayers } from "@/lib/db";
import { EffectifClient } from "./EffectifClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Effectif",
  description: "Découvrez l'effectif complet de l'AS Nancy Lorraine : joueurs, positions, statistiques de la saison 2025-2026.",
  openGraph: {
    title: "Effectif 2025-26 | AS Nancy Lorraine",
    description: "L'effectif complet de l'ASNL — joueurs, gardiens, défenseurs, milieux et attaquants.",
  },
};

export default async function EffectifPage() {
  const players = await getPlayers();
  return <EffectifClient players={players} />;
}
