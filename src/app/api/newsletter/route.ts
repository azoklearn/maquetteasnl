import { NextRequest, NextResponse } from "next/server";
import { addNewsletterSubscriber } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Email invalide" }, { status: 400 });
    }
    const added = await addNewsletterSubscriber(email);
    return NextResponse.json({ ok: true, alreadySubscribed: !added });
  } catch (e) {
    console.error("[api/newsletter]", e);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  const { getNewsletterConfig } = await import("@/lib/db");
  const config = await getNewsletterConfig();
  return NextResponse.json(config);
}
