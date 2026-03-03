import type { Metadata } from "next";
import { PartenairesClient } from "./PartenairesClient";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Devenez partenaire de l'AS Nancy Lorraine. Visibilité nationale, activation fans, packages premium.",
};

export default function PartenairesPage() {
  return <PartenairesClient />;
}
