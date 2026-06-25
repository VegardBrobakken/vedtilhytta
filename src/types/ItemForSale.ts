/** The data stored for an item that is for sale. */
export interface ItemForSale {
  name: string
  description: string
  /** Price in NOK. */
  price: number
  /** Public download URL of the item's image in Firebase Storage. */
  imageUrl: string
}

/** An ItemForSale together with its Firestore document id. */
export interface ItemForSaleDoc extends ItemForSale {
  id: string
}
