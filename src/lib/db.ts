/**
 * Couche de données unifiée.
 * - En production Vercel : Vercel KV (Redis)
 * - En dev sans KV configuré : Map en mémoire (reset au redémarrage)
 * Toutes les données du site transitent par ce module.
 */

import type { Match, NewsArticle, Player, Sponsor, StandingEntry, MediaVideo, MediaPhoto, StaffMember } from "@/types";
import {
  NEXT_MATCH,
  TICKETING,
  CLUB,
  SOCIAL,
  NAVIGATION,
} from "@/lib/constants";
import {
  PLAYERS,
  NEWS,
  STANDINGS,
  MATCHES,
  SPONSORS,
  STAFF_MEMBERS,
} from "@/lib/mock-data";


// ── Types CMS ──────────────────────────────────────────────────────────────────

export interface SectionStyle {
  title?: string;
  subtitle?: string;
  bgColor?: string;
  bgImage?: string;
  /** Voile dégradé sur l'image de fond (section Prochain match) */
  overlayTopColor?: string;
  overlayTopOpacity?: number;
  overlayBottomColor?: string;
  overlayBottomOpacity?: number;
  overlayDirection?: number;
  /** Voile dégradé du hero (overlay diagonal sur fond vidéo/image) */
  heroOverlayTopColor?: string;
  heroOverlayTopOpacity?: number;
  heroOverlayBottomColor?: string;
  heroOverlayBottomOpacity?: number;
  heroOverlayDirection?: number;
  /** Couleurs des cartes liquid glass du hero */
  heroGlassBgColor?: string;
  heroGlassBgOpacity?: number;
  heroGlassTextColor?: string;
  textColor?: string;
  accentColor?: string;
  titleSize?: "sm" | "md" | "lg" | "xl";
  visible?: boolean;
}

export interface SiteConfig {
  clubName: string;
  tickerEnabled?: boolean;
  tickerMessages: string[];
  ticketingUrl: string;
  seasonTicketUrl: string;
  groupUrl: string;
  social: { twitter: string; instagram: string; facebook: string; youtube: string };
  heroTitle: string;
  heroSubtitle: string;
  heroSeason: string;
  sections?: {
    hero?:       SectionStyle;
    nextMatch?:  SectionStyle;
    news?:       SectionStyle;
    players?:    SectionStyle;
    standings?:  SectionStyle;
    sponsors?:   SectionStyle;
  };
}

export interface HeroBg {
  type: "image" | "video";
  value: string; // URL externe ou base64 pour image
}

export interface HistoryEvent {
  year: string;
  title: string;
  desc: string;
  trophy?: boolean;
}

export interface HistoryConfig {
  heroSubtitle?: string;
  heroImage?: string;
  timeline: HistoryEvent[];
}

/** Bloc du contenu email (newsletter envoyée aux abonnés) */
export type EmailBlock =
  | { id: string; type: "logo"; url?: string }
  | { id: string; type: "heading"; content: string; level?: 1 | 2 }
  | { id: string; type: "text"; content: string }
  | { id: string; type: "image"; url: string; alt?: string }
  | { id: string; type: "divider" }
  | { id: string; type: "button"; label: string; url: string }
  | { id: string; type: "html"; content: string };

export interface NewsletterConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  benefits?: string[];
  formTitle?: string;
  formSubtitle?: string;
  successTitle?: string;
  successMessage?: string;
  bgColor?: string;
  accentColor?: string;
  textColor?: string;
  /** Couleur de fond générale du mail */
  emailBgColor?: string;
  /** Couleur de fond de la carte centrale du mail */
  emailCardBgColor?: string;
  /** Couleur du texte des paragraphes dans le mail */
  emailTextColor?: string;
  /** Couleur des titres dans le mail */
  emailHeadingColor?: string;
  sendDay?: number; // 0=dimanche, 1=lundi...
  sendTime?: string; // "10:00"
  /** Sujet du mail envoyé aux abonnés */
  emailSubject?: string;
  /** Blocs du contenu email (logo, texte, images, etc.) */
  emailBlocks?: EmailBlock[];
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string; // ISO date
}

export interface CmsData {
  nextMatch: Match;
  news: NewsArticle[];
  players: Player[];
  staff: StaffMember[];
  sponsors: Sponsor[];
  config: SiteConfig;
  matches: Match[];
  standings: StandingEntry[] | null;
  heroBg: HeroBg | null;
}

// ── Valeurs par défaut ─────────────────────────────────────────────────────────

const DEFAULT_CONFIG: SiteConfig = {
  clubName: CLUB.name,
  tickerMessages: [
    "⚽ Nancy 3-0 Valenciennes",
    "🎟️ DERBY vs METZ — 14 MARS — PLACES LIMITÉES",
    "🏆 LIGUE 2 J27 — ASNL 3ème au classement",
    "📣 Diego Santos prolonge jusqu'en 2028",
    "🔥 Choc de la saison le 14 mars à Marcel Picot",
  ],
  ticketingUrl:    TICKETING.nextMatchUrl,
  seasonTicketUrl: TICKETING.seasonTicketUrl,
  groupUrl:        TICKETING.groupUrl,
  social: SOCIAL,
  heroTitle: "AS Nancy Lorraine",
  heroSubtitle: "Fondé en 1967. Fier. Lorrain. Irréductible.",
  heroSeason: "Saison 2025 – 2026",
};

// ── KV wrapper ─────────────────────────────────────────────────────────────────

import { Redis } from "@upstash/redis";

const KV_KEYS = {
  nextMatch: "cms:nextMatch",
  news:      "cms:news",
  players:   "cms:players",
  staff:     "cms:staff",
  sponsors:  "cms:sponsors",
  config:    "cms:config",
  matches:   "cms:matches",
  standings: "cms:standings",
  heroBg:    "cms:heroBg",
  mediaVideos: "cms:mediaVideos",
  mediaPhotos: "cms:mediaPhotos",
  newsletterConfig: "cms:newsletterConfig",
  newsletterSubscribers: "cms:newsletterSubscribers",
  history: "cms:history",
} as const;

const DEFAULT_VIDEOS: MediaVideo[] = [
  { id: "v1", title: "Nancy 2 - 0 Caen", competition: "Ligue 2 BKT · J24", date: "22 fév. 2025", thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", duration: "4:32", youtubeId: "" },
  { id: "v2", title: "Nancy 1 - 1 Amiens", competition: "Ligue 2 BKT · J23", date: "15 fév. 2025", thumbnail: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&q=80", duration: "5:10", youtubeId: "" },
  { id: "v3", title: "Rodez 0 - 2 Nancy", competition: "Ligue 2 BKT · J22", date: "8 fév. 2025", thumbnail: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800&q=80", duration: "3:58", youtubeId: "" },
  { id: "v4", title: "Nancy 3 - 1 Gueugnon", competition: "Ligue 2 BKT · J21", date: "1 fév. 2025", thumbnail: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80", duration: "6:02", youtubeId: "" },
  { id: "v5", title: "Dunkerque 0 - 1 Nancy", competition: "Ligue 2 BKT · J20", date: "25 jan. 2025", thumbnail: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80", duration: "4:45", youtubeId: "" },
  { id: "v6", title: "Nancy 2 - 2 Troyes", competition: "Ligue 2 BKT · J19", date: "18 jan. 2025", thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80", duration: "5:28", youtubeId: "" },
];

const DEFAULT_PHOTOS: MediaPhoto[] = [
  { id: "p1", src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=85", caption: "Nancy - Caen · J24", category: "Match" },
  { id: "p2", src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=85", caption: "Entraînement · Semaine 8", category: "Entraînement" },
  { id: "p3", src: "https://images.unsplash.com/photo-1551958219-acbc595d4023?w=1200&q=85", caption: "Supporters · Virages", category: "Supporters" },
  { id: "p4", src: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=85", caption: "Stade Marcel-Picot · Nuit", category: "Stade" },
  { id: "p5", src: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&q=85", caption: "Rodez - Nancy · J22", category: "Match" },
  { id: "p6", src: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&q=85", caption: "Nancy - Gueugnon · But de J.Diallo", category: "Match" },
  { id: "p7", src: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=85", caption: "Nancy - Troyes · J19", category: "Match" },
  { id: "p8", src: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&q=85", caption: "Dunkerque - Nancy · J20", category: "Match" },
  { id: "p9", src: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1200&q=85", caption: "Séance de tir au but · Entraînement", category: "Entraînement" },
];

const DEFAULT_HISTORY: HistoryConfig = {
  heroSubtitle: "Depuis 1967",
  heroImage: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80",
  timeline: [
    { year: "1967", title: "Fondation de l'ASNL", desc: "L'AS Nancy-Lorraine est fondée pour succéder au FC Nancy. Le rouge et le blanc s'imposent comme couleurs emblématiques du club lorrain." },
    { year: "1973", title: "Première montée en Division 1", desc: "Le club accède pour la première fois à l'élite du football français. Une page historique s'écrit pour la Lorraine." },
    { year: "1978", title: "🏆 Coupe de France", desc: "Sacre historique en Coupe de France. Premier grand titre du club, l'ASNL entre définitivement dans la légende du football français.", trophy: true },
    { year: "1979", title: "Finale de Coupe de France", desc: "Retour en finale de la Coupe de France. Le club confirme son statut de grand club français de l'époque." },
    { year: "2005", title: "Champion de Ligue 2", desc: "Champion de Ligue 2 et retour en Ligue 1 après quelques années d'absence. La renaissance lorraine est en marche." },
    { year: "2006", title: "🏆 Coupe de la Ligue", desc: "Victoire en Coupe de la Ligue, deuxième titre majeur du club. L'ASNL s'offre une qualification historique pour l'Europe.", trophy: true },
    { year: "2006–2007", title: "Coupe UEFA", desc: "Participation à la Coupe UEFA, aventure européenne inédite pour le club. Nancy représente la Lorraine sur la scène continentale." },
    { year: "2016", title: "Champion de Ligue 2", desc: "Nouveau titre de champion de Ligue 2 et retour en Ligue 1. Le club prouve une nouvelle fois sa résilience." },
    { year: "2022", title: "Relégation en National", desc: "Difficile relégation en National. Mais le club lorrain reste debout et se donne pour mission de retrouver le monde professionnel." },
  ],
};

// Fallback en mémoire pour dev sans KV configuré
const memStore = new Map<string, string>();

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  if (!_redis) {
    _redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return _redis;
}

async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    if (redis) {
      const val = await redis.get<T>(key);
      return val ?? null;
    }
    const v = memStore.get(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch (e) {
    console.error("[db] kvGet error", e);
    return null;
  }
}

async function kvSet<T>(key: string, value: T): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(key, value); // laisse l'erreur remonter si Redis échoue
  } else {
    memStore.set(key, JSON.stringify(value));
  }
}

// ── API publique ───────────────────────────────────────────────────────────────

export async function getNextMatch(): Promise<Match> {
  return (await kvGet<Match>(KV_KEYS.nextMatch)) ?? NEXT_MATCH;
}
export async function setNextMatch(m: Match) {
  await kvSet(KV_KEYS.nextMatch, m);
}

export async function getNews(): Promise<NewsArticle[]> {
  return (await kvGet<NewsArticle[]>(KV_KEYS.news)) ?? NEWS;
}
export async function setNews(articles: NewsArticle[]) {
  await kvSet(KV_KEYS.news, articles);
}

export async function getPlayers(): Promise<Player[]> {
  return (await kvGet<Player[]>(KV_KEYS.players)) ?? PLAYERS;
}
export async function setPlayers(players: Player[]) {
  await kvSet(KV_KEYS.players, players);
}

export async function getStaff(): Promise<StaffMember[]> {
  return (await kvGet<StaffMember[]>(KV_KEYS.staff)) ?? STAFF_MEMBERS;
}
export async function setStaff(staff: StaffMember[]) {
  await kvSet(KV_KEYS.staff, staff);
}

export async function getSponsors(): Promise<Sponsor[]> {
  return (await kvGet<Sponsor[]>(KV_KEYS.sponsors)) ?? SPONSORS;
}
export async function setSponsors(sponsors: Sponsor[]) {
  await kvSet(KV_KEYS.sponsors, sponsors);
}

export async function getMatches(): Promise<Match[]> {
  return (await kvGet<Match[]>(KV_KEYS.matches)) ?? MATCHES;
}
export async function setMatches(matches: Match[]) {
  await kvSet(KV_KEYS.matches, matches);
}

/** Retourne null si aucun classement manuel n'a été sauvegardé (laisse l'API live prendre le relais) */
export async function getStandings(): Promise<StandingEntry[] | null> {
  return await kvGet<StandingEntry[]>(KV_KEYS.standings);
}
export async function setStandings(standings: StandingEntry[]) {
  await kvSet(KV_KEYS.standings, standings);
}
export async function clearStandings() {
  const redis = getRedis();
  if (redis) await redis.del(KV_KEYS.standings);
  else memStore.delete(KV_KEYS.standings);
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return (await kvGet<SiteConfig>(KV_KEYS.config)) ?? DEFAULT_CONFIG;
}
export async function setSiteConfig(cfg: SiteConfig) {
  await kvSet(KV_KEYS.config, cfg);
}

export async function getHeroBg(): Promise<HeroBg | null> {
  return await kvGet<HeroBg>(KV_KEYS.heroBg);
}
export async function setHeroBg(bg: HeroBg) {
  await kvSet(KV_KEYS.heroBg, bg);
}
export async function clearHeroBg() {
  const redis = getRedis();
  if (redis) await redis.del(KV_KEYS.heroBg);
  else memStore.delete(KV_KEYS.heroBg);
}

export async function getMediaVideos(): Promise<MediaVideo[]> {
  return (await kvGet<MediaVideo[]>(KV_KEYS.mediaVideos)) ?? DEFAULT_VIDEOS;
}
export async function setMediaVideos(videos: MediaVideo[]) {
  await kvSet(KV_KEYS.mediaVideos, videos);
}

export async function getMediaPhotos(): Promise<MediaPhoto[]> {
  return (await kvGet<MediaPhoto[]>(KV_KEYS.mediaPhotos)) ?? DEFAULT_PHOTOS;
}
export async function setMediaPhotos(photos: MediaPhoto[]) {
  await kvSet(KV_KEYS.mediaPhotos, photos);
}

const DEFAULT_EMAIL_BLOCKS: EmailBlock[] = [
  { id: "logo1", type: "logo", url: "/logo.jpeg" },
  { id: "h1", type: "heading", content: "Bienvenue dans la famille ASNL !", level: 1 },
  { id: "t1", type: "text", content: "Retrouvez chaque semaine les actualités du club : résultats, exclusivités, offres billetterie et bien plus." },
  { id: "btn1", type: "button", label: "Voir le site", url: "https://asnl.fr" },
  { id: "div1", type: "divider" },
  { id: "t2", type: "text", content: "À très bientôt au stade Marcel-Picot !" },
];

const DEFAULT_NEWSLETTER_CONFIG: NewsletterConfig = {
  title: "Rejoignez\nla famille\nASNL",
  subtitle: "Newsletter officielle",
  description: "Résultats en direct, avant-premières exclusives, offres billetterie prioritaires — directement dans votre boîte mail.",
  benefits: ["Résultats en direct", "Offres billetterie prioritaires", "Exclusivités club"],
  formTitle: "S'abonner gratuitement",
  formSubtitle: "Pas de spam. Désabonnement en un clic.",
  successTitle: "Bienvenue dans la famille !",
  successMessage: "Vous recevrez bientôt nos dernières nouvelles.",
  bgColor: "#fd0000",
  accentColor: "#fd0000",
  textColor: "#ffffff",
  emailBgColor: "#0A0A0A",
  emailCardBgColor: "#111111",
  emailTextColor: "#e5e5e5",
  emailHeadingColor: "#ffffff",
  sendDay: 1, // lundi
  sendTime: "10:00",
  emailSubject: "Newsletter ASNL — Actualités du club",
  emailBlocks: DEFAULT_EMAIL_BLOCKS,
};

export async function getNewsletterConfig(): Promise<NewsletterConfig> {
  return (await kvGet<NewsletterConfig>(KV_KEYS.newsletterConfig)) ?? DEFAULT_NEWSLETTER_CONFIG;
}
export async function setNewsletterConfig(cfg: NewsletterConfig) {
  await kvSet(KV_KEYS.newsletterConfig, cfg);
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  return (await kvGet<NewsletterSubscriber[]>(KV_KEYS.newsletterSubscribers)) ?? [];
}
export async function addNewsletterSubscriber(email: string): Promise<boolean> {
  const subs = await getNewsletterSubscribers();
  const normalized = email.trim().toLowerCase();
  if (subs.some((s) => s.email.toLowerCase() === normalized)) return false;
  subs.push({ email: normalized, subscribedAt: new Date().toISOString() });
  await kvSet(KV_KEYS.newsletterSubscribers, subs);
  return true;
}

export async function getHistoryConfig(): Promise<HistoryConfig> {
  return (await kvGet<HistoryConfig>(KV_KEYS.history)) ?? DEFAULT_HISTORY;
}
export async function setHistoryConfig(cfg: HistoryConfig) {
  await kvSet(KV_KEYS.history, cfg);
}

export async function getAllCmsData(): Promise<CmsData> {
  const [nextMatch, news, players, staff, sponsors, config, matches, standings, heroBg] = await Promise.all([
    getNextMatch(),
    getNews(),
    getPlayers(),
    getStaff(),
    getSponsors(),
    getSiteConfig(),
    getMatches(),
    getStandings(),
    getHeroBg(),
  ]);
  return { nextMatch, news, players, staff, sponsors, config, matches, standings, heroBg };
}
