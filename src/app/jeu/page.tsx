import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jeu – Quiz ASNL",
  description: "Testez vos connaissances sur l’AS Nancy Lorraine avec un quiz rapide.",
};

export default function JeuPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <div className="bg-[#111] border-b border-white/5 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.35em]">
            🔴 Quiz ASNL
          </p>
          <h1
            className="text-white text-4xl md:text-6xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Teste tes connaissances
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            5 questions rapides sur l’histoire et l’identité de l’AS Nancy Lorraine. À faire entre
            deux matchs ou à partager avec tes amis supporters.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10 text-white/90 text-sm md:text-base leading-relaxed">
        <section className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-7 space-y-5">
            <h2
              className="text-white text-2xl md:text-3xl font-black uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              🔴 Quiz ASNL
            </h2>

            <ol className="space-y-5 list-decimal list-inside">
              <li>
                <p className="font-semibold mb-1">
                  1. En quelle année a été fondé l’AS Nancy-Lorraine ?
                </p>
                <ul className="space-y-0.5 pl-5 text-white/80">
                  <li>A) 1901</li>
                  <li>B) 1967</li>
                  <li>C) 1920</li>
                  <li>D) 1985</li>
                </ul>
              </li>

              <li>
                <p className="font-semibold mb-1">
                  2. Quel joueur emblématique français a débuté à Nancy ?
                </p>
                <ul className="space-y-0.5 pl-5 text-white/80">
                  <li>A) Zinedine Zidane</li>
                  <li>B) Michel Platini</li>
                  <li>C) Thierry Henry</li>
                  <li>D) Karim Benzema</li>
                </ul>
              </li>

              <li>
                <p className="font-semibold mb-1">
                  3. Quel trophée majeur Nancy a-t-il remporté en 1978 ?
                </p>
                <ul className="space-y-0.5 pl-5 text-white/80">
                  <li>A) Ligue 1</li>
                  <li>B) Coupe de France</li>
                  <li>C) Coupe de la Ligue</li>
                  <li>D) Trophée des Champions</li>
                </ul>
              </li>

              <li>
                <p className="font-semibold mb-1">4. Comment s’appelle le stade de Nancy ?</p>
                <ul className="space-y-0.5 pl-5 text-white/80">
                  <li>A) Parc des Princes</li>
                  <li>B) Stade Geoffroy-Guichard</li>
                  <li>C) Stade Marcel-Picot</li>
                  <li>D) Stade Vélodrome</li>
                </ul>
              </li>

              <li>
                <p className="font-semibold mb-1">
                  5. Quelles sont les couleurs principales du club ?
                </p>
                <ul className="space-y-0.5 pl-5 text-white/80">
                  <li>A) Bleu et blanc</li>
                  <li>B) Rouge et blanc</li>
                  <li>C) Jaune et noir</li>
                  <li>D) Vert et blanc</li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ✅ Réponses
          </h2>
          <ul className="space-y-1 text-white/80">
            <li>
              <span className="font-semibold">1.</span> B) 1967
            </li>
            <li>
              <span className="font-semibold">2.</span> B) Michel Platini
            </li>
            <li>
              <span className="font-semibold">3.</span> B) Coupe de France
            </li>
            <li>
              <span className="font-semibold">4.</span> C) Stade Marcel-Picot
            </li>
            <li>
              <span className="font-semibold">5.</span> B) Rouge et blanc
            </li>
          </ul>
        </section>

        {/* Mini quiz rapide */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ⚡ Mini quiz express
          </h2>
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
            <ol className="space-y-4 list-decimal list-inside">
              <li>
                <p className="font-semibold mb-1">
                  1. Combien de couleurs principales compose le maillot de l’ASNL ?
                </p>
                <p className="text-white/80">Réponse : 2 (rouge et blanc)</p>
              </li>
              <li>
                <p className="font-semibold mb-1">
                  2. Quel est le surnom animal du club sur son logo ?
                </p>
                <p className="text-white/80">Réponse : Le chardon</p>
              </li>
              <li>
                <p className="font-semibold mb-1">
                  3. Dans quelle ville se situe le stade Marcel-Picot ?
                </p>
                <p className="text-white/80">Réponse : Tomblaine (près de Nancy)</p>
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}

