function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-forest-800">{title}</h2>
      <div className="mt-3 space-y-4 text-gray-600">{children}</div>
    </section>
  );
}

export function Privacy() {
  return (
    <div className="max-w-3xl py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-forest-800">
        Personvernerklæring
      </h1>
      <p className="mt-6 text-gray-600">
        Denne erklæringen forklarer hvilke personopplysninger vi samler inn når
        du bestiller ved hos oss, hva vi bruker dem til, og hvilke rettigheter
        du har.
      </p>

      <Section title="Hvem er behandlingsansvarlig">
        <p>
          Ved til hytta, Fossum Vestre Gård, Gjøvik (organisasjonsnummer 931 462
          385), er ansvarlig for behandlingen av personopplysningene som samles
          inn via dette nettstedet. Har du spørsmål, kan du kontakte oss på{" "}
          <a
            href="mailto:post@vedtilhytta.no"
            className="text-forest-700 underline underline-offset-2 hover:text-forest-900"
          >
            post@vedtilhytta.no
          </a>{" "}
          eller telefon{" "}
          <a
            href="tel:+4794976409"
            className="text-forest-700 underline underline-offset-2 hover:text-forest-900"
          >
            +47 949 76 409
          </a>
          .
        </p>
      </Section>

      <Section title="Hvilke opplysninger vi samler inn">
        <p>
          Vi samler kun inn opplysningene du selv fyller inn i
          bestillingsskjemaet:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>navn</li>
          <li>e-postadresse</li>
          <li>telefonnummer</li>
          <li>leveringsadresse</li>
          <li>ønsket leveringstidspunkt</li>
          <li>eventuelle instrukser til sjåføren</li>
          <li>hvilke produkter du bestiller</li>
        </ul>
        <p>
          Vi samler ikke inn andre opplysninger om deg når du besøker sidene på
          nettstedet.
        </p>
      </Section>

      <Section title="Hva vi bruker opplysningene til">
        <p>
          Opplysningene brukes til å behandle og levere bestillingen din, og til
          å kontakte deg om leveringen.
        </p>
        <p>
          Vi bruker ikke opplysningene til markedsføring, profilering eller
          automatiserte avgjørelser, og vi selger dem ikke videre.
        </p>
      </Section>

      <Section title="Informasjonskapsler (cookies)">
        <p>
          Nettstedet bruker ingen informasjonskapsler, og vi har ingen verktøy
          for analyse, statistikk eller sporing. Vi har heller ingen innebygde
          elementer fra tredjeparter, som videospillere, kart eller
          delingsknapper. Derfor får du heller ingen dialog om samtykke til
          informasjonskapsler her.
        </p>
        <p>
          Den eneste lagringen som skjer i nettleseren, er en teknisk
          påloggingsnøkkel for oss som administrerer nettstedet. Den lagres bare
          hos den som logger inn, og er nødvendig for at innloggingen skal
          fungere.
        </p>
      </Section>

      <Section title="Hvem vi deler opplysningene med">
        <p>
          Vi bruker noen leverandører som behandler opplysninger på våre vegne,
          etter databehandleravtale:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-gray-700">Web3Forms</span> –
            sender bestillingen fra skjemaet videre til vår e-postadresse.
          </li>
          <li>
            <span className="font-medium text-gray-700">
              Google Firebase (Google Ireland Limited)
            </span>{" "}
            – lagrer bestillingene slik at vi kan følge dem opp.
          </li>
        </ul>
        <p>
          Disse leverandørene kan behandle opplysninger utenfor EØS.
          Overføringen skjer i så fall på grunnlag av EU-kommisjonens standard
          personvernbestemmelser eller annet gyldig overføringsgrunnlag.
        </p>
      </Section>

      <Section title="Endringer">
        <p>
          Vi kan oppdatere denne erklæringen dersom tjenestene eller regelverket
          endrer seg. Gjeldende versjon ligger alltid her.
        </p>
        <p className="text-sm text-gray-500">Sist oppdatert 5. august 2026.</p>
      </Section>
    </div>
  );
}
