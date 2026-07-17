import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

/** The details a customer fills in on the order form. */
export interface OrderDetails {
  name: string
  email: string
  phone: string
  address: string
  products: string
}

/** Whether the owner has dealt with an order yet. */
export type OrderStatus = 'new' | 'handled'

/** An order as stored in Firestore, together with its document id. */
export interface OrderDoc extends OrderDetails {
  id: string
  /** Human-friendly, sequential order number shown to the customer. */
  orderNumber: number
  status: OrderStatus
  /** null for the brief moment before the server timestamp resolves locally. */
  createdAt: Timestamp | null
}

const COLLECTION = 'orders'

/** Document holding the running order-number counter (a single shared doc). */
const COUNTER_DOC = doc(db, 'counters', 'orders')

/** The first order gets this number; each subsequent order is one higher. */
const FIRST_ORDER_NUMBER = 1000

/** How many orders to load per page in the admin panel. */
export const ORDERS_PAGE_SIZE = 20

/** A Firestore cursor pointing at the last order of a loaded page. */
export type OrderCursor = QueryDocumentSnapshot<DocumentData>

export interface OrdersPage {
  orders: OrderDoc[]
  /** Cursor to pass to the next fetchOrders call; null when nothing loaded. */
  cursor: OrderCursor | null
  /** Whether more orders likely exist beyond this page. */
  hasMore: boolean
}

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
  | string
  | undefined

/**
 * Submit an order by sending it through Web3Forms, which emails it to the
 * address the access key was registered with. No backend or SMTP required.
 */
export async function submitOrder(order: OrderDetails, orderNumber: number) {
  if (!ACCESS_KEY) {
    throw new Error('VITE_WEB3FORMS_ACCESS_KEY is not configured')
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `Ny bestilling #${orderNumber} fra ${order.name}`,
      from_name: 'Ved til hytta',
      replyto: order.email,
      Bestillingsnummer: `#${orderNumber}`,
      Navn: order.name,
      'E-post': order.email,
      Telefon: order.phone,
      Leveringsadresse: order.address,
      'Ønskede produkter': order.products,
    }),
  })

  const data = (await res.json()) as { success: boolean; message?: string }
  if (!res.ok || !data.success) {
    throw new Error(data.message ?? 'Web3Forms request failed')
  }
}

/**
 * Persist an order to Firestore so it shows up in the admin panel, assigning it
 * the next sequential order number. Runs in a transaction so concurrent orders
 * can never receive the same number: the shared counter is read and incremented
 * atomically alongside creating the order document. Returns the order number so
 * the caller can show it to the customer.
 */
export async function createOrder(order: OrderDetails): Promise<number> {
  return runTransaction(db, async (tx) => {
    const counter = await tx.get(COUNTER_DOC)
    const orderNumber = counter.exists()
      ? (counter.data().value as number) + 1
      : FIRST_ORDER_NUMBER
    tx.set(COUNTER_DOC, { value: orderNumber })

    const orderRef = doc(collection(db, COLLECTION))
    tx.set(orderRef, {
      ...order,
      orderNumber,
      status: 'new',
      createdAt: serverTimestamp(),
    })
    return orderNumber
  })
}

/**
 * Fetch one page of orders, newest first. Pass the previous page's `cursor` to
 * load the next page; omit it for the first page. Paginating (rather than
 * loading the whole collection) keeps reads and rendering bounded as the order
 * log grows over the years.
 */
export async function fetchOrders(after?: OrderCursor | null): Promise<OrdersPage> {
  const q = after
    ? query(
        collection(db, COLLECTION),
        orderBy('createdAt', 'desc'),
        startAfter(after),
        limit(ORDERS_PAGE_SIZE),
      )
    : query(
        collection(db, COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(ORDERS_PAGE_SIZE),
      )
  const snapshot = await getDocs(q)
  const orders = snapshot.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Omit<OrderDoc, 'id'>) }),
  )
  return {
    orders,
    cursor: snapshot.docs.at(-1) ?? null,
    hasMore: snapshot.size === ORDERS_PAGE_SIZE,
  }
}

/** Total number of orders, counted server-side without reading the documents. */
export async function countOrders(): Promise<number> {
  const snapshot = await getCountFromServer(query(collection(db, COLLECTION)))
  return snapshot.data().count
}

/** Number of orders still marked 'new', counted server-side. */
export async function countNewOrders(): Promise<number> {
  const snapshot = await getCountFromServer(
    query(collection(db, COLLECTION), where('status', '==', 'new')),
  )
  return snapshot.data().count
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(db, COLLECTION, id), { status })
}

export async function deleteOrder(id: string) {
  await deleteDoc(doc(db, COLLECTION, id))
}
