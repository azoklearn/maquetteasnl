import type { Metadata } from "next";
import { MediasClient } from "./MediasClient";

export const metadata: Metadata = {
  title: "Médias & Actualités",
  description: "Toute l'actualité de l'AS Nancy Lorraine : articles, photos, vidéos et revue de presse.",
};

export default function MediasPage() {
  return <MediasClient />;
}
