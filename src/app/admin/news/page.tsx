import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getNews } from "@/lib/db";
import NewsEditor from "./NewsEditor";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const news = await getNews();

  return <NewsEditor initialData={news} username={session.username} />;
}
