import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import {
  getNextMatch, setNextMatch,
  getNews,      setNews,
  getPlayers,   setPlayers,
  getSponsors,  setSponsors,
  getSiteConfig,setSiteConfig,
  getAllCmsData,
} from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}

// ── GET — récupère toutes les données ou une section ──────────────────────────
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const section = req.nextUrl.searchParams.get("section");

  switch (section) {
    case "nextMatch": return NextResponse.json(await getNextMatch());
    case "news":      return NextResponse.json(await getNews());
    case "players":   return NextResponse.json(await getPlayers());
    case "sponsors":  return NextResponse.json(await getSponsors());
    case "config":    return NextResponse.json(await getSiteConfig());
    default:          return NextResponse.json(await getAllCmsData());
  }
}

// ── POST — sauvegarde une section ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { section, data } = await req.json();

  switch (section) {
    case "nextMatch": await setNextMatch(data); break;
    case "news":      await setNews(data);      break;
    case "players":   await setPlayers(data);   break;
    case "sponsors":  await setSponsors(data);  break;
    case "config":    await setSiteConfig(data);break;
    default:
      return NextResponse.json({ error: "Section inconnue" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
