import { NextResponse } from "next/server";
import { getHistoryConfig } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getHistoryConfig();
  return NextResponse.json(config);
}

