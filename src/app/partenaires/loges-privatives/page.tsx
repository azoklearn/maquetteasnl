import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Loges privatives – AS Nancy Lorraine",
  description:
    "Découvrez les loges privatives du Stade Marcel-Picot : espaces premium avec service gastronomique, hôtesse dédiée et vue imprenable sur la pelouse.",
};

export default function LogesPrivativesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="bg-[#111] border-b border-white/5 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-white/40 text-xs font-medium uppercase tracking-[0.25em]">
            Loges privatives
          </p>
          <h1
            className="text-white text-4xl md:text-6xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Loges privatives
          </h1>
          <p className="text-white/40 text-xs">
            Dernière mise à jour le 15/09/2025 à 16:46
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10 text-white/80 text-sm md:text-base leading-relaxed">
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#111] flex items-center justify-center">
          <Image
            src="/loge.jpeg"
            alt="Loge privative au Stade Marcel-Picot"
            width={1200}
            height={675}
            className="w-full h-auto block"
          />
        </div>
        <section className="space-y-4">
          <p>
            Situées au 2ème étage de la tribune Jacquet, 11 loges offrant une vue imprenable sur la
            pelouse, pouvant accueillir jusqu’à 14 personnes sont à votre disposition pour vous
            permettre de partager un moment inoubliable avec vos invités.
          </p>
          <p>
            Produit de prestige dans un cadre raffiné et exclusif. Nouveaux espaces confortables,
            entièrement modernisés et comprenant des services personnalisables, la loge privative
            vous garantit une prestation de qualité.
          </p>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Votre loge au Stade Marcel-Picot
          </h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Loge pour 10 personnes (minimum)</li>
            <li>Hôtesse dédiée</li>
            <li>Service gastronomique</li>
            <li>Cocktails</li>
            <li>Possibilité de personnaliser son espace privatif</li>
            <li>Emplacement &quot;Tribune Box&quot;</li>
            <li>Accès terrasses des loges (lieu d&apos;échanges inter-loges)</li>
            <li>Sièges personnalisés</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Contact commercial
          </h2>
          <p>
            Pour plus de renseignements, contactez notre service commercial par mail ou par
            téléphone&nbsp;:
          </p>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Louis Braconot</span>{" "}
              –{" "}
              <a href="tel:0651380349" className="text-[#fd0000] hover:underline font-semibold">
                06 51 38 03 49
              </a>
            </li>
            <li>
              <span className="font-semibold">Stéphane Giroud</span>{" "}
              –{" "}
              <a href="tel:0685944841" className="text-[#fd0000] hover:underline font-semibold">
                06 85 94 48 41
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

