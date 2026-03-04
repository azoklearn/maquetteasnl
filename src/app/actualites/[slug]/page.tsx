import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { getNews } from "@/lib/db";
import { NEWS } from "@/lib/mock-data";
import { formatShortDate, stripExcerptLinks, markdownLinksToHtml } from "@/lib/utils";
import { ExcerptWithLinks } from "@/components/ui/ExcerptWithLinks";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getNews();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: `${article.title} — ASNL`,
    description: stripExcerptLinks(article.excerpt),
    openGraph: { images: [article.image] },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Match:       "bg-[#fd0000] text-white",
  Transfert:   "bg-blue-600 text-white",
  Billetterie: "bg-amber-500 text-black",
  Club:        "bg-[#0A0A0A] text-white",
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const articles = await getNews();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  // Articles liés (même catégorie, hors article courant)
  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const moreArticles = related.length < 3
    ? [...related, ...articles.filter((a) => a.id !== article.id && !related.find((r) => r.id === a.id)).slice(0, 3 - related.length)]
    : related;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero image ── */}
      <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
        {article.image?.trim() && (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover brightness-60"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/30 to-transparent" />

        {/* Bouton retour */}
        <div className="absolute top-6 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Toutes les actualités
          </Link>
        </div>

        {/* Catégorie + titre sur l'image */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <span className={`inline-flex text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 ${CATEGORY_COLORS[article.category] ?? "bg-white/10 text-white"}`}>
            {article.category}
          </span>
          <h1
            className="text-white font-black uppercase leading-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 5vw, 60px)" }}
          >
            {article.title}
          </h1>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/8">
          <div className="flex items-center gap-1.5 text-white/30 text-sm font-medium">
            <Clock className="w-4 h-4" />
            {formatShortDate(article.publishedAt)}
          </div>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-1.5 text-white/30 text-sm font-medium">
            <Tag className="w-4 h-4" />
            {article.category}
          </div>
        </div>

        {/* Chapeau */}
        <p className="text-white/70 text-lg md:text-xl leading-relaxed font-medium mb-8 border-l-4 border-[#fd0000] pl-5">
          <ExcerptWithLinks text={article.excerpt} linkClassName="text-[#fd0000] hover:underline font-semibold" />
        </p>

        {/* Corps de l'article */}
        {article.content ? (
          <div
            className="prose prose-invert prose-lg max-w-none prose-p:text-white/60 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-a:text-[#fd0000]"
            dangerouslySetInnerHTML={{ __html: markdownLinksToHtml(article.content) }}
          />
        ) : (
          /* Contenu de démonstration si pas de contenu CMS */
          <div className="space-y-5 text-white/55 text-base leading-relaxed">
            <p>
              L&apos;AS Nancy Lorraine continue sur sa belle dynamique de cette saison 2025-2026. Le groupe, 
              solide et soudé, performe match après match et fait le bonheur des supporters qui remplissent 
              le Stade Marcel-Picot à chaque rencontre à domicile.
            </p>
            <p>
              La direction sportive et le staff technique ont su mettre en place un projet de jeu cohérent, 
              alliant pressing haut, transitions rapides et une défense organisée. Les résultats parlent d&apos;eux-mêmes : 
              Nancy figure parmi les meilleures équipes de Ligue 2 cette saison.
            </p>
            <p>
              Les supporters des Chardons peuvent d&apos;ores et déjà regarder l&apos;avenir avec confiance. 
              Le club reste concentré sur ses objectifs et entend bien aller chercher la montée en Ligue 1 
              à l&apos;issue de cette saison historique.
            </p>
          </div>
        )}

        {/* CTA billetterie si catégorie Billetterie */}
        {article.category === "Billetterie" && (
          <div className="mt-10 p-6 rounded-2xl bg-[#fd0000]/10 border border-[#fd0000]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-base">Prenez vos places maintenant</p>
              <p className="text-white/50 text-sm mt-0.5">Disponible sur la billetterie officielle</p>
            </div>
            <a
              href="https://billetterie.asnl.fr"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="shrink-0 bg-[#fd0000] hover:bg-[#cc0000] text-white font-black text-sm px-6 py-3 rounded-xl transition-colors uppercase tracking-wider"
            >
              Billetterie →
            </a>
          </div>
        )}
      </div>

      {/* ── Articles liés ── */}
      {moreArticles.length > 0 && (
        <div className="border-t border-white/5 mt-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <h2
              className="text-white font-black uppercase text-3xl mb-8"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              À lire aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {moreArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/actualites/${a.slug}`}
                  className="group block bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all"
                >
                  <div className="relative h-36 overflow-hidden bg-[#1a1a1a]">
                    {a.image?.trim() && (
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 brightness-75"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`inline-flex text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 ${CATEGORY_COLORS[a.category] ?? "bg-white/10 text-white"}`}>
                      {a.category}
                    </span>
                    <h3 className="text-white text-sm font-bold line-clamp-2 group-hover:text-[#fd0000] transition-colors leading-snug">
                      {a.title}
                    </h3>
                    <p className="text-white/25 text-xs mt-2 font-medium">
                      {formatShortDate(a.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
