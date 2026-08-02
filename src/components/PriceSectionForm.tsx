import { useEffect, useState } from 'react'
import {
  addPriceSection,
  deleteSectionImage,
  updatePriceSection,
  uploadSectionImage,
} from '../lib/priceSections'
import type { PriceSectionDoc } from '../types/PriceSection'

const labelClass = 'block text-sm font-medium text-gray-700'
const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/30'

/** A single image slot: shows the newly picked file, falling back to an existing image. */
function ImageSlot({
  label,
  file,
  existingSrc,
  onSelect,
}: {
  label: string
  file: File | null
  existingSrc?: string
  onSelect: (file: File | null) => void
}) {
  const [filePreview, setFilePreview] = useState('')
  useEffect(() => {
    if (!file) {
      setFilePreview('')
      return
    }
    const url = URL.createObjectURL(file)
    setFilePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const preview = filePreview || existingSrc

  return (
    <div>
      <label className={labelClass}>
        {label}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-forest-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-forest-600"
        />
      </label>
      {preview && (
        <img
          src={preview}
          alt="Forhåndsvisning"
          className="mt-3 aspect-square w-32 rounded-md border border-gray-200 object-cover"
        />
      )}
    </div>
  )
}

export function PriceSectionForm({
  section,
  onDone,
}: {
  section?: PriceSectionDoc
  onDone: () => void
}) {
  const editing = Boolean(section)
  const [title, setTitle] = useState(section?.title ?? '')
  const [description, setDescription] = useState(section?.description ?? '')
  const [price, setPrice] = useState(section ? String(section.price) : '')
  const [unit, setUnit] = useState(section?.unit ?? 'per sekk ink.mva')
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const existing1 = section?.images[0]?.src
  const existing2 = section?.images[1]?.src

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Exactly two images are required: each slot needs either a new file or an
    // existing image to keep.
    if (!(file1 || existing1) || !(file2 || existing2)) {
      setError('Begge bildene er påkrevd')
      return
    }

    setBusy(true)
    try {
      const src1 = file1 ? await uploadSectionImage(file1) : existing1!
      const src2 = file2 ? await uploadSectionImage(file2) : existing2!

      const payload = {
        title,
        description: description.trim(),
        price: Number(price),
        unit,
        images: [
          { src: src1, alt: title },
          { src: src2, alt: title },
        ],
        order: section?.order ?? Date.now(),
      }

      if (section) {
        await updatePriceSection(section.id, payload)
        // Clean up any images that were replaced.
        if (file1 && existing1) await deleteSectionImage(existing1)
        if (file2 && existing2) await deleteSectionImage(existing2)
      } else {
        await addPriceSection(payload)
      }
      onDone()
    } catch (err) {
      console.error('Failed to save price section:', err)
      setError('Kunne ikke lagre seksjonen')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-forest-800">
        {editing ? 'Rediger seksjon' : 'Legg til seksjon'}
      </h2>

      <div>
        <label className={labelClass}>
          Tittel
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </label>
      </div>

      <div>
        <label className={labelClass}>
          Beskrivelse
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </label>
      </div>

      <div>
        <label className={labelClass}>
          Pris (kr)
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className={inputClass}
          />
        </label>
      </div>

      <div>
        <label className={labelClass}>
          Enhet
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageSlot
          label={`Bilde 1${editing ? ' (la stå tom for å beholde)' : ''}`}
          file={file1}
          existingSrc={existing1}
          onSelect={setFile1}
        />
        <ImageSlot
          label={`Bilde 2${editing ? ' (la stå tom for å beholde)' : ''}`}
          file={file2}
          existingSrc={existing2}
          onSelect={setFile2}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold tracking-wide text-white uppercase hover:bg-forest-600 disabled:opacity-50"
        >
          {busy ? 'Lagrer...' : editing ? 'Lagre' : 'Legg til'}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={busy}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
        >
          Avbryt
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  )
}
