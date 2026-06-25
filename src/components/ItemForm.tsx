import { useEffect, useState } from 'react'
import { addItem, updateItem, uploadImage } from '../lib/items'
import type { ItemForSaleDoc } from '../types/ItemForSale'

const labelClass = 'block text-sm font-medium text-gray-700'
const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/30'

export function ItemForm({
  item,
  onDone,
}: {
  item?: ItemForSaleDoc
  onDone: () => void
}) {
  const editing = Boolean(item)
  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [price, setPrice] = useState(item ? String(item.price) : '')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Preview the freshly selected file, falling back to the existing image.
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

  const preview = filePreview || item?.imageUrl

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!editing && !file) {
      setError('Velg et bilde')
      return
    }

    setBusy(true)
    try {
      const imageUrl = file ? await uploadImage(file) : item!.imageUrl
      const payload = {
        name,
        description,
        price: Number(price),
        imageUrl,
      }
      if (item) {
        await updateItem(item.id, payload)
      } else {
        await addItem(payload)
      }
      onDone()
    } catch (err) {
      console.error('Failed to save item:', err)
      setError('Kunne ikke lagre varen')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-forest-800">
        {editing ? 'Rediger vare' : 'Legg til vare'}
      </h2>

      <div>
        <label className={labelClass}>
          Navn
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            required
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
          Bilde{editing ? ' (la stå tom for å beholde nåværende)' : ''}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
