import { NextRequest, NextResponse } from "next/server";

// Augmente la limite pour les images base64
export const maxDuration = 30;
export const dynamic = "force-dynamic";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import {
  getNextMatch, setNextMatch,
  getNews,      setNews,
  getPlayers,   setPlayers,
  getSponsors,  setSponsors,
  getSiteConfig,setSiteConfig,
  getMatches,   setMatches,
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
    case "matches":   return NextResponse.json(await getMatches());
    case "sections":  return NextResponse.json((await getSiteConfig()).sections ?? {});
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
    case "config":    await setSiteConfig(data);  break;
    case "matches":   await setMatches(data);      break;
    case "sections": {
      const current = await getSiteConfig();
      await setSiteConfig({ ...current, sections: data });
      break;
    }
    default:
      return NextResponse.json({ error: "Section inconnue" }, { status: 400 });
  }

  // Invalide le cache immédiatement sur toutes les pages publiques
  revalidatePath("/");
  revalidatePath("/effectif");
  revalidatePath("/calendrier");
  revalidatePath("/medias");
  revalidatePath("/partenaires");

  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
