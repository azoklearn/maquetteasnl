import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getStaff } from "@/lib/db";
import StaffEditor from "./StaffEditor";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const staff = await getStaff();

  return <StaffEditor initialData={staff} username={session.username} />;
}

