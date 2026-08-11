import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui";
import { useProducts, useSaleMutations } from "../api/hooks";
import {
  categoryLabels,
  formatCurrency,
  paymentMethodLabels,
  todayIso,
} from "../lib/utils";
import type { PaymentMethod, Product } from "../data/types";

type LineItem = {
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

function productIdOf(product: Product & { _id?: string }): string {
  return product.id ?? product._id ?? "";
}

export default function RegisterSale() {
  const navigate = useNavigate();
  const { products, loading } = useProducts(true);
  const { create } = useSaleMutations();
  const [date, setDate] = useState(todayIso());
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("efectivo");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items],
  );

  const addItem = () => {
    setError("");
    const product = products.find(
      (p) => productIdOf(p as Product & { _id?: string }) === selectedProductId,
    );
    if (!product) {
      setError("Seleccione un producto");
      return;
    }
    if (quantity <= 0) {
      setError("La cantidad debe ser mayor a cero");
      return;
    }
    const pid = productIdOf(product as Product & { _id?: string });
    setItems((prev) => [
      ...prev,
      {
        productId: pid,
        productName: product.name,
        quantity,
        unitPrice: product.price,
      },
    ]);
    setSelectedProductId("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("Agregue al menos un producto");
      return;
    }
    setSaving(true);
    try {
      await create({ date, items, paymentMethod, notes: notes || undefined });
      navigate("/historial");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la venta");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-coffee-600">Cargando productos…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Registrar venta"
        subtitle="Agregue productos y confirme el método de pago"
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card space-y-4">
            <div>
              <label className="label" htmlFor="sale-date">
                Fecha
              </label>
              <input
                id="sale-date"
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="payment-method">
                Método de pago
              </label>
              <select
                id="payment-method"
                className="input-field"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
              >
                {Object.entries(paymentMethodLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="notes">
                Notas (opcional)
              </label>
              <textarea
                id="notes"
                className="input-field min-h-20"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones de la venta"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-coffee-900">Agregar producto</h3>
            <div>
              <label className="label" htmlFor="product">
                Producto
              </label>
              <select
                id="product"
                className="input-field"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {products.map((product) => {
                  const pid = productIdOf(product as Product & { _id?: string });
                  return (
                    <option key={pid} value={pid}>
                      {product.name} — {formatCurrency(product.price)} (
                      {categoryLabels[product.category]})
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="quantity">
                Cantidad
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                className="input-field"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <button type="button" className="btn-secondary" onClick={addItem}>
              Agregar a la venta
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 font-semibold text-coffee-900">
            Detalle de la venta
          </h3>

          {items.length === 0 ? (
            <p className="text-sm text-coffee-600">
              No hay productos en esta venta.
            </p>
          ) : (
            <ul className="mb-4 space-y-3">
              {items.map((item, index) => (
                <li
                  key={`${item.productName}-${index}`}
                  className="flex items-center justify-between border-b border-coffee-100 pb-3"
                >
                  <div>
                    <p className="font-medium text-coffee-900">
                      {item.productName}
                    </p>
                    <p className="text-xs text-coffee-500">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-coffee-800">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => removeItem(index)}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mb-4 flex items-center justify-between border-t border-coffee-200 pt-4">
            <span className="text-lg font-semibold text-coffee-900">Total</span>
            <span className="text-2xl font-bold text-coffee-800">
              {formatCurrency(total)}
            </span>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={saving || items.length === 0}
          >
            {saving ? "Guardando…" : "Guardar venta"}
          </button>
        </div>
      </form>
    </div>
  );
}
