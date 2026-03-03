import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";
import { getAllCmsData } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import { Calendar, ListOrdered, Newspaper, Users, HandHeart, Settings, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const { news, players, sponsors, nextMatch, matches } = await getAllCmsData();

  const cards = [
    {
      href: "/admin/match",
      icon: Calendar,
      label: "Prochain match",
      value: `${nextMatch.homeTeam} vs ${nextMatch.awayTeam}`,
      sub: nextMatch.date,
      color: "from-red-600 to-red-800",
    },
    {
      href: "/admin/calendrier",
      icon: ListOrdered,
      label: "Calendrier",
      value: `${matches.length} matchs`,
      sub: "Ajouter, modifier, scores",
      color: "from-slate-700 to-slate-900",
    },
    {
      href: "/admin/news",
      icon: Newspaper,
      label: "Actualités",
      value: `${news.length} articles`,
      sub: "Créer, éditer, supprimer",
      color: "from-slate-700 to-slate-900",
    },
    {
      href: "/admin/players",
      icon: Users,
      label: "Effectif",
      value: `${players.length} joueurs`,
      sub: "Gérer le groupe",
      color: "from-slate-700 to-slate-900",
    },
    {
      href: "/admin/sponsors",
      icon: HandHeart,
      label: "Partenaires",
      value: `${sponsors.length} partenaires`,
      sub: "Logos & liens",
      color: "from-slate-700 to-slate-900",
    },
    {
      href: "/admin/config",
      icon: Settings,
      label: "Configuration",
      value: "Général",
      sub: "Ticker, réseaux, URLs",
      color: "from-slate-700 to-slate-900",
    },
  ];

  return (
    <AdminShell username={session.username}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Tableau de bord
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Bonjour <span className="text-white font-semibold">@{session.username}</span> — toutes vos modifications sont sauvegardées en temps réel sur Vercel KV.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(({ href, icon: Icon, label, value, sub, color }) => (
            <Link
              key={href}
              href={href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
              <p className="text-white font-black text-lg leading-tight">{value}</p>
              <p className="text-white/40 text-xs mt-0.5">{sub}</p>
            </Link>
          ))}
        </div>

        {/* Info KV */}
        <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm">
            <span className="text-white font-semibold">Stockage :</span>{" "}
            {process.env.KV_REST_API_URL
              ? "✅ Vercel KV connecté — les données persistent entre les déploiements."
              : "⚠️ Vercel KV non configuré — les données sont stockées en mémoire (reset au redémarrage). Ajoute l'intégration KV dans ton dashboard Vercel."}
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
