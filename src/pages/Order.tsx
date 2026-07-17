import { useState } from "react";
import { logOrder, submitOrder } from "../lib/orders";

const labelClass = "block text-sm font-medium text-gray-700";
const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";

export function Order() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wantsDelivery, setWantsDelivery] = useState(false);
  const [address, setAddress] = useState("");
  const [products, setProducts] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Spam bots fill the hidden field; humans never see it. Pretend success.
    if (honeypot) {
      setSent(true);
      return;
    }
    setError("");
    setBusy(true);
    try {
      const details = {
        name,
        email,
        phone,
        address: wantsDelivery ? address : "",
        products,
      };
      // Email is the real order channel; the Firestore log gives the owner an
      // overview in the admin panel. Both must succeed.
      await submitOrder(details);
      await logOrder(details);
      setSent(true);
    } catch (err) {
      console.error("Failed to submit order:", err);
      setError("Kunne ikke sende bestillingen. Prøv igjen senere.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Takk for bestillingen!</h1>
        <p className="text-gray-700">
          Vi har mottatt bestillingen din og tar kontakt så snart som mulig.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 py-8 sm:py-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Bestill ved</h1>
        <p className="text-gray-700">
          Fyll ut skjemaet, så tar vi kontakt for å bekrefte bestillingen.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>
            Navn<span className="text-red-600">*</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className={inputClass}
            />
          </label>
        </div>

        <div>
          <label className={labelClass}>
            E-post<span className="text-red-600">*</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
            />
          </label>
        </div>

        <div>
          <label className={labelClass}>
            Telefon<span className="text-red-600">*</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
              className={inputClass}
            />
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={wantsDelivery}
              onChange={(e) => setWantsDelivery(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-2 focus:ring-forest-500/30"
            />
            Jeg ønsker veden levert
          </label>
        </div>

        {wantsDelivery && (
          <div>
            <label className={labelClass}>
              Leveringsadresse<span className="text-red-600">*</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                autoComplete="street-address"
                className={inputClass}
              />
            </label>
          </div>
        )}

        <div>
          <label className={labelClass}>
            Ønskede produkter<span className="text-red-600">*</span>
            <textarea
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              required
              rows={4}
              placeholder="F.eks. 2stk 1000L bjørkeved, 1stk 80L blandingsved"
              className={inputClass}
            />
          </label>
        </div>

        {/* Honeypot: hidden from users, a trap for spam bots. */}
        <input
          type="text"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-forest-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-forest-600 disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {busy ? "Sender..." : "Send bestilling"}
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  );
}
