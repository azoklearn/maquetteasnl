import { NextResponse } from "next/server";
import { STANDINGS } from "@/lib/mock-data";
import { getStandings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const manual = await getStandings();
    if (manual && manual.length > 0) {
      return NextResponse.json({ standings: manual, source: "manual", updatedAt: new Date().toISOString() });
    }
  } catch { /* ignore */ }

  return NextResponse.json({ standings: STANDINGS, source: "mock", updatedAt: new Date().toISOString() });
}
