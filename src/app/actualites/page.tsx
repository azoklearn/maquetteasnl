import type { Metadata } from "next";
import { getNews } from "@/lib/db";
import { ActualitesClient } from "./ActualitesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actualités — AS Nancy Lorraine",
  description: "Toutes les actualités de l'AS Nancy Lorraine : résultats, transferts, billetterie et vie du club.",
};

export default async function ActualitesPage() {
  const articles = await getNews();
  return <ActualitesClient articles={articles} />;
}
