import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.asnl.fr" },
      { protocol: "https", hostname: "via.placeholder.com" },
      // Logos officiels API-Football
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "media.api-football.com" },
      { protocol: "https", hostname: "media.footystats.org" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
