import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { db, storage } from './firebase'
import type { ItemForSale, ItemForSaleDoc } from '../types/ItemForSale'

const COLLECTION = 'items'

/** Subscribe to all items, ordered by name. Returns an unsubscribe function. */
export function subscribeItems(onChange: (items: ItemForSaleDoc[]) => void) {
  const q = query(collection(db, COLLECTION), orderBy('name'))
  return onSnapshot(q, (snapshot) => {
    onChange(
      snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as ItemForSale) })),
    )
  })
}

export async function addItem(item: ItemForSale) {
  await addDoc(collection(db, COLLECTION), item)
}

export async function updateItem(id: string, item: ItemForSale) {
  await updateDoc(doc(db, COLLECTION, id), { ...item })
}

export async function deleteItem(item: ItemForSaleDoc) {
  // Best-effort cleanup of the image first; ignore if it's already gone.
  if (item.imageUrl) {
    try {
      await deleteObject(ref(storage, item.imageUrl))
    } catch {
      /* image missing or not a Storage URL */
    }
  }
  await deleteDoc(doc(db, COLLECTION, item.id))
}

/** Upload an image file to Storage and return its public download URL. */
export async function uploadImage(file: File): Promise<string> {
  const path = `items/${crypto.randomUUID()}-${file.name}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
