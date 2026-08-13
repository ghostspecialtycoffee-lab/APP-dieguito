import {
  createEmptyLineItem,
  createEmptyTimelineItem,
  generateQuoteNumber,
  type QuoteData,
} from "../data/quoteTypes";
import { todayIso } from "./utils";

const DEFAULT_TERMS = `1. Validez: Esta cotización tiene una vigencia de 15 días calendario desde la fecha de emisión.

2. Precios: Todos los precios están expresados en pesos colombianos (COP) e incluyen los impuestos aplicables, salvo indicación contraria.

3. Forma de pago: 50% anticipo al confirmar el pedido y 50% contra entrega, o según acuerdo comercial previo.

4. Tiempos de entrega: Los plazos indicados en el cronograma son estimados y pueden variar según disponibilidad de insumos y confirmación del pedido.

5. Cambios: Cualquier modificación al alcance, cantidades o especificaciones puede afectar precios y tiempos de entrega.

6. Aceptación: La aceptación de esta cotización implica conformidad con los términos y condiciones aquí descritos.

7. Ghost Specialty Coffee se reserva el derecho de actualizar precios ante variaciones significativas en costos de insumos o logística.`;

function defaultValidUntil(): string {
  const d = new Date();
  d.setDate(d.getDate() + 15);
  return d.toISOString().slice(0, 10);
}

export function createDefaultQuote(): QuoteData {
  return {
    quoteNumber: generateQuoteNumber(),
    issueDate: todayIso(),
    validUntil: defaultValidUntil(),
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    projectName: "",
    notes: "",
    items: [
      {
        ...createEmptyLineItem(),
        product: "Café especial de origen — bolsa 250 g",
        units: 10,
        unitPrice: 28000,
      },
      {
        ...createEmptyLineItem(),
        product: "Servicio de tostión personalizada",
        units: 1,
        unitPrice: 150000,
      },
    ],
    timeline: [
      {
        ...createEmptyTimelineItem(),
        activity: "Confirmación de pedido y anticipo",
        duration: "1 día hábil",
      },
      {
        ...createEmptyTimelineItem(),
        activity: "Producción y preparación",
        duration: "3–5 días hábiles",
      },
      {
        ...createEmptyTimelineItem(),
        activity: "Entrega o despacho",
        duration: "1–2 días hábiles",
      },
    ],
    terms: DEFAULT_TERMS,
  };
}

export const COMPANY_INFO = {
  name: "Ghost Specialty Coffee",
  tagline: "Café de especialidad — origen, calidad y experiencia",
  email: "ventas@ghostspecialtycoffee.com",
  phone: "+57 300 000 0000",
  website: "www.ghostspecialtycoffee.com",
  address: "Colombia",
};
