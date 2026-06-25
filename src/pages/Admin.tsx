import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "../components/Link";
import { ItemForm } from "../components/ItemForm";
import { Modal } from "../components/Modal";
import { deleteItem, subscribeItems } from "../lib/items";
import type { ItemForSaleDoc } from "../types/ItemForSale";

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2 6 10h2.5L4 16h4.5L4 22h7v-3h2v3h7l-4.5-6H20l-4.5-6H18z" />
    </svg>
  );
}

export function Admin() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState<ItemForSaleDoc[]>([]);
  // null = modal closed, 'new' = add form, an item = edit form.
  const [form, setForm] = useState<ItemForSaleDoc | "new" | null>(null);

  useEffect(() => subscribeItems(setItems), []);

  const onDelete = async (item: ItemForSaleDoc) => {
    if (confirm(`Slette «${item.name}»?`)) {
      await deleteItem(item);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Brand bar – echoes the public navbar so it reads as the same site */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <TreeIcon className="text-forest-700" />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-forest-800">
                vedtilhytta.no
              </span>
              <span className="text-[11px] tracking-wide text-gray-500 uppercase">
                Administrasjon
              </span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="min-w-0 truncate text-gray-500">
              Innlogget bruker: {user?.email}
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-md border border-gray-300 px-3 py-1.5 font-medium hover:bg-gray-100"
            >
              Logg ut
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-forest-800">
            Varer{" "}
            <span className="font-semibold text-gray-400">
              ({items.length})
            </span>
          </h1>
          <button
            type="button"
            onClick={() => setForm("new")}
            className="rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold tracking-wide text-white uppercase hover:bg-forest-600"
          >
            Ny vare +
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500">Ingen varer ennå.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-4 sm:gap-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="aspect-square w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="mb-1 font-bold text-forest-800">
                    {item.price} kr
                  </p>
                  <p className="mb-4 flex-1 text-sm text-gray-600">
                    {item.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm(item)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
                    >
                      Rediger
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="flex-1 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
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
            item={form === "new" ? undefined : form}
            onDone={() => setForm(null)}
          />
        </Modal>
      )}
    </div>
  );
}
