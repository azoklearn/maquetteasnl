"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, Newspaper, Users, Trophy,
  HandHeart, Settings, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",               label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/match",         label: "Prochain match",  icon: Calendar },
  { href: "/admin/calendrier",    label: "Calendrier",      icon: Trophy },
  { href: "/admin/news",          label: "Actualités",      icon: Newspaper },
  { href: "/admin/players",       label: "Effectif",        icon: Users },
  { href: "/admin/sponsors",      label: "Partenaires",     icon: HandHeart },
  { href: "/admin/config",        label: "Configuration",   icon: Settings },
];

interface Props { username?: string; children: React.ReactNode }

export default function AdminShell({ username = "admin", children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const sidebar = (
    <aside className="flex flex-col h-full bg-[#0A0A0A] border-r border-white/5 w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-white/5">
        <div className="w-10 h-10 relative shrink-0">
          <Image src="/logo.jpeg" alt="ASNL" fill className="object-contain" sizes="40px" />
        </div>
        <div>
          <p className="text-white font-black text-sm uppercase tracking-widest leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>ASNL Admin</p>
          <p className="text-white/30 text-xs">@{username}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <p className="text-white/20 text-xs font-bold uppercase tracking-wider px-3 mb-3">Contenu</p>
        <ul className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    active
                      ? "bg-[#C8102E] text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white text-xs hover:bg-white/5 transition-all mb-1"
        >
          Voir le site public →
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 text-sm hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#111] text-white overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden md:flex shrink-0">{sidebar}</div>

      {/* Sidebar mobile (drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex flex-col h-full w-64">{sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar mobile */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-white/5 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
          <p className="text-white font-black text-sm uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>ASNL Admin</p>
          <div className="w-9" />
        </header>

        {/* Contenu */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
