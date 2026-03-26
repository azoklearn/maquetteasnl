import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — AS Nancy Lorraine",
  description: "Mentions légales, droits d'auteur, cookies et traitement des données personnelles de l'AS Nancy Lorraine.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h1
          className="text-4xl md:text-6xl font-black uppercase leading-none mb-10"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Mentions légales
        </h1>

        <section className="space-y-4 mb-10">
          <h2 className="text-[#fd0000] text-xs font-bold uppercase tracking-[0.25em]">Éditeur</h2>
          <p className="text-white/80 leading-relaxed">
            Vous êtes actuellement connecté au site internet officiel de l&apos;AS Nancy-Lorraine.
          </p>
          <p className="text-white/80 leading-relaxed">
            Directeur de la publication : Romain TERRIBLE (directeur général adjoint de l&apos;ASNL)
            <br />
            AS Nancy-Lorraine
            <br />
            Stade Marcel-Picot
            <br />
            90 boulevard Jean-Jaurès
            <br />
            54510 Tomblaine
          </p>
          <p className="text-white/80 leading-relaxed">
            Site conçu et réalisé par{" "}
            <a href="https://noanweb.com" target="_blank" rel="noopener noreferrer" className="text-[#fd0000] hover:underline">
              noanweb (noanweb.com)
            </a>
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[#fd0000] text-xs font-bold uppercase tracking-[0.25em]">Droits d&apos;auteur</h2>
          <p className="text-white/80 leading-relaxed">
            Les vidéos, photos, textes et logos contenus sur le site web de l&apos;AS Nancy-Lorraine sont protégés par des droits de propriété intellectuelle détenus par l&apos;AS Nancy-Lorraine.
            Les applications sont protégées par des droits de propriété intellectuelle détenus par des tiers.
          </p>
          <p className="text-white/80 leading-relaxed">
            Crédits photos : ASNL, Pierre Rivière, Dominique Rivière, Emmanuel Jacquel sauf mention contraire.
            Leur extraction est exclusivement réservée à un usage strictement personnel, non collectif et non commercial.
          </p>
          <p className="text-white/80 leading-relaxed">
            Toute autre utilisation, transmission, rediffusion ou reproduction de ces photos, textes, logos et applications
            pour un objet autre que personnel et non commercial, y compris sur un autre site web sans un accord écrit,
            express et préalable de l&apos;AS Nancy-Lorraine est strictement prohibée.
          </p>
          <p className="text-white/80 leading-relaxed">
            Toute reproduction (transfert sur un autre support) ou utilisation de données du site web de l&apos;AS Nancy-Lorraine
            est exclusivement limitée à l&apos;usage personnel et privé des utilisateurs du réseau internet, à l&apos;exclusion
            de toute diffusion notamment à usage commercial.
          </p>
          <p className="text-white/80 leading-relaxed">
            Toute reproduction ou utilisation, même à des fins privées, de la totalité ou d&apos;une partie substantielle des données du
            site web de l&apos;AS Nancy-Lorraine est strictement interdite et susceptible de poursuites conformément aux articles L 343-1
            et suivants du Code de la Propriété intellectuelle, aux règlements nationaux et aux conventions internationales en vigueur.
          </p>
          <p className="text-white/80 leading-relaxed">
            La violation de ces dispositions impératives soumet le contrevenant, et toutes les personnes responsables, aux peines
            pénales et civiles prévues par la Loi.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[#fd0000] text-xs font-bold uppercase tracking-[0.25em]">Information relative aux cookies</h2>
          <p className="text-white/80 leading-relaxed">
            Certaines parties du site implantent un « cookie » dans votre ordinateur. Un cookie ne nous permet pas de vous identifier.
            De manière générale, il enregistre des informations relatives à la navigation de votre ordinateur sur notre site
            (les pages que vous avez consultées, la date et l&apos;heure de la consultation, etc.) que nous pourrons lire lors de vos visites ultérieures.
            Ainsi, vous n&apos;aurez pas besoin de remplir à nouveau les formulaires que nous vous avons proposés.
            La durée de conservation de ces informations dans votre ordinateur est d&apos;un an.
            Vous avez la possibilité de paramétrer votre navigateur pour vous opposer à l&apos;enregistrement de « cookies ».
          </p>
          <p className="text-white/80 leading-relaxed">Paramètres de Gestion de la Confidentialité</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[#fd0000] text-xs font-bold uppercase tracking-[0.25em]">
            Traitement des données personnelles à l&apos;ASNL
          </h2>
          <h3 className="text-white text-lg font-semibold">Généralités</h3>
          <p className="text-white/80 leading-relaxed">
            L&apos;ASNL s&apos;engage à ce que la collecte et le traitement de toutes données personnelles soient conformes à la loi
            informatique et libertés (Loi n° 78-17 du 6 janvier 1978 relative à l&apos;informatique, aux fichiers et aux libertés)
            et au règlement général sur la protection des données personnelles, dit « RGPD » (Règlement n°2016/679).
            Ce texte a instauré un nouveau cadre européen concernant le traitement et la circulation des données à caractère personnel.
          </p>
          <p className="text-white/80 leading-relaxed">Dans le cadre de son activité, l&apos;ASNL est amené à collecter et traiter les données suivantes :</p>
          <ul className="list-disc pl-6 text-white/80 space-y-1">
            <li>Les données personnelles des salariés des entreprises du groupe (SASP, ASNL, ASNL services, ASPL et ASEL).</li>
            <li>Les données personnelles des bénévoles et des licencié(e)s de l&apos;association.</li>
            <li>Les données personnelles transmises dans le cadre de la relation commerciale avec un client ou un fournisseur.</li>
          </ul>

          <h3 className="text-white text-lg font-semibold mt-6">Vos droits</h3>
          <p className="text-white/80 leading-relaxed">
            En qualité de propriétaire de vos données personnelles, vous pouvez obtenir des informations sur les données conservées
            et traitées par l&apos;ASNL vous concernant en contactant le responsable des données personnelles par voie postale
            (Stade Marcel-Picot, 90 boulevard Jean-Jaurès, 54510 Tomblaine) ou par email à{" "}
            <a href="mailto:dpo@asnl.net" className="text-[#fd0000] hover:underline">dpo@asnl.net</a>.
          </p>
          <p className="text-white/80 leading-relaxed">
            Vous pouvez vous opposer au traitement de vos données personnelles ou révoquer votre accord donné à ce traitement à tout moment.
            Si vous souhaitez révoquer votre accord, merci de contacter le responsable des données personnelles en lui indiquant votre demande.
          </p>
        </section>
      </div>
    </main>
  );
}
