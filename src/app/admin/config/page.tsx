import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getSiteConfig } from "@/lib/db";
import ConfigEditor from "./ConfigEditor";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const config = await getSiteConfig();

  return <ConfigEditor initialData={config} username={session.username} />;
}
