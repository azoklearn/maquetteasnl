import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import {
  getNewsletterConfig,
  setNewsletterConfig,
  getNewsletterSubscribers,
} from "@/lib/db";
import type { NewsletterConfig } from "@/lib/db";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const [config, subscribers] = await Promise.all([
    getNewsletterConfig(),
    getNewsletterSubscribers(),
  ]);
  return NextResponse.json({ config, subscribers });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  let body: { config?: NewsletterConfig };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (body.config) {
    await setNewsletterConfig(body.config);
  }

  return NextResponse.json({ ok: true });
}
