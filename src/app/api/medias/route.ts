import { NextResponse } from "next/server";
import { getMediaVideos, getMediaPhotos } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [videos, photos] = await Promise.all([
      getMediaVideos(),
      getMediaPhotos(),
    ]);
    return NextResponse.json({ videos, photos, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.error("[api/medias]", e);
    return NextResponse.json({ videos: [], photos: [], error: "Erreur" }, { status: 500 });
  }
}
