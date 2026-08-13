import { useState } from "react";
import { Download, Plus, Trash2, FileText } from "lucide-react";
import { PageHeader } from "../components/ui";
import { QuotePreview } from "../components/QuotePreview";
import {
  createEmptyLineItem,
  createEmptyTimelineItem,
  type QuoteData,
  type QuoteLineItem,
  type QuoteTimelineItem,
} from "../data/quoteTypes";
import { createDefaultQuote } from "../lib/quoteDefaults";
import { generateQuotePdf } from "../lib/generateQuotePdf";
import { quoteSubtotal } from "../data/quoteTypes";
import { formatCurrency } from "../lib/utils";

export default function Quotations() {
  const [quote, setQuote] = useState<QuoteData>(createDefaultQuote);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const updateField = <K extends keyof QuoteData>(key: K, value: QuoteData[K]) => {
    setQuote((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = (id: string, patch: Partial<QuoteLineItem>) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const updateTimeline = (id: string, patch: Partial<QuoteTimelineItem>) => {
    setQuote((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const addItem = () => {
    setQuote((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyLineItem()],
    }));
  };

  const removeItem = (id: string) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const addTimeline = () => {
    setQuote((prev) => ({
      ...prev,
      timeline: [...prev.timeline, createEmptyTimelineItem()],
    }));
  };

  const removeTimeline = (id: string) => {
    setQuote((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((item) => item.id !== id),
    }));
  };

  const handleExportPdf = async () => {
    setError("");
    setExporting(true);
    try {
      await generateQuotePdf(quote);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo generar el PDF",
      );
    } finally {
      setExporting(false);
    }
  };

  const handleNewQuote = () => {
    setQuote(createDefaultQuote());
    setError("");
  };

  return (
    <div>
      <PageHeader
        title="Cotizaciones"
        subtitle="Cree presupuestos con vista previa en vivo y exporte a PDF"
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={handleNewQuote}>
              Nueva cotización
            </button>
            <button
              type="button"
              className="btn-primary inline-flex items-center gap-2"
              onClick={handleExportPdf}
              disabled={exporting}
            >
              <Download className="h-4 w-4" />
              {exporting ? "Generando PDF…" : "Descargar PDF"}
            </button>
          </div>
        }
      />

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mb-4 rounded-lg border border-coffee-200 bg-white px-4 py-3 text-sm text-coffee-700">
        <FileText className="mr-2 inline h-4 w-4" />
        Logos oficiales de Ghost Specialty Coffee integrados. La vista previa y el
        PDF se actualizan automáticamente al editar los datos del formulario.
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <section className="card space-y-4">
            <h3 className="font-semibold text-coffee-900">Datos del presupuesto</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="quote-number">Número</label>
                <input
                  id="quote-number"
                  className="input-field"
                  value={quote.quoteNumber}
                  onChange={(e) => updateField("quoteNumber", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="project-name">Proyecto</label>
                <input
                  id="project-name"
                  className="input-field"
                  value={quote.projectName}
                  onChange={(e) => updateField("projectName", e.target.value)}
                  placeholder="Nombre del proyecto o pedido"
                />
              </div>
              <div>
                <label className="label" htmlFor="issue-date">Fecha emisión</label>
                <input
                  id="issue-date"
                  type="date"
                  className="input-field"
                  value={quote.issueDate}
                  onChange={(e) => updateField("issueDate", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="valid-until">Válida hasta</label>
                <input
                  id="valid-until"
                  type="date"
                  className="input-field"
                  value={quote.validUntil}
                  onChange={(e) => updateField("validUntil", e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="card space-y-4">
            <h3 className="font-semibold text-coffee-900">Cliente</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="client-name">Nombre</label>
                <input
                  id="client-name"
                  className="input-field"
                  value={quote.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="client-company">Empresa</label>
                <input
                  id="client-company"
                  className="input-field"
                  value={quote.clientCompany}
                  onChange={(e) => updateField("clientCompany", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="client-email">Email</label>
                <input
                  id="client-email"
                  type="email"
                  className="input-field"
                  value={quote.clientEmail}
                  onChange={(e) => updateField("clientEmail", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="client-phone">Teléfono</label>
                <input
                  id="client-phone"
                  className="input-field"
                  value={quote.clientPhone}
                  onChange={(e) => updateField("clientPhone", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="client-address">Dirección</label>
                <input
                  id="client-address"
                  className="input-field"
                  value={quote.clientAddress}
                  onChange={(e) => updateField("clientAddress", e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-coffee-900">
                Productos · UND · Precios
              </h3>
              <button
                type="button"
                className="btn-secondary inline-flex items-center gap-1 text-xs"
                onClick={addItem}
              >
                <Plus className="h-3 w-3" />
                Agregar línea
              </button>
            </div>

            <div className="space-y-3">
              {quote.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-coffee-200 p-3 space-y-3"
                >
                  <div>
                    <label className="label">Producto</label>
                    <input
                      className="input-field"
                      value={item.product}
                      onChange={(e) =>
                        updateItem(item.id, { product: e.target.value })
                      }
                      placeholder="Descripción del producto o servicio"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label">UND</label>
                      <input
                        type="number"
                        min={1}
                        className="input-field"
                        value={item.units}
                        onChange={(e) =>
                          updateItem(item.id, {
                            units: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Precio (COP)</label>
                      <input
                        type="number"
                        min={0}
                        className="input-field"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(item.id, {
                            unitPrice: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Subtotal</label>
                      <p className="input-field bg-coffee-50 font-medium">
                        {formatCurrency(item.units * item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="mr-1 inline h-3 w-3" />
                    Quitar línea
                  </button>
                </div>
              ))}
            </div>

            <p className="text-right text-lg font-bold text-coffee-900">
              Total: {formatCurrency(quoteSubtotal(quote.items))}
            </p>
          </section>

          <section className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-coffee-900">Tiempos / Cronograma</h3>
              <button
                type="button"
                className="btn-secondary inline-flex items-center gap-1 text-xs"
                onClick={addTimeline}
              >
                <Plus className="h-3 w-3" />
                Agregar plazo
              </button>
            </div>
            <div className="space-y-3">
              {quote.timeline.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 sm:grid-cols-2 rounded-lg border border-coffee-200 p-3"
                >
                  <div>
                    <label className="label">Actividad / Entregable</label>
                    <input
                      className="input-field"
                      value={item.activity}
                      onChange={(e) =>
                        updateTimeline(item.id, { activity: e.target.value })
                      }
                      placeholder="Ej. Producción y preparación"
                    />
                  </div>
                  <div>
                    <label className="label">Plazo estimado</label>
                    <input
                      className="input-field"
                      value={item.duration}
                      onChange={(e) =>
                        updateTimeline(item.id, { duration: e.target.value })
                      }
                      placeholder="Ej. 3–5 días hábiles"
                    />
                  </div>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:underline sm:col-span-2"
                    onClick={() => removeTimeline(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="card space-y-4">
            <h3 className="font-semibold text-coffee-900">Notas</h3>
            <textarea
              className="input-field min-h-20"
              value={quote.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Observaciones adicionales para el cliente"
            />
          </section>

          <section className="card space-y-4">
            <h3 className="font-semibold text-coffee-900">Términos y condiciones</h3>
            <textarea
              className="input-field min-h-40 font-mono text-xs"
              value={quote.terms}
              onChange={(e) => updateField("terms", e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() =>
                updateField("terms", createDefaultQuote().terms)
              }
            >
              Restaurar términos por defecto
            </button>
          </section>
        </div>

        <div className="xl:sticky xl:top-4 xl:self-start">
          <p className="mb-3 text-sm font-medium text-coffee-700">
            Vista previa (se actualiza al escribir)
          </p>
          <QuotePreview quote={quote} />
        </div>
      </div>
    </div>
  );
}
