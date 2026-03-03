import type { Metadata } from "next";
import { CalendrierClient } from "./CalendrierClient";

export const metadata: Metadata = {
  title: "Calendrier & Résultats",
  description: "Calendrier complet et résultats de l'AS Nancy Lorraine. Prochains matchs et billetterie.",
};

export default function CalendrierPage() {
  return <CalendrierClient />;
}
