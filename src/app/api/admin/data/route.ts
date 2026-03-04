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
  getStandings, setStandings, clearStandings,
  getHeroBg,    setHeroBg,    clearHeroBg,
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
    case "standings": return NextResponse.json(await getStandings() ?? []);
    case "sections":  return NextResponse.json((await getSiteConfig()).sections ?? {});
    case "heroBg":    return NextResponse.json(await getHeroBg() ?? null);
    default:          return NextResponse.json(await getAllCmsData());
  }
}

// ── POST — sauvegarde une section ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  let body: { section?: string; data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { section, data } = body;

  try {
    switch (section) {
      case "nextMatch": await setNextMatch(data as Parameters<typeof setNextMatch>[0]); break;
      case "news":      await setNews(data as Parameters<typeof setNews>[0]);           break;
      case "players":   await setPlayers(data as Parameters<typeof setPlayers>[0]);    break;
      case "sponsors":  await setSponsors(data as Parameters<typeof setSponsors>[0]);  break;
      case "config":    await setSiteConfig(data as Parameters<typeof setSiteConfig>[0]); break;
      case "matches":   await setMatches(data as Parameters<typeof setMatches>[0]);    break;
      case "standings":
        if (Array.isArray(data) && data.length === 0) await clearStandings(); // reset → retour API live
        else await setStandings(data as Parameters<typeof setStandings>[0]);
        break;
      case "sections": {
        const current = await getSiteConfig();
        await setSiteConfig({ ...current, sections: data as Parameters<typeof setSiteConfig>[0]["sections"] });
        break;
      }
      case "heroBg": {
        if (!data) await clearHeroBg();
        else await setHeroBg(data as { type: "image" | "video"; value: string });
        break;
      }
      default:
        return NextResponse.json({ error: `Section inconnue: "${section}"` }, { status: 400 });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[API] Erreur sauvegarde section="${section}":`, msg);
    return NextResponse.json({ error: `Échec sauvegarde: ${msg}` }, { status: 500 });
  }

  // Invalide le cache immédiatement sur toutes les pages publiques
  revalidatePath("/");
  revalidatePath("/effectif");
  revalidatePath("/calendrier");
  revalidatePath("/medias");
  revalidatePath("/partenaires");
  revalidatePath("/actualites");
  revalidatePath("/api/standings");

  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
