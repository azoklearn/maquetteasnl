import Link from "next/link";
import Image from "next/image";
import { Ticket, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { CLUB, SOCIAL, TICKETING } from "@/lib/constants";
import { FooterNewsletter } from "./FooterNewsletter";
import type { SiteConfig } from "@/lib/db";

interface FooterProps {
  social?: SiteConfig["social"];
  ticketingUrl?: string;
  seasonTicketUrl?: string;
  groupUrl?: string;
}

export function Footer({ social, ticketingUrl, seasonTicketUrl, groupUrl }: FooterProps) {
  const s = social ?? SOCIAL;
  const tUrl = ticketingUrl ?? TICKETING.nextMatchUrl;
  const sUrl = seasonTicketUrl ?? TICKETING.seasonTicketUrl;
  const gUrl = groupUrl ?? TICKETING.groupUrl;

  const footerLinks = {
    Club: [
      { label: "Histoire", href: "/histoire" },
      { label: "Effectif", href: "/effectif" },
      { label: "Staff technique", href: "/effectif#staff" },
      { label: "Palmarès", href: "/histoire#palmares" },
    ],
    Compétitions: [
      { label: "Calendrier", href: "/calendrier" },
      { label: "Résultats", href: "/calendrier#resultats" },
      { label: "Classement", href: "/calendrier#classement" },
    ],
    Services: [
      { label: "Billetterie", href: tUrl, external: true },
      { label: "Abonnements", href: sUrl, external: true },
      { label: "Groupes", href: gUrl, external: true },
      { label: "Boutique", href: "/boutique" },
    ],
    Infos: [
      { label: "Médias / Presse", href: "/medias" },
      { label: "Partenaires", href: "/partenaires" },
      { label: "Stade Marcel Picot", href: "/stade" },
      { label: "Contact", href: "/contact" },
    ],
  };
  return (
    <footer className="bg-[#0A0A0A]">

      {/* ── Bande rouge supérieure ── */}
      <div className="bg-[#fd0000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p
              className="text-white font-black text-2xl uppercase leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Restez dans la course
            </p>
            <p className="text-white/70 text-sm mt-1">Ne manquez aucune actualité de l'ASNL</p>
          </div>
          <FooterNewsletter />
        </div>
      </div>

      {/* ── Corps du footer — fond noir ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Branding */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 relative shrink-0">
                <Image
                  src="/logo.jpeg"
                  alt="AS Nancy Lorraine"
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
              <div>
                <div className="text-white font-black text-sm leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  AS Nancy
                </div>
                <div className="text-[#fd0000] text-[10px] font-bold uppercase tracking-[0.2em]">
                  Lorraine
                </div>
              </div>
            </Link>
            <p className="text-white/30 text-xs leading-relaxed mb-6">
              Fondé en {CLUB.founded}.<br />
              {CLUB.stadium}, {CLUB.city}.
            </p>

            {/* Réseaux — icônes rouges au hover */}
            <div className="flex gap-2">
              {[
                { href: s.instagram, icon: Instagram, label: "Instagram" },
                { href: s.twitter, icon: Twitter, label: "Twitter" },
                { href: s.facebook, icon: Facebook, label: "Facebook" },
                { href: s.youtube, icon: Youtube, label: "YouTube" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#fd0000] transition-colors flex items-center justify-center text-white/40 hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.25em] mb-5" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-white/35 hover:text-[#fd0000] text-sm transition-colors flex items-center gap-1.5 font-medium"
                      >
                        {link.label === "Billetterie" && <Ticket className="w-3 h-3 text-[#fd0000]" />}
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-white/35 hover:text-white text-sm transition-colors font-medium">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Barre de bas ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25 font-medium">
          <p>© {new Date().getFullYear()} AS Nancy Lorraine. Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link href="/mentions-legales" className="hover:text-white/60 transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white/60 transition-colors">Confidentialité</Link>
            <Link href="/cookies" className="hover:text-white/60 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
