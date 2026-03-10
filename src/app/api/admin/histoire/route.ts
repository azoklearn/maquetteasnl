import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getHistoryConfig, setHistoryConfig } from "@/lib/db";
import type { HistoryConfig } from "@/lib/db";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const config = await getHistoryConfig();
  return NextResponse.json({ config });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  let body: { config?: HistoryConfig };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (body.config) {
    await setHistoryConfig(body.config);
  }

  return NextResponse.json({ ok: true });
}

