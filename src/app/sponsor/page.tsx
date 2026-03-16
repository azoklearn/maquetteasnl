import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Devenir sponsor – AS Nancy Lorraine",
  description:
    "Découvrez les avantages de sponsoring avec l'AS Nancy Lorraine : visibilité maillot, panneaux LED, communication, supports officiels et plus encore.",
};

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="relative bg-[#111] border-b border-white/5 py-16 md:py-20 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.35em] mb-3">
            Partenariats
          </p>
          <h1
            className="text-white text-4xl md:text-6xl font-black uppercase leading-none mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Devenir sponsor de l&apos;ASNL
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            Associez votre image à celle d&apos;un club historique et bénéficiez d&apos;une visibilité
            forte au Stade Marcel-Picot, sur nos supports officiels et auprès de toute la
            communauté ASNL.
          </p>
          <p className="mt-6 text-white font-black text-xl md:text-2xl uppercase leading-snug max-w-2xl">
            Boostez votre notoriété en vous affichant sur le maillot de l&apos;ASNL&nbsp;!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        {/* Visuel sponsor */}
        <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden border border-white/10 bg-[#111]">
          <Image
            src="/spons.jpeg"
            alt="Visuel sponsoring AS Nancy Lorraine"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <section className="space-y-4 text-white/80 text-sm md:text-base leading-relaxed">
          <p>
            Présence émergente du logo de votre entreprise sur l&apos;équipement sportif lors des
            rencontres du championnat de France domicile et extérieur.
          </p>
          <p>
            Panneaux numériques LIVE AD (exposition LED face caméra), 6 passages de visibilité
            minimum par match.
          </p>
          <p>
            Droit d’utilisation du logo de l’ASNL pour toute action de communication interne ou
            externe.
          </p>
          <p>
            Création d’une charte graphique associant le logo de la société partenaire à celle de
            l’ASNL.
          </p>
          <p>
            Présence sur le footer du site internet du club (www.asnl.net).
          </p>
          <p>
            Un spot vidéo sur les écrans géants du stade lors des matchs.
          </p>
          <p>
            Votre logo sur tous les supports officiels de visibilité du club.
          </p>
          <p>
            Présence du partenaire et de son logo sur la photo officielle.
          </p>
        </section>

        <section className="border-t border-white/10 pt-8">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Contact commercial
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Pour plus de renseignements, contactez notre service commercial par mail ou par
            téléphone&nbsp;:
          </p>
          <ul className="mt-4 space-y-2 text-white/80 text-sm md:text-base">
            <li>
              <span className="font-semibold">Stéphane Giroud</span>{" "}
              –{" "}
              <a href="tel:0685944841" className="hover:text-[#fd0000] transition-colors">
                06 85 94 48 41
              </a>
            </li>
            <li>
              <span className="font-semibold">Louis Braconot</span>{" "}
              –{" "}
              <a href="tel:0651380349" className="hover:text-[#fd0000] transition-colors">
                06 51 38 03 49
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

