import { useState } from "react";
import { Download } from "lucide-react";
import { PageHeader, LoadingState } from "../components/ui";
import { useSalesByDateRange, useSalesSummary } from "../api/hooks";
import {
  formatCurrency,
  paymentMethodLabels,
  startOfMonth,
  todayIso,
} from "../lib/utils";

export default function Reports() {
  const [startDate, setStartDate] = useState(startOfMonth());
  const [endDate, setEndDate] = useState(todayIso());
  const { summary, loading } = useSalesSummary(startDate, endDate);
  const { sales, loading: loadingSales } = useSalesByDateRange(
    startDate,
    endDate,
  );

  const exportJson = () => {
    const payload = {
      periodo: { desde: startDate, hasta: endDate },
      resumen: summary,
      ventas: sales,
      exportadoEn: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `informe-ventas-${startDate}-${endDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const headers = [
      "fecha",
      "total",
      "metodo_pago",
      "productos",
      "notas",
    ];
    const rows = sales.map((sale) => [
      sale.date,
      sale.total.toString(),
      sale.paymentMethod,
      sale.items
        .map((i) => `${i.productName} x${i.quantity}`)
        .join("; "),
      sale.notes ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventas-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || loadingSales) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Informes"
        subtitle="Resumen del período y exportación de datos"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary inline-flex items-center gap-2"
              onClick={exportCsv}
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
            <button
              type="button"
              className="btn-primary inline-flex items-center gap-2"
              onClick={exportJson}
            >
              <Download className="h-4 w-4" />
              Exportar JSON
            </button>
          </div>
        }
      />

      <div className="card mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="report-start">
            Desde
          </label>
          <input
            id="report-start"
            type="date"
            className="input-field"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="report-end">
            Hasta
          </label>
          <input
            id="report-end"
            type="date"
            className="input-field"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-sm text-coffee-600">Total vendido</p>
          <p className="mt-2 text-2xl font-bold text-coffee-900">
            {formatCurrency(summary?.totalSales ?? 0)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-coffee-600">Transacciones</p>
          <p className="mt-2 text-2xl font-bold text-coffee-900">
            {summary?.transactionCount ?? 0}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-coffee-600">Ticket promedio</p>
          <p className="mt-2 text-2xl font-bold text-coffee-900">
            {summary && summary.transactionCount > 0
              ? formatCurrency(summary.totalSales / summary.transactionCount)
              : formatCurrency(0)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-coffee-600">Productos distintos</p>
          <p className="mt-2 text-2xl font-bold text-coffee-900">
            {summary?.topProducts.length ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h3 className="mb-4 font-semibold text-coffee-900">
            Por método de pago
          </h3>
          <ul className="space-y-3">
            {(
              Object.entries(summary?.byPaymentMethod ?? {}) as Array<
                [keyof typeof paymentMethodLabels, number]
              >
            ).map(([method, amount]) => (
              <li key={method} className="flex justify-between text-sm">
                <span className="text-coffee-600">
                  {paymentMethodLabels[method]}
                </span>
                <span className="font-medium text-coffee-900">
                  {formatCurrency(amount)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3 className="mb-4 font-semibold text-coffee-900">
            Top productos
          </h3>
          {(summary?.topProducts.length ?? 0) === 0 ? (
            <p className="text-sm text-coffee-600">Sin ventas en el período.</p>
          ) : (
            <ul className="space-y-3">
              {summary?.topProducts.map((product) => (
                <li
                  key={product.productName}
                  className="flex justify-between text-sm"
                >
                  <div>
                    <p className="font-medium text-coffee-900">
                      {product.productName}
                    </p>
                    <p className="text-coffee-500">
                      {product.quantity} unidades
                    </p>
                  </div>
                  <span className="font-medium text-coffee-800">
                    {formatCurrency(product.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
