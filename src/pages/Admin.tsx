import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "../components/Link";
import { ItemForm } from "../components/ItemForm";
import { Modal } from "../components/Modal";
import { deleteItem, subscribeItems } from "../lib/items";
import {
  countNewOrders,
  countOrders,
  deleteOrder,
  fetchOrders,
  setOrderStatus,
  type OrderCursor,
  type OrderDoc,
} from "../lib/orders";
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

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px flex items-center border-b-2 px-4 py-2.5 text-sm font-semibold ${
        active
          ? "border-forest-700 text-forest-800"
          : "border-transparent text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function OrderCard({
  order,
  onToggle,
  onRemove,
}: {
  order: OrderDoc;
  onToggle: (order: OrderDoc) => void;
  onRemove: (order: OrderDoc) => void;
}) {
  const [open, setOpen] = useState(false);
  const handled = order.status === "handled";
  const created = order.createdAt?.toDate().toLocaleString("nb-NO");

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header row – always visible, toggles the details open/closed */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-gray-50"
      >
        <svg
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-gray-900">
            {order.name}
          </span>
          {created && (
            <span className="block text-xs text-gray-500">{created}</span>
          )}
        </span>
        <span
          className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${
            handled
              ? "bg-green-100 text-green-800"
              : "bg-blue-200 text-blue-800"
          }`}
        >
          {handled ? "Behandlet" : "Ny"}
        </span>
      </button>

      {!open ? null : (
        <div className="border-t border-gray-100 p-4">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-gray-500">E-post</dt>
            <dd>
              <a
                className="text-forest-700 hover:underline"
                href={`mailto:${order.email}`}
              >
                {order.email}
              </a>
            </dd>
            <dt className="text-gray-500">Telefon</dt>
            <dd>
              <a
                className="text-forest-700 hover:underline"
                href={`tel:${order.phone}`}
              >
                {order.phone}
              </a>
            </dd>
            {order.address && (
              <>
                <dt className="text-gray-500">Leveringsadresse</dt>
                <dd className="whitespace-pre-wrap text-gray-800">
                  {order.address}
                </dd>
              </>
            )}
            <dt className="text-gray-500">Produkter</dt>
            <dd className="whitespace-pre-wrap text-gray-800">
              {order.products}
            </dd>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToggle(order)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
            >
              {handled ? "Marker som ny" : "Marker som behandlet"}
            </button>
            <button
              type="button"
              onClick={() => onRemove(order)}
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Slett
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export function Admin() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState<ItemForSaleDoc[]>([]);
  const [tab, setTab] = useState<"items" | "orders">("items");
  // null = modal closed, 'new' = add form, an item = edit form.
  const [form, setForm] = useState<ItemForSaleDoc | "new" | null>(null);

  // Orders are paginated so the list stays bounded as the log grows.
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [cursor, setCursor] = useState<OrderCursor | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  // Server-side counts, so the tab total and "ny" badge stay accurate
  // regardless of how many pages are currently loaded.
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => subscribeItems(setItems), []);

  useEffect(() => {
    // loadingOrders starts true, so the initial fetch shows the loading state.
    let active = true;
    Promise.all([fetchOrders(), countOrders(), countNewOrders()])
      .then(([page, total, unhandled]) => {
        if (!active) return;
        setOrders(page.orders);
        setCursor(page.cursor);
        setHasMore(page.hasMore);
        setTotalOrders(total);
        setNewOrders(unhandled);
      })
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => active && setLoadingOrders(false));
    return () => {
      active = false;
    };
  }, []);

  const loadMoreOrders = async () => {
    setLoadingOrders(true);
    try {
      const page = await fetchOrders(cursor);
      setOrders((prev) => [...prev, ...page.orders]);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (err) {
      console.error("Failed to load more orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const onToggleOrder = async (order: OrderDoc) => {
    const next = order.status === "new" ? "handled" : "new";
    await setOrderStatus(order.id, next);
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)),
    );
    setNewOrders((n) => n + (next === "new" ? 1 : -1));
  };

  const onRemoveOrder = async (order: OrderDoc) => {
    if (!confirm(`Slette bestillingen fra «${order.name}»?`)) return;
    await deleteOrder(order.id);
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    setTotalOrders((t) => (t === null ? t : t - 1));
    if (order.status === "new") setNewOrders((n) => n - 1);
  };

  const onDelete = async (item: ItemForSaleDoc) => {
    if (confirm(`Slette «${item.name}»?`)) {
      await deleteItem(item);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Brand bar – echoes the public navbar so it reads as the same site */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 p-4">
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

      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        {/* Tabs – switch between the product catalogue and the order log */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <TabButton active={tab === "items"} onClick={() => setTab("items")}>
            Varer ({items.length})
          </TabButton>
          <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
            Bestillinger ({totalOrders ?? orders.length})
            {newOrders > 0 && (
              <span className="ml-2 rounded-full bg-forest-700 px-2 py-0.5 text-xs font-semibold text-white">
                {newOrders} ny
              </span>
            )}
          </TabButton>
        </div>

        {tab === "items" && (
          <>
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
                Opprett ny +
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
          </>
        )}

        {tab === "orders" &&
          (orders.length === 0 ? (
            <p className="text-gray-500">
              {loadingOrders ? "Laster..." : "Ingen bestillinger ennå."}
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onToggle={onToggleOrder}
                  onRemove={onRemoveOrder}
                />
              ))}
              {hasMore && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={loadMoreOrders}
                    disabled={loadingOrders}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                  >
                    {loadingOrders ? "Laster..." : "Last inn flere"}
                  </button>
                </div>
              )}
            </div>
          ))}
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
