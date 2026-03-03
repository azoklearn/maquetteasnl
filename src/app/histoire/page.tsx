import type { Metadata } from "next";
import { HistoireClient } from "./HistoireClient";

export const metadata: Metadata = {
  title: "Histoire du club",
  description: "Découvrez l'histoire centenaire de l'AS Nancy Lorraine, fondée en 1913. Palmarès, moments iconiques et légendes du club.",
};

export default function HistoirePage() {
  return <HistoireClient />;
}
