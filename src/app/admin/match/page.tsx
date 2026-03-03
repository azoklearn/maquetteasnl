import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getNextMatch } from "@/lib/db";
import MatchEditor from "./MatchEditor";

export const dynamic = "force-dynamic";

export default async function AdminMatchPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const match = await getNextMatch();

  return <MatchEditor initialData={match} username={session.username} />;
}
