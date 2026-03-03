import { NextResponse } from "next/server";
import { STANDINGS } from "@/lib/mock-data";
import { getStandings } from "@/lib/db";
import type { StandingEntry } from "@/types";

// ── Config ────────────────────────────────────────────────────────────────────
// Revalidation côté serveur : les données sont mises en cache 5 min
export const revalidate = 300;

const API_KEY   = process.env.FOOTBALL_API_KEY ?? "";
const LEAGUE_ID = 61;       // Ligue 2 BKT sur api-sports.io
const SEASON    = 2024;     // Saison 2024-2025 (ajuster si besoin)
const ASNL_ID   = 1434;     // ID de l'AS Nancy Lorraine sur API-Football

// ── Types API-Football ─────────────────────────────────────────────────────────
interface ApiTeamStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  form: string; // "WWDLW"
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
}

// ── Transformateur ─────────────────────────────────────────────────────────────
function transformStanding(s: ApiTeamStanding): StandingEntry {
  const formLetters = (s.form ?? "").slice(-5).split("") as ("W" | "D" | "L")[];
  const validForm = formLetters.filter((f): f is "W" | "D" | "L" =>
    f === "W" || f === "D" || f === "L",
  );

  return {
    position:     s.rank,
    team:         s.team.name,
    shortName:    s.team.name.slice(0, 3).toUpperCase(),
    logo:         s.team.logo,
    played:       s.all.played,
    won:          s.all.win,
    drawn:        s.all.draw,
    lost:         s.all.lose,
    goalsFor:     s.all.goals.for,
    goalsAgainst: s.all.goals.against,
    goalDiff:     s.goalsDiff,
    points:       s.points,
    form:         validForm.length ? validForm : [],
    isASNL:       s.team.id === ASNL_ID || s.team.name.toLowerCase().includes("nancy"),
  };
}

// ── Handler GET ────────────────────────────────────────────────────────────────
export async function GET() {
  // ── Priorité 1 : classement sauvegardé manuellement dans KV ──
  try {
    const manual = await getStandings();
    if (manual && manual.length > 0) {
      return NextResponse.json(
        { standings: manual, source: "manual", updatedAt: new Date().toISOString() },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
      );
    }
  } catch { /* ignore, continue to API */ }

  // ── Pas de clé API → renvoie les données mock ──
  if (!API_KEY || API_KEY === "your_api_key_here") {
    return NextResponse.json(
      { standings: STANDINGS, source: "mock", updatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  }

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/standings?league=${LEAGUE_ID}&season=${SEASON}`,
      {
        headers: {
          "x-apisports-key": API_KEY,
        },
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      throw new Error(`API-Football a répondu avec le statut ${res.status}`);
    }

    const json = await res.json();

    // Vérification erreurs API-Football
    if (json.errors && Object.keys(json.errors).length > 0) {
      throw new Error(JSON.stringify(json.errors));
    }

    const rawStandings: ApiTeamStanding[] =
      json?.response?.[0]?.league?.standings?.[0] ?? [];

    if (!rawStandings.length) {
      throw new Error("Aucune donnée de classement reçue");
    }

    const standings: StandingEntry[] = rawStandings.map(transformStanding);

    return NextResponse.json(
      { standings, source: "live", updatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (err) {
    console.error("[/api/standings] Erreur :", err);

    // Fallback propre sur les données mock
    return NextResponse.json(
      {
        standings: STANDINGS,
        source:    "fallback",
        error:     err instanceof Error ? err.message : "Erreur inconnue",
        updatedAt: new Date().toISOString(),
      },
      {
        status: 200, // On ne renvoie pas 500 pour ne pas casser le widget
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  }
}
