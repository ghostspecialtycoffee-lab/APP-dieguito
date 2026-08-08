export interface Order {
  id: string;
  drink: string;
  size: "small" | "medium" | "large";
  customer: string;
  createdAt: string;
}

export type NewOrder = Pick<Order, "drink" | "size" | "customer">;

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error(`Failed to load orders (${res.status})`);
  return (await res.json()) as Order[];
}

export async function createOrder(input: NewOrder): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Failed to create order (${res.status})`);
  }
  return (await res.json()) as Order;
}
