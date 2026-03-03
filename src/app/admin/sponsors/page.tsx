import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getSponsors } from "@/lib/db";
import SponsorsEditor from "./SponsorsEditor";

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const sponsors = await getSponsors();

  return <SponsorsEditor initialData={sponsors} username={session.username} />;
}
