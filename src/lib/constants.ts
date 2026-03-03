export const CLUB = {
  name: "AS Nancy Lorraine",
  shortName: "ASNL",
  founded: 1913,
  stadium: "Stade Marcel Picot",
  city: "Nancy",
  country: "France",
  colors: { primary: "#C8102E", secondary: "#FFFFFF" },
};

export const TICKETING = {
  baseUrl: "https://billetterie.asnl.fr",
  nextMatchUrl: "https://billetterie.asnl.fr/prochain-match",
  seasonTicketUrl: "https://billetterie.asnl.fr/abonnements",
  groupUrl: "https://billetterie.asnl.fr/groupes",
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
  { label: "Médias", href: "/medias" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Boutique", href: "/boutique" },
];

export const NEXT_MATCH = {
  id: "m-001",
  homeTeam: "AS Nancy Lorraine",
  awayTeam: "FC Metz",
  date: "2026-03-14",
  time: "20:00",
  competition: "Ligue 2 BKT",
  stadium: "Stade Marcel Picot",
  isHome: true,
  ticketingUrl: "https://billetterie.asnl.fr/prochain-match",
  isHighProfile: true,
  status: "upcoming" as const,
};
