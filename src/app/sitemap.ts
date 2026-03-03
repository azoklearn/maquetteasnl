import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://maquetteasnl.vercel.app";
  const now = new Date();

  const staticRoutes = [
    { url: base, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${base}/effectif`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/calendrier`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${base}/histoire`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${base}/partenaires`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${base}/medias`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${base}/boutique`, priority: 0.7, changeFrequency: "weekly" as const },
  ];

  return staticRoutes.map(({ url, priority, changeFrequency }) => ({
    url,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
