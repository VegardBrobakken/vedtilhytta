export function Delivery() {
  return (
    <div className="grid items-start gap-10 py-8 sm:py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold text-forest-800">Levering</h1>
        <div className="mt-6 space-y-4 text-gray-600">
          <p>
            Vi gjør vårt beste for å tilpasse leveringstidspunktet etter dine
            ønsker. Har du et ønsket tidspunkt, strekker vi oss langt for å
            finne en løsning som passer.
          </p>
          <p>
            Dersom vi ikke har avtalt et spesifikt leveringstidspunkt, leverer
            vi bestillingen så raskt som mulig etter at den er mottatt. Vi
            legger vekt på god service, tydelig kommunikasjon og pålitelige
            leveranser – slik at du kan være trygg på at veden kommer når du
            trenger den.
          </p>
          <p>
            Vi leverer til Gjøvik, Lillehammer, Hamar, Ringsaker, lygna,
            Lygnasæter, Toten, Søndre land, Nordre land og omegn.
          </p>
        </div>
      </div>
      <img
        src="/img/IMG_0325.jpeg"
        alt="Kvalitetsved fra Fossum Vestre Gård, stablet ved en hytte"
        className="aspect-[4/3] w-full rounded-lg object-cover shadow-sm"
      />
    </div>
  );
}
