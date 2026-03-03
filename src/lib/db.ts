/**
 * Couche de données unifiée.
 * - En production Vercel : Vercel KV (Redis)
 * - En dev sans KV configuré : Map en mémoire (reset au redémarrage)
 * Toutes les données du site transitent par ce module.
 */

import type { Match, NewsArticle, Player, Sponsor } from "@/types";
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
} from "@/lib/mock-data";

// ── Types CMS ──────────────────────────────────────────────────────────────────

export interface SiteConfig {
  clubName: string;
  tickerMessages: string[];
  ticketingUrl: string;
  seasonTicketUrl: string;
  groupUrl: string;
  social: { twitter: string; instagram: string; facebook: string; youtube: string };
  heroTitle: string;
  heroSubtitle: string;
}

export interface CmsData {
  nextMatch: Match;
  news: NewsArticle[];
  players: Player[];
  sponsors: Sponsor[];
  config: SiteConfig;
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
  ticketingUrl: TICKETING.nextMatchUrl,
  seasonTicketUrl: TICKETING.seasonTicketUrl,
  groupUrl: TICKETING.groupUrl,
  social: SOCIAL,
  heroTitle: "AS Nancy Lorraine",
  heroSubtitle: "Fondé en 1913. Fier. Lorrain. Irréductible.",
};

// ── KV wrapper ─────────────────────────────────────────────────────────────────

import { Redis } from "@upstash/redis";

const KV_KEYS = {
  nextMatch: "cms:nextMatch",
  news:      "cms:news",
  players:   "cms:players",
  sponsors:  "cms:sponsors",
  config:    "cms:config",
} as const;

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
  try {
    const redis = getRedis();
    if (redis) {
      await redis.set(key, value);
    } else {
      memStore.set(key, JSON.stringify(value));
    }
  } catch (e) {
    console.error("[db] kvSet error", e);
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

export async function getSponsors(): Promise<Sponsor[]> {
  return (await kvGet<Sponsor[]>(KV_KEYS.sponsors)) ?? SPONSORS;
}
export async function setSponsors(sponsors: Sponsor[]) {
  await kvSet(KV_KEYS.sponsors, sponsors);
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return (await kvGet<SiteConfig>(KV_KEYS.config)) ?? DEFAULT_CONFIG;
}
export async function setSiteConfig(cfg: SiteConfig) {
  await kvSet(KV_KEYS.config, cfg);
}

export async function getAllCmsData(): Promise<CmsData> {
  const [nextMatch, news, players, sponsors, config] = await Promise.all([
    getNextMatch(),
    getNews(),
    getPlayers(),
    getSponsors(),
    getSiteConfig(),
  ]);
  return { nextMatch, news, players, sponsors, config };
}
