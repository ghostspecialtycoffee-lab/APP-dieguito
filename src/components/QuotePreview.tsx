import type { QuoteData } from "../data/quoteTypes";
import { quoteSubtotal } from "../data/quoteTypes";
import { COMPANY_INFO } from "../lib/quoteDefaults";
import { LOGO_PATHS } from "../lib/quoteLogos";
import { formatCurrency } from "../lib/utils";

function formatDate(date: string): string {
  if (!date) return "—";
  return new Date(date + "T12:00:00").toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function QuotePreview({ quote }: { quote: QuoteData }) {
  const subtotal = quoteSubtotal(quote.items);

  return (
    <div
      id="quote-preview"
      className="mx-auto max-w-2xl rounded-xl border border-coffee-200 bg-white shadow-lg"
    >
      <div className="border-b border-coffee-100 bg-coffee-50 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_PATHS.secondary}
              alt="Ghost logo"
              className="h-14 w-14 rounded-lg"
            />
            <img
              src={LOGO_PATHS.primary}
              alt="Ghost Specialty Coffee"
              className="h-10 w-auto max-w-[180px]"
            />
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-coffee-900">
              COTIZACIÓN / PRESUPUESTO
            </p>
            <p className="text-sm text-coffee-600">No. {quote.quoteNumber}</p>
            <p className="text-xs text-coffee-500">
              Fecha: {formatDate(quote.issueDate)}
            </p>
            <p className="text-xs text-coffee-500">
              Válida hasta: {formatDate(quote.validUntil)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-coffee-500">{COMPANY_INFO.tagline}</p>
      </div>

      <div className="px-6 py-5">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-coffee-700">
          Datos del cliente
        </h3>
        <div className="grid gap-1 text-sm text-coffee-800">
          {quote.clientName && <p><span className="text-coffee-500">Nombre:</span> {quote.clientName}</p>}
          {quote.clientCompany && <p><span className="text-coffee-500">Empresa:</span> {quote.clientCompany}</p>}
          {quote.clientEmail && <p><span className="text-coffee-500">Email:</span> {quote.clientEmail}</p>}
          {quote.clientPhone && <p><span className="text-coffee-500">Teléfono:</span> {quote.clientPhone}</p>}
          {quote.clientAddress && <p><span className="text-coffee-500">Dirección:</span> {quote.clientAddress}</p>}
          {quote.projectName && <p><span className="text-coffee-500">Proyecto:</span> {quote.projectName}</p>}
          {!quote.clientName && !quote.clientCompany && (
            <p className="text-coffee-400">Complete los datos del cliente…</p>
          )}
        </div>
      </div>

      <div className="px-6 pb-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-coffee-700">
          Productos y precios
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-coffee-700 text-left text-white">
              <th className="px-3 py-2 font-semibold">Producto</th>
              <th className="px-3 py-2 font-semibold text-center">UND</th>
              <th className="px-3 py-2 font-semibold text-right">Precio</th>
              <th className="px-3 py-2 font-semibold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-coffee-400">
                  Agregue productos a la cotización
                </td>
              </tr>
            ) : (
              quote.items.map((item) => (
                <tr key={item.id} className="border-b border-coffee-100 even:bg-coffee-50">
                  <td className="px-3 py-2 text-coffee-900">
                    {item.product || "—"}
                  </td>
                  <td className="px-3 py-2 text-center text-coffee-700">
                    {item.units}
                  </td>
                  <td className="px-3 py-2 text-right text-coffee-700">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-coffee-900">
                    {formatCurrency(item.units * item.unitPrice)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end border-t border-coffee-200 pt-4">
          <div className="text-right">
            <p className="text-sm text-coffee-600">Total presupuesto</p>
            <p className="text-2xl font-bold text-coffee-900">
              {formatCurrency(subtotal)}
            </p>
          </div>
        </div>
      </div>

      {quote.notes.trim() && (
        <div className="border-t border-coffee-100 px-6 py-4">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-coffee-700">
            Notas
          </h3>
          <p className="text-sm text-coffee-700 whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}

      {quote.timeline.some((t) => t.activity.trim() || t.duration.trim()) && (
        <div className="border-t border-coffee-100 px-6 py-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-coffee-700">
            Tiempos y cronograma
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-coffee-600 text-left text-white">
                <th className="px-3 py-2 font-semibold">Actividad / Entregable</th>
                <th className="px-3 py-2 font-semibold">Plazo estimado</th>
              </tr>
            </thead>
            <tbody>
              {quote.timeline
                .filter((t) => t.activity.trim() || t.duration.trim())
                .map((item) => (
                  <tr key={item.id} className="border-b border-coffee-100">
                    <td className="px-3 py-2 text-coffee-800">{item.activity}</td>
                    <td className="px-3 py-2 text-coffee-600">{item.duration}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-coffee-100 bg-coffee-50 px-6 py-5">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-coffee-700">
          Términos y condiciones
        </h3>
        <p className="text-xs leading-relaxed text-coffee-600 whitespace-pre-wrap">
          {quote.terms.trim() || "Sin términos definidos."}
        </p>
      </div>

      <div className="border-t border-coffee-200 px-6 py-3 text-center text-xs text-coffee-400">
        {COMPANY_INFO.name} · {COMPANY_INFO.email} · {COMPANY_INFO.phone}
      </div>
    </div>
  );
}
