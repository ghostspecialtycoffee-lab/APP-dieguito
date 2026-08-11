import { useState } from "react";
import { PageHeader, LoadingState } from "../components/ui";
import { useProducts, useProductMutations } from "../api/hooks";
import { categoryLabels, formatCurrency } from "../lib/utils";
import type { Product, ProductCategory } from "../data/types";

function productId(product: Product & { _id?: string }): string {
  return product.id ?? product._id ?? "";
}

export default function Products() {
  const { products, loading } = useProducts();
  const { create, update, remove } = useProductMutations();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("bebida");
  const [price, setPrice] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setSaving(true);
    try {
      await create({ name, category, price });
      setName("");
      setPrice(0);
      setCategory("bebida");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el producto");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (product: Product & { _id?: string }) => {
    const id = productId(product);
    if (product.active) {
      await remove(id);
    } else {
      await update(id, { active: true });
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Catálogo de bebidas, comida y otros artículos"
      />

      <form onSubmit={handleCreate} className="card mb-6 grid gap-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="product-name">
            Nombre
          </label>
          <input
            id="product-name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Flat White"
          />
        </div>
        <div>
          <label className="label" htmlFor="product-category">
            Categoría
          </label>
          <select
            id="product-category"
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="product-price">
            Precio (COP)
          </label>
          <input
            id="product-price"
            type="number"
            min={0}
            className="input-field"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="sm:col-span-4">
          {error && (
            <p className="mb-3 text-sm text-red-600">{error}</p>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Guardando…" : "Agregar producto"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-coffee-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-coffee-50 text-left text-coffee-700">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const id = productId(product as Product & { _id?: string });
              return (
                <tr key={id} className="border-t border-coffee-100">
                  <td className="px-4 py-3 font-medium text-coffee-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-coffee-600">
                    {categoryLabels[product.category]}
                  </td>
                  <td className="px-4 py-3 text-coffee-800">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.active
                          ? "bg-green-100 text-green-800"
                          : "bg-coffee-100 text-coffee-600"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-sm text-coffee-700 hover:underline"
                      onClick={() =>
                        toggleActive(product as Product & { _id?: string })
                      }
                    >
                      {product.active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
