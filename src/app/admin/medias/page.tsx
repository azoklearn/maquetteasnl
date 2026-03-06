import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getMediaVideos, getMediaPhotos } from "@/lib/db";
import MediasEditor from "./MediasEditor";

export const dynamic = "force-dynamic";

export default async function AdminMediasPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const [videos, photos] = await Promise.all([
    getMediaVideos(),
    getMediaPhotos(),
  ]);

  return <MediasEditor initialVideos={videos} initialPhotos={photos} username={session.username} />;
}
