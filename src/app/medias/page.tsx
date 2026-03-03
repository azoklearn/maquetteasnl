import type { Metadata } from "next";
import { MediasClient } from "./MediasClient";

export const metadata: Metadata = {
  title: "Médias — Photos & Vidéos",
  description: "Galerie photos et résumés vidéo des matchs de l'AS Nancy Lorraine.",
};

export default function MediasPage() {
  return <MediasClient />;
}
