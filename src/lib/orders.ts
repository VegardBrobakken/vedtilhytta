/** The details a customer fills in on the order form. */
export interface OrderDetails {
  name: string
  email: string
  phone: string
  address: string
  products: string
}

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
  | string
  | undefined

/**
 * Submit an order by sending it through Web3Forms, which emails it to the
 * address the access key was registered with. No backend or SMTP required.
 */
export async function submitOrder(order: OrderDetails) {
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
      subject: `Ny bestilling fra ${order.name}`,
      from_name: 'Ved til hytta',
      replyto: order.email,
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
