export const isCloudMode = Boolean(import.meta.env.VITE_CONVEX_URL);

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function startOfWeek(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

export function startOfMonth(date = new Date()): string {
  const d = new Date(date);
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

export const paymentMethodLabels: Record<
  "efectivo" | "tarjeta" | "transferencia",
  string
> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

export const categoryLabels: Record<"bebida" | "comida" | "otro", string> = {
  bebida: "Bebida",
  comida: "Comida",
  otro: "Otro",
};
