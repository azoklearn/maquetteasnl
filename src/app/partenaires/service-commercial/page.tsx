import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service commercial – AS Nancy Lorraine",
  description:
    "Contacts du pôle commercial, hospitalité, sponsoring, visibilité, séminaires et billetterie de l'AS Nancy Lorraine.",
};

export default function ServiceCommercialPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="bg-[#111] border-b border-white/5 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.35em] mb-3">
            Partenariats
          </p>
          <h1
            className="text-white text-4xl md:text-6xl font-black uppercase leading-none mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Le service commercial
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            Retrouvez ici tous les contacts des équipes commerciales de l&apos;ASNL : sponsoring,
            hospitalités, séminaires et billetterie.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        <section className="space-y-3 text-white/80 text-sm md:text-base leading-relaxed">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Pôle commercial, hospitalité, sponsoring et visibilité
          </h2>
          <p>
            Pôle commercial, hospitalité, sponsoring et visibilité :{" "}
            <span className="font-semibold">
              Jonathan Libert, Stéphane Giroud, Louis Braconot
            </span>
          </p>
        </section>

        <section className="space-y-3 text-white/80 text-sm md:text-base leading-relaxed border-t border-white/10 pt-6">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Pôle séminaire et billetterie
          </h2>
          <p>
            Pôle séminaire et billetterie :{" "}
            <span className="font-semibold">Aurélia Brandao</span>
          </p>
        </section>

        <section className="space-y-4 text-white/80 text-sm md:text-base leading-relaxed border-t border-white/10 pt-6">
          <h3
            className="text-white text-xl md:text-2xl font-black uppercase mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Contacter notre service commercial, hospitalité, sponsoring et visibilité
          </h3>
          <p>
            Mail :{" "}
            <a
              href="mailto:j.libert@asnl.net"
              className="text-[#fd0000] hover:underline font-semibold"
            >
              j.libert@asnl.net
            </a>
            ,{" "}
            <a
              href="mailto:s.giroud@asnl.net"
              className="text-[#fd0000] hover:underline font-semibold"
            >
              s.giroud@asnl.net
            </a>{" "}
            et{" "}
            <a
              href="mailto:l.braconot@asnl.net"
              className="text-[#fd0000] hover:underline font-semibold"
            >
              l.braconot@asnl.net
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 text-white/80 text-sm md:text-base leading-relaxed border-t border-white/10 pt-6">
          <h3
            className="text-white text-xl md:text-2xl font-black uppercase mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Contacter notre service séminaire et billetterie
          </h3>
          <p>
            Mail :{" "}
            <a
              href="mailto:seminaires@asnl.net"
              className="text-[#fd0000] hover:underline font-semibold"
            >
              seminaires@asnl.net
            </a>
          </p>
          <p>
            Téléphone :{" "}
            <a href="tel:0383183097" className="text-[#fd0000] hover:underline font-semibold">
              03 83 18 30 97
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

