export function Products() {
  return (
    <div className="grid items-start gap-10 py-8 sm:py-12 md:grid-cols-2">
    <div>
      <h1 className="text-3xl font-bold text-forest-800">Veden vår</h1>
      <div className="mt-6 space-y-4 text-gray-600">
        <p>
          På Fossum Vestre Gård i Gjøvik produserer vi tørr kvalitetsved fra
          bærekraftig, lokalt skogbruk. Hele prosessen - fra skogen til ferdi g
          ved - utføres av oss. Vi står selv for produksjon, tørking, pakking og
          utlevering, slik at vi kan sikre høy kvalitet i alle ledd.
        </p>
        <p>
          Vi brenner for kortreist ved og mener at norske hytter og hjem bør
          varmes opp med lokale ressurser - ikke ved som er importert fra
          utlandet. Ved å velge lokal ved reduseres transporten, samtidig som du
          støtter bærekraftig skogbruk og lokal verdiskaping.
        </p>
        <p>
          Vår ved er godt tørket og klar til bruk, og vi legger stor vekt på
          pålitelig service, god kvalitet og fornøyde kunder. Når du handler hos
          oss, vet du hvor veden kommer fra - og hvem som har produsert den.
        </p>
      </div>
    </div>
    <img
      src="/img/IMG_0664.jpeg"
      alt="Kvalitetsved fra Fossum Vestre Gård, stablet ved en hytte"
      className="aspect-[4/3] w-full rounded-lg object-cover shadow-sm"
    />
    </div>
  );
}
