import { useEffect, useState } from "react";
import { subscribePriceSections } from "../lib/priceSections";
import type { PriceSectionDoc } from "../types/PriceSection";

function formatPrice(price: number) {
  return `${price.toLocaleString("nb-NO")},-`;
}

export function Prices() {
  const [sections, setSections] = useState<PriceSectionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      subscribePriceSections((next) => {
        setSections(next);
        setLoading(false);
      }),
    [],
  );

  return (
    <div className="py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-forest-800">Priser</h1>

      {loading ? (
        <p className="mt-10 text-gray-500">Laster …</p>
      ) : sections.length === 0 ? (
        <p className="mt-10 text-gray-500">Ingen priser lagt til enda.</p>
      ) : (
        <div className="mt-10 space-y-16">
          {sections.map((section) => (
            <section
              key={section.title}
              className="grid items-center gap-10 md:grid-cols-2"
            >
              <div className="grid grid-cols-2 gap-4">
                {section.images.map((image, i) => (
                  <img
                    key={`${section.title}-${i}`}
                    src={image.src}
                    alt={image.alt}
                    className="aspect-square w-full rounded-lg object-cover shadow-sm"
                  />
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-forest-800">
                  {section.title}
                </h2>

                {section.description && (
                  <p className="mt-3 whitespace-pre-line text-gray-600">
                    {section.description}
                  </p>
                )}

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-forest-800">
                    {formatPrice(section.price)}
                  </span>
                  <span className="text-sm text-gray-500">{section.unit}</span>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
