import type { Metadata } from "next";
import { BoutiqueComingSoon } from "./BoutiqueClient";

export const metadata: Metadata = {
  title: "Boutique — Bientôt disponible",
  description: "La boutique officielle de l'AS Nancy Lorraine arrive bientôt. Restez connectés.",
};

export default function BoutiquePage() {
  return <BoutiqueComingSoon />;
}
