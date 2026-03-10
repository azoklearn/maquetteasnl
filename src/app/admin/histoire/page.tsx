import { requireAdmin } from "@/lib/session";
import { getHistoryConfig } from "@/lib/db";
import HistoireEditor from "./HistoireEditor";

export const dynamic = "force-dynamic";

export default async function AdminHistoirePage() {
  const session = await requireAdmin();
  if (!session) {
    return null;
  }

  const config = await getHistoryConfig();

  return <HistoireEditor initialConfig={config} username={session.username} />;
}

