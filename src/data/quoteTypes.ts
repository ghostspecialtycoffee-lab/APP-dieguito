export type QuoteLineItem = {
  id: string;
  product: string;
  units: number;
  unitPrice: number;
};

export type QuoteTimelineItem = {
  id: string;
  activity: string;
  duration: string;
};

export type QuoteData = {
  quoteNumber: string;
  issueDate: string;
  validUntil: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  projectName: string;
  notes: string;
  items: QuoteLineItem[];
  timeline: QuoteTimelineItem[];
  terms: string;
};

export function createEmptyLineItem(): QuoteLineItem {
  return {
    id: crypto.randomUUID(),
    product: "",
    units: 1,
    unitPrice: 0,
  };
}

export function createEmptyTimelineItem(): QuoteTimelineItem {
  return {
    id: crypto.randomUUID(),
    activity: "",
    duration: "",
  };
}

export function quoteSubtotal(items: QuoteLineItem[]): number {
  return items.reduce((sum, item) => sum + item.units * item.unitPrice, 0);
}

export function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-4);
  return `COT-${year}-${suffix}`;
}
