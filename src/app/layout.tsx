import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/providers/Analytics";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { getSiteConfig, getSponsors } from "@/lib/db";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { GlobalScrollSmoother } from "@/components/ui/GlobalScrollSmoother";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://maquetteasnl.vercel.app"),
  title: {
    default: "AS Nancy Lorraine – Club officiel",
    template: "%s | AS Nancy Lorraine",
  },
  description:
    "Site officiel de l'AS Nancy Lorraine. Actualités, résultats, effectif, billetterie et boutique du club historique de Lorraine.",
  keywords: [
    "AS Nancy Lorraine",
    "ASNL",
    "football",
    "Nancy",
    "Lorraine",
    "Ligue 2 BKT",
    "Stade Marcel Picot",
    "billetterie",
  ],
  openGraph: {
    title: "AS Nancy Lorraine – Club officiel",
    description: "Actualités, résultats, effectif, billetterie et boutique du club historique de Lorraine.",
    url: "https://maquetteasnl.vercel.app",
    siteName: "AS Nancy Lorraine",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "AS Nancy Lorraine" }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AS Nancy Lorraine – Club officiel",
    description: "Le site officiel de l'ASNL",
    creator: "@ASNancyLorraine",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://maquetteasnl.vercel.app",
    languages: { "fr-FR": "https://maquetteasnl.vercel.app" },
  },
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export const viewport: Viewport = {
  themeColor: "#fd0000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, sponsors] = await Promise.all([getSiteConfig(), getSponsors()]);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700&display=swap"
          rel="stylesheet"
        />
        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              name: "AS Nancy Lorraine",
              alternateName: "ASNL",
              url: "https://maquetteasnl.vercel.app",
              logo: "https://maquetteasnl.vercel.app/logo.jpeg",
              foundingDate: "1967",
              sport: "Football",
              location: {
                "@type": "Place",
                name: "Stade Marcel Picot",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Route de Metz",
                  addressLocality: "Tomblaine",
                  addressRegion: "Meurthe-et-Moselle",
                  postalCode: "54510",
                  addressCountry: "FR",
                },
              },
              sameAs: [
                "https://twitter.com/ASNancyLorraine",
                "https://facebook.com/ASNancyLorraine",
                "https://instagram.com/asnancylorraine",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#0A0A0A] text-white antialiased">
        <ThemeProvider>
          <GlobalScrollSmoother />
          <LoadingScreen />
          <Analytics />
          <Header
            tickerEnabled={config.tickerEnabled ?? true}
            tickerMessages={config.tickerMessages}
            ticketingUrl={config.ticketingUrl}
          />
          <main>{children}</main>
          <SponsorsSection
            sponsors={sponsors}
            sectionStyle={config.sections?.sponsors}
          />
          <Footer
            social={config.social}
            ticketingUrl={config.ticketingUrl}
            seasonTicketUrl={config.seasonTicketUrl}
            groupUrl={config.groupUrl}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
