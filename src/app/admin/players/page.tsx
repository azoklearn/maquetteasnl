import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getPlayers } from "@/lib/db";
import PlayersEditor from "./PlayersEditor";

export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const players = await getPlayers();

  return <PlayersEditor initialData={players} username={session.username} />;
}
