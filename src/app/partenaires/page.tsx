import type { Metadata } from "next";
import { getSponsors } from "@/lib/db";
import { PartenairesClient } from "./PartenairesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Les partenaires officiels de l'AS Nancy Lorraine.",
};

export default async function PartenairesPage() {
  const sponsors = await getSponsors();
  return <PartenairesClient sponsors={sponsors} />;
}
