import { useEffect, useState } from 'react'
import { Link } from '../components/Link'
import { subscribeItems } from '../lib/items'
import type { ItemForSaleDoc } from '../types/ItemForSale'

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`grid place-items-center bg-gray-200 text-xs font-medium tracking-wide text-gray-400 uppercase dark:bg-gray-800 dark:text-gray-500 ${className ?? ''}`}
    >
      Bilde
    </div>
  )
}

const features = [
  {
    label: 'Tørr ved og klar til bruk',
    text: 'Tørr bjørkeved av høy kvalitet. Klevd og klar til bruk.',
    // Pile of 3 stacked logs, angled
    icon: (
      <g transform="rotate(-30 12 12)">
        {/* bottom log */}
        <path d="M5 15h10" />
        <path d="M5 20h10" />
        <path d="M5 15a1.4 2.5 0 0 0 0 5" />
        <ellipse cx="15" cy="17.5" rx="1.4" ry="2.5" />
        {/* middle log */}
        <path d="M5 9.5h10" />
        <path d="M5 14.5h10" />
        <path d="M5 9.5a1.4 2.5 0 0 0 0 5" />
        <ellipse cx="15" cy="12" rx="1.4" ry="2.5" />
        {/* top log */}
        <path d="M5 4h10" />
        <path d="M5 9h10" />
        <path d="M5 4a1.4 2.5 0 0 0 0 5" />
        <ellipse cx="15" cy="6.5" rx="1.4" ry="2.5" />
      </g>
    ),
  },
  {
    label: 'Levering til hytta',
    text: 'Vi leverer til Hafjell, Sjusjøen, Skeikampen og omegn.',
    // Delivery truck
    icon: (
      <>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    ),
  },
  {
    label: 'Enkel bestilling',
    text: 'Bestill ved på nett på få minutter. Vi ordner resten.',
    // Receipt
    icon: (
      <>
        <path d="M6 3h12v18l-2.4-1.5-2.4 1.5-2.4-1.5-2.4 1.5-2.4-1.5z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
      </>
    ),
  },
  {
    label: 'Bærekraftig',
    text: 'Kortreist ved fra bærekraftig lokalt skogbruk.',
    // Leaf
    icon: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </>
    ),
  },
]

/** Format a NOK price like 1490 as "1 490,-". */
function formatPrice(price: number) {
  return `${price.toLocaleString('nb-NO')},-`
}

export function Home() {
  const [products, setProducts] = useState<ItemForSaleDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(
    () =>
      subscribeItems((items) => {
        setProducts(items)
        setLoading(false)
      }),
    [],
  )

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <ImagePlaceholder className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/70 to-forest-900/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Ved til hytta – enkelt og trygt
            </h1>
            <p className="mt-4 text-lg text-forest-100">
              Tørr ved og klar til bruk
            </p>
            <p className="mt-2 text-forest-100">
              Kortreist ved fra bærekraftig lokalt skogbruk.
            </p>
            <p className="mt-4 text-forest-100">
              Vi leverer til Hafjell, Sjusjøen, Synnfjellet, Skeikampen og omegn.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/bestill"
                className="rounded-md bg-forest-600 px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase hover:bg-forest-500"
              >
                Bestill ved
              </Link>
              <Link
                to="/priser"
                className="rounded-md border border-white/70 px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase hover:bg-white/10"
              >
                Se priser
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature bar */}
      <section className="bg-forest-50 dark:bg-forest-950/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.label} className="text-center">
              <svg
                className="mx-auto mb-3 text-forest-700 dark:text-forest-400"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {feature.icon}
              </svg>
              <h3 className="text-sm font-semibold tracking-wide text-forest-800 uppercase dark:text-forest-200">
                {feature.label}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Kvalitetsved */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-forest-800 dark:text-forest-200">
            Kvalitetsved fra lokale skoger
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Veden vår kommer fra bærekraftig drevne skoger i nærområdet.
            Bjørkeveden kløyves, tørkes og pakkes i praktiske sekker på pall.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Tørr ved og klar til bruk',
              'Praktiske paller – enkle å stable',
              'Rent og ryddig levert',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <svg
                  className="shrink-0 text-forest-600 dark:text-forest-400"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/veden-var"
            className="mt-8 inline-flex rounded-md bg-forest-700 px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase hover:bg-forest-600"
          >
            Les mer om veden vår
          </Link>
        </div>
        <ImagePlaceholder className="aspect-[4/3] w-full rounded-lg" />
      </section>

      {/* Products */}
      <section className="bg-gray-50 dark:bg-gray-950/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-forest-800 dark:text-forest-200">
            Våre vedprodukter
          </h2>
          {loading ? (
            <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
              Laster produkter …
            </p>
          ) : products.length === 0 ? (
            <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
              Ingen produkter tilgjengelig akkurat nå.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="aspect-[4/3] w-full" />
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-forest-800 dark:text-forest-200">
                        {formatPrice(product.price)}
                      </span>
                      <Link
                        to="/bestill"
                        className="rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold tracking-wide text-white uppercase hover:bg-forest-600"
                      >
                        Bestill
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
