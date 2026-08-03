function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1l-2.2 2.2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4.2V18h16V8.2l-8 5-8-5ZM4 6l8 5 8-5H4Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-100">
      <div className="mx-auto grid max-w-4xl gap-12 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-white uppercase">
            <PinIcon /> Leveringsområder
          </h3>
          <p className="text-sm text-forest-200">
            Vi leverer til Gjøvik, Lillehammer, Hamar, Ringsaker, lygna,
            Lygnasæter, Toten, Søndre land, Nordre land og omegn
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">
            Kontakt oss
          </h3>
          <ul className="space-y-2 text-sm text-forest-200">
            <li className="flex items-center gap-2">
              <PhoneIcon /> +47 949 76 409
            </li>
            <li className="flex items-center gap-2">
              <MailIcon /> post@vedtilhytta.no
            </li>
            <li className="flex items-center gap-2">
              <PinIcon /> Fossum Vestre Gård, Gjøvik
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">
            Om oss
          </h3>
          <p className="text-sm text-forest-200">
            Vi er en lokal produsent som er opptatt av kvalitet, pålitelighet og
            fornøyde hytteeiere.
          </p>
        </div>
      </div>

      <div className="border-t border-forest-800">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-forest-300 sm:px-6">
          © {new Date().getFullYear()} vedtilhytta.no | 931 462 385
        </div>
      </div>
    </footer>
  );
}
