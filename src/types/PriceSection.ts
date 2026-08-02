/** One image shown in a price section. */
export interface PriceImage {
  /** Public URL of the image (Firebase Storage download URL or a local path). */
  src: string
  alt: string
}

/** A price section shown on the public Priser page. Always has exactly 2 images. */
export interface PriceSection {
  title: string
  /** Optional free-text description shown under the title. */
  description?: string
  /** Price in NOK. */
  price: number
  /** Free-text unit label, e.g. "per sekk ink.mva". */
  unit: string
  images: PriceImage[]
  /** Sort key – lower comes first. */
  order: number
}

/** A PriceSection together with its Firestore document id. */
export interface PriceSectionDoc extends PriceSection {
  id: string
}
