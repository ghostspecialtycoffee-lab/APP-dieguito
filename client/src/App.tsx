import { useEffect, useState, type FormEvent } from "react";

import { createOrder, fetchOrders, type Order } from "./api.js";

const SIZES: Order["size"][] = ["small", "medium", "large"];

export function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drink, setDrink] = useState("Cappuccino");
  const [size, setSize] = useState<Order["size"]>("medium");
  const [customer, setCustomer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      setOrders(await fetchOrders());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await createOrder({ drink, size, customer });
      setCustomer("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <main className="app">
      <header>
        <h1>☕ Dieguito Coffee</h1>
        <p className="subtitle">Place an order and watch the queue update.</p>
      </header>

      <form className="order-form" onSubmit={onSubmit}>
        <label>
          Drink
          <input value={drink} onChange={(e) => setDrink(e.target.value)} required />
        </label>
        <label>
          Size
          <select value={size} onChange={(e) => setSize(e.target.value as Order["size"])}>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Customer
          <input
            value={customer}
            placeholder="Your name"
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add order</button>
      </form>

      {error && <p className="error">⚠️ {error}</p>}

      <section>
        <h2>Order queue ({orders.length})</h2>
        {loading ? (
          <p>Loading…</p>
        ) : orders.length === 0 ? (
          <p className="empty">No orders yet. Be the first!</p>
        ) : (
          <ul className="orders">
            {orders.map((o) => (
              <li key={o.id}>
                <span className="drink">{o.drink}</span>
                <span className="size">{o.size}</span>
                <span className="customer">for {o.customer}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
