import type { Metadata } from "next";
import { BoutiqueClient } from "./BoutiqueClient";

export const metadata: Metadata = {
  title: "Boutique Officielle",
  description: "La boutique officielle de l'AS Nancy Lorraine. Maillots, écharpes, accessoires aux couleurs de l'ASNL.",
};

export default function BoutiquePage() {
  return <BoutiqueClient />;
}
