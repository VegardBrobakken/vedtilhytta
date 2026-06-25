import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link } from '../components/Link'
import { ItemForm } from '../components/ItemForm'
import { Modal } from '../components/Modal'
import { deleteItem, subscribeItems } from '../lib/items'
import type { ItemForSaleDoc } from '../types/ItemForSale'

export function Admin() {
  const { user, logout } = useAuth()
  const [items, setItems] = useState<ItemForSaleDoc[]>([])
  // null = modal closed, 'new' = add form, an item = edit form.
  const [form, setForm] = useState<ItemForSaleDoc | 'new' | null>(null)

  useEffect(() => subscribeItems(setItems), [])

  const onDelete = async (item: ItemForSaleDoc) => {
    if (confirm(`Slette «${item.name}»?`)) {
      await deleteItem(item)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Admin</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="min-w-0 truncate text-gray-500 dark:text-gray-400">
              {user?.email}
            </span>
            <Link
              to="/"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Hjem
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-md border border-gray-300 px-3 py-1.5 font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Logg ut
            </button>
          </div>
        </header>

        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">
            Varer{' '}
            <span className="text-gray-400 dark:text-gray-500">
              ({items.length})
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setForm('new')}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Ny vare +
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Ingen varer ennå.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-4 sm:gap-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="aspect-square w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="mb-1 font-medium text-blue-600 dark:text-blue-400">
                    {item.price} kr
                  </p>
                  <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm(item)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      Rediger
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="flex-1 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      Slett
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {form && (
        <Modal onClose={() => setForm(null)}>
          <ItemForm
            item={form === 'new' ? undefined : form}
            onDone={() => setForm(null)}
          />
        </Modal>
      )}
    </div>
  )
}
