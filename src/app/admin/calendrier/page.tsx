import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getMatches } from "@/lib/db";
import CalendrierEditor from "./CalendrierEditor";

export const dynamic = "force-dynamic";

export default async function AdminCalendrierPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const matches = await getMatches();

  return <CalendrierEditor initialData={matches} username={session.username} />;
}
