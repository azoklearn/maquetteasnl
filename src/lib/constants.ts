export const CLUB = {
  name: "AS Nancy Lorraine",
  shortName: "ASNL",
  founded: 1967,
  stadium: "Stade Marcel Picot",
  city: "Nancy",
  country: "France",
  colors: { primary: "#fd0000", secondary: "#FFFFFF" },
};

export const TICKETING = {
  baseUrl: "https://asnlbillets.net",
  nextMatchUrl: "https://asnlbillets.net/(S(3efueez1h0f5lm3ypektwljn))/Pages/PSpectacles.aspx",
  seasonTicketUrl: "https://asnlbillets.net/(S(3efueez1h0f5lm3ypektwljn))/Pages/PSpectacles.aspx",
  groupUrl: "https://asnlbillets.net/(S(3efueez1h0f5lm3ypektwljn))/Pages/PSpectacles.aspx",
};

export const SOCIAL = {
  twitter: "https://twitter.com/ASNancyLorraine",
  instagram: "https://instagram.com/asnancylorraine",
  facebook: "https://facebook.com/ASNancyLorraine",
  youtube: "https://youtube.com/@ASNancyLorraine",
  tiktok: "https://tiktok.com/@asnancylorraine",
};

export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "G-XXXXXXXXXX";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "000000000000000";

export const NAVIGATION = [
  { label: "Le Club", href: "/histoire" },
  { label: "Effectif", href: "/effectif" },
  { label: "Calendrier", href: "/calendrier" },
  { label: "Actualités", href: "/actualites" },
  { label: "Médias", href: "/medias" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Boutique", href: "/boutique" },
];

import type { Match } from "@/types";

export const NEXT_MATCH: Match = {
  id: "m-001",
  homeTeam: "AS Nancy Lorraine",
  awayTeam: "FC Metz",
  date: "2026-03-14",
  time: "20:00",
  competition: "Ligue 2 BKT",
  stadium: "Stade Marcel Picot",
  isHome: true,
  ticketingUrl: "https://asnlbillets.net/(S(3efueez1h0f5lm3ypektwljn))/Pages/PSpectacles.aspx",
  isHighProfile: true,
  status: "upcoming",
};
