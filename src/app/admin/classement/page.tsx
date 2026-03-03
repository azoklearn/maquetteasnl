import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStandings } from "@/lib/db";
import { STANDINGS } from "@/lib/mock-data";
import { StandingsEditor } from "./StandingsEditor";

export const dynamic = "force-dynamic";

const SESSION_OPTIONS = {
  password: process.env.ADMIN_SECRET ?? "fallback-secret-32-chars-minimum!!",
  cookieName: "asnl_admin_session",
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
};

export default async function AdminClassementPage() {
  const session = await getIronSession<{ username?: string }>(
    await cookies(),
    SESSION_OPTIONS,
  );
  if (!session.username) redirect("/admin/login");

  // Classement manuel s'il existe, sinon données mock comme base de départ
  const standings = (await getStandings()) ?? STANDINGS;

  return <StandingsEditor initialData={standings} username={session.username} />;
}
