import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteConfig } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionsEditor } from "./SectionsEditor";

export const dynamic = "force-dynamic";

const SESSION_OPTIONS = {
  password: process.env.ADMIN_SECRET ?? "fallback-secret-32-chars-minimum!!",
  cookieName: "asnl_admin_session",
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
};

export default async function AdminSectionsPage() {
  const session = await getIronSession<{ username?: string }>(
    await cookies(),
    SESSION_OPTIONS
  );
  if (!session.username) redirect("/admin/login");

  const config = await getSiteConfig();

  return (
    <AdminShell username={session.username}>
      <SectionsEditor initialData={config.sections} username={session.username} />
    </AdminShell>
  );
}
