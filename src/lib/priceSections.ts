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
import type { PriceSection, PriceSectionDoc } from '../types/PriceSection'

const COLLECTION = 'priceSections'

/** Subscribe to all price sections, ordered by their sort key. */
export function subscribePriceSections(
  onChange: (sections: PriceSectionDoc[]) => void,
) {
  const q = query(collection(db, COLLECTION), orderBy('order'))
  return onSnapshot(q, (snapshot) => {
    onChange(
      snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as PriceSection) })),
    )
  })
}

export async function addPriceSection(section: PriceSection) {
  await addDoc(collection(db, COLLECTION), section)
}

export async function updatePriceSection(id: string, section: PriceSection) {
  await updateDoc(doc(db, COLLECTION, id), { ...section })
}

export async function deletePriceSection(section: PriceSectionDoc) {
  // Best-effort cleanup of the images first; ignore any that are already gone.
  await Promise.all(section.images.map((img) => deleteSectionImage(img.src)))
  await deleteDoc(doc(db, COLLECTION, section.id))
}

/** Upload an image file to Storage and return its public download URL. */
export async function uploadSectionImage(file: File): Promise<string> {
  const path = `priceSections/${crypto.randomUUID()}-${file.name}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/** Best-effort delete of a Storage image by its URL. Ignores local/missing files. */
export async function deleteSectionImage(url: string) {
  try {
    await deleteObject(ref(storage, url))
  } catch {
    /* image missing or not a Storage URL (e.g. a local /img default) */
  }
}
