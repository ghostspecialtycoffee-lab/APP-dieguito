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
      className="mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-white shadow-lg"
    >
      <div className="border-b border-neutral-200 px-6 py-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={LOGO_PATHS.secondary}
              alt="Ghost Specialty Coffee"
              className="h-20 w-auto shrink-0 object-contain"
            />
            <img
              src={LOGO_PATHS.primary}
              alt="Ghost Specialty Coffee wordmark"
              className="hidden h-12 w-auto max-w-[220px] object-contain sm:block"
            />
          </div>
          <div className="text-right shrink-0">
            <p className="text-base font-bold uppercase tracking-wide text-neutral-900">
              Cotización / Presupuesto
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-700">
              No. {quote.quoteNumber}
            </p>
            <p className="text-xs text-neutral-500">
              Fecha: {formatDate(quote.issueDate)}
            </p>
            <p className="text-xs text-neutral-500">
              Válida hasta: {formatDate(quote.validUntil)}
            </p>
          </div>
        </div>
        <img
          src={LOGO_PATHS.primary}
          alt="Ghost Specialty Coffee"
          className="mt-4 h-10 w-auto max-w-full object-contain sm:hidden"
        />
      </div>

      <div className="px-6 py-5">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-800">
          Datos del cliente
        </h3>
        <div className="grid gap-1 text-sm text-neutral-800">
          {quote.clientName && (
            <p>
              <span className="text-neutral-500">Nombre:</span> {quote.clientName}
            </p>
          )}
          {quote.clientCompany && (
            <p>
              <span className="text-neutral-500">Empresa:</span>{" "}
              {quote.clientCompany}
            </p>
          )}
          {quote.clientEmail && (
            <p>
              <span className="text-neutral-500">Email:</span> {quote.clientEmail}
            </p>
          )}
          {quote.clientPhone && (
            <p>
              <span className="text-neutral-500">Teléfono:</span> {quote.clientPhone}
            </p>
          )}
          {quote.clientAddress && (
            <p>
              <span className="text-neutral-500">Dirección:</span>{" "}
              {quote.clientAddress}
            </p>
          )}
          {quote.projectName && (
            <p>
              <span className="text-neutral-500">Proyecto:</span>{" "}
              {quote.projectName}
            </p>
          )}
          {!quote.clientName && !quote.clientCompany && (
            <p className="text-neutral-400">Complete los datos del cliente…</p>
          )}
        </div>
      </div>

      <div className="px-6 pb-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-800">
          Productos y precios
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-900 text-left text-white">
              <th className="px-3 py-2.5 font-semibold">Producto</th>
              <th className="px-3 py-2.5 font-semibold text-center w-16">UND</th>
              <th className="px-3 py-2.5 font-semibold text-right w-28">Precio</th>
              <th className="px-3 py-2.5 font-semibold text-right w-28">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-4 text-center text-neutral-400"
                >
                  Agregue productos a la cotización
                </td>
              </tr>
            ) : (
              quote.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-100 even:bg-neutral-50"
                >
                  <td className="px-3 py-2.5 text-neutral-900">
                    {item.product || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-center text-neutral-700">
                    {item.units}
                  </td>
                  <td className="px-3 py-2.5 text-right text-neutral-700">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium text-neutral-900">
                    {formatCurrency(item.units * item.unitPrice)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end border-t border-neutral-200 pt-4">
          <div className="text-right">
            <p className="text-sm text-neutral-500">Total presupuesto</p>
            <p className="text-2xl font-bold text-neutral-900">
              {formatCurrency(subtotal)}
            </p>
          </div>
        </div>
      </div>

      {quote.notes.trim() && (
        <div className="border-t border-neutral-100 px-6 py-4">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-800">
            Notas
          </h3>
          <p className="text-sm text-neutral-700 whitespace-pre-wrap">
            {quote.notes}
          </p>
        </div>
      )}

      {quote.timeline.some((t) => t.activity.trim() || t.duration.trim()) && (
        <div className="border-t border-neutral-100 px-6 py-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-800">
            Tiempos y cronograma
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-800 text-left text-white">
                <th className="px-3 py-2 font-semibold">
                  Actividad / Entregable
                </th>
                <th className="px-3 py-2 font-semibold w-40">Plazo estimado</th>
              </tr>
            </thead>
            <tbody>
              {quote.timeline
                .filter((t) => t.activity.trim() || t.duration.trim())
                .map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="px-3 py-2 text-neutral-800">
                      {item.activity}
                    </td>
                    <td className="px-3 py-2 text-neutral-600">
                      {item.duration}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-5">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-800">
          Términos y condiciones
        </h3>
        <p className="text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
          {quote.terms.trim() || "Sin términos definidos."}
        </p>
      </div>

      <div className="border-t border-neutral-200 px-6 py-3 text-center text-xs text-neutral-400">
        {COMPANY_INFO.name} · {COMPANY_INFO.email} · {COMPANY_INFO.phone}
      </div>
    </div>
  );
}
