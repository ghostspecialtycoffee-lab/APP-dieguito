import { useMemo, useState } from "react";
import { PageHeader, EmptyState, LoadingState } from "../components/ui";
import { useSalesByDateRange, useSaleMutations } from "../api/hooks";
import { formatCurrency, paymentMethodLabels, todayIso } from "../lib/utils";

function saleId(sale: { id?: string; _id?: string }): string {
  return sale.id ?? sale._id ?? "";
}

export default function History() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(todayIso());
  const { sales, loading } = useSalesByDateRange(startDate, endDate);
  const { remove } = useSaleMutations();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const total = useMemo(
    () => sales.reduce((sum, sale) => sum + sale.total, 0),
    [sales],
  );

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta venta?")) return;
    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Historial de ventas"
        subtitle="Consulte y filtre las ventas registradas"
      />

      <div className="card mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="start-date">
            Desde
          </label>
          <input
            id="start-date"
            type="date"
            className="input-field"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="end-date">
            Hasta
          </label>
          <input
            id="end-date"
            type="date"
            className="input-field"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <div className="w-full rounded-lg border border-coffee-200 bg-coffee-50 px-4 py-3">
            <p className="text-xs text-coffee-600">Total del período</p>
            <p className="text-xl font-bold text-coffee-900">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : sales.length === 0 ? (
        <EmptyState message="No hay ventas en el rango seleccionado." />
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => {
            const id = saleId(sale);
            return (
              <article key={id} className="card">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-coffee-900">
                      {formatCurrency(sale.total)}
                    </p>
                    <p className="text-sm text-coffee-600">
                      {sale.date} · {paymentMethodLabels[sale.paymentMethod]}
                    </p>
                    {sale.notes && (
                      <p className="mt-1 text-sm text-coffee-500">{sale.notes}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    onClick={() => handleDelete(id)}
                    disabled={deletingId === id}
                  >
                    {deletingId === id ? "Eliminando…" : "Eliminar"}
                  </button>
                </div>
                <ul className="space-y-1 text-sm text-coffee-700">
                  {sale.items.map((item, index) => (
                    <li key={`${id}-${index}`}>
                      {item.productName} — {item.quantity} ×{" "}
                      {formatCurrency(item.unitPrice)} ={" "}
                      {formatCurrency(item.subtotal)}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
