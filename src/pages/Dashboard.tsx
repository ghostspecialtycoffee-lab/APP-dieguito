import { Link } from "react-router-dom";
import { PlusCircle, TrendingUp, Receipt, Wallet } from "lucide-react";
import { PageHeader, StatCard, LoadingState } from "../components/ui";
import { useSalesByDateRange, useSalesSummary } from "../api/hooks";
import {
  formatCurrency,
  paymentMethodLabels,
  startOfMonth,
  startOfWeek,
  todayIso,
} from "../lib/utils";
import type { Sale } from "../data/types";

function saleKey(sale: Sale & { _id?: string }): string {
  return sale.id ?? sale._id ?? String(sale.createdAt);
}

export default function Dashboard() {
  const today = todayIso();
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();

  const { sales: todaySales, loading: loadingToday } = useSalesByDateRange(
    today,
    today,
  );
  const { summary: weekSummary, loading: loadingWeek } = useSalesSummary(
    weekStart,
    today,
  );
  const { summary: monthSummary, loading: loadingMonth } = useSalesSummary(
    monthStart,
    today,
  );

  if (loadingToday || loadingWeek || loadingMonth) {
    return <LoadingState />;
  }

  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div>
      <PageHeader
        title="Panel de ventas"
        subtitle="Resumen del día, la semana y el mes"
        action={
          <Link to="/registrar" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Nueva venta
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ventas de hoy"
          value={formatCurrency(todayTotal)}
          hint={`${todaySales.length} transacciones`}
        />
        <StatCard
          label="Esta semana"
          value={formatCurrency(weekSummary?.totalSales ?? 0)}
          hint={`${weekSummary?.transactionCount ?? 0} transacciones`}
        />
        <StatCard
          label="Este mes"
          value={formatCurrency(monthSummary?.totalSales ?? 0)}
          hint={`${monthSummary?.transactionCount ?? 0} transacciones`}
        />
        <StatCard
          label="Ticket promedio (hoy)"
          value={
            todaySales.length > 0
              ? formatCurrency(todayTotal / todaySales.length)
              : formatCurrency(0)
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <div className="mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-coffee-600" />
            <h3 className="font-semibold text-coffee-900">Ventas de hoy</h3>
          </div>
          {todaySales.length === 0 ? (
            <p className="text-sm text-coffee-600">
              Aún no hay ventas registradas hoy.
            </p>
          ) : (
            <ul className="space-y-3">
              {todaySales.map((sale) => (
                <li
                  key={saleKey(sale)}
                  className="flex items-center justify-between border-b border-coffee-100 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-coffee-900">
                      {formatCurrency(sale.total)}
                    </p>
                    <p className="text-xs text-coffee-500">
                      {paymentMethodLabels[sale.paymentMethod]} ·{" "}
                      {sale.items.length} producto(s)
                    </p>
                  </div>
                  <span className="text-xs text-coffee-500">
                    {new Date(sale.createdAt).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-coffee-600" />
            <h3 className="font-semibold text-coffee-900">
              Productos más vendidos (semana)
            </h3>
          </div>
          {(weekSummary?.topProducts.length ?? 0) === 0 ? (
            <p className="text-sm text-coffee-600">Sin datos esta semana.</p>
          ) : (
            <ul className="space-y-3">
              {weekSummary?.topProducts.slice(0, 5).map((product) => (
                <li
                  key={product.productName}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-coffee-900">
                      {product.productName}
                    </p>
                    <p className="text-xs text-coffee-500">
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

      <section className="card mt-6">
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-coffee-600" />
          <h3 className="font-semibold text-coffee-900">
            Ventas por método de pago (mes)
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            Object.entries(monthSummary?.byPaymentMethod ?? {}) as Array<
              [keyof typeof paymentMethodLabels, number]
            >
          ).map(([method, amount]) => (
            <div
              key={method}
              className="rounded-lg border border-coffee-200 bg-coffee-50 p-4"
            >
              <p className="text-sm text-coffee-600">
                {paymentMethodLabels[method]}
              </p>
              <p className="text-lg font-semibold text-coffee-900">
                {formatCurrency(amount)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
