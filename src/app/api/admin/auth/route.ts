import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "asnl2026";

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const session = await getSession();
  session.isLoggedIn = true;
  session.username = username;
  await session.save();

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
