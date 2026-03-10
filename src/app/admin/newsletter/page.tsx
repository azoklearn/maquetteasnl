import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getNewsletterConfig, getNewsletterSubscribers } from "@/lib/db";
import NewsletterEditor from "./NewsletterEditor";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const [config, subscribers] = await Promise.all([
    getNewsletterConfig(),
    getNewsletterSubscribers(),
  ]);

  return <NewsletterEditor initialConfig={config} initialSubscribers={subscribers} username={session.username} />;
}
