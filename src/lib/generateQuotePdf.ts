import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { QuoteData } from "../data/quoteTypes";
import { quoteSubtotal } from "../data/quoteTypes";
import { COMPANY_INFO } from "./quoteDefaults";
import { formatCurrency } from "./utils";
import { loadQuoteLogos } from "./quoteLogos";

function formatDate(date: string): string {
  if (!date) return "—";
  return new Date(date + "T12:00:00").toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateQuotePdf(quote: QuoteData): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = margin;

  const logos = await loadQuoteLogos();

  if (logos.secondary) {
    doc.addImage(logos.secondary, "PNG", margin, y, 22, 28);
  }
  if (logos.primary) {
    doc.addImage(logos.primary, "PNG", margin + 26, y + 4, 52, 18);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text("COTIZACIÓN / PRESUPUESTO", pageWidth - margin, y + 8, {
    align: "right",
  });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`No. ${quote.quoteNumber}`, pageWidth - margin, y + 14, {
    align: "right",
  });
  doc.text(`Fecha: ${formatDate(quote.issueDate)}`, pageWidth - margin, y + 19, {
    align: "right",
  });
  doc.text(
    `Válida hasta: ${formatDate(quote.validUntil)}`,
    pageWidth - margin,
    y + 24,
    { align: "right" },
  );

  y += 34;

  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);
  doc.text("DATOS DEL CLIENTE", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);

  const clientLines = [
    quote.clientName && `Nombre: ${quote.clientName}`,
    quote.clientCompany && `Empresa: ${quote.clientCompany}`,
    quote.clientEmail && `Email: ${quote.clientEmail}`,
    quote.clientPhone && `Teléfono: ${quote.clientPhone}`,
    quote.clientAddress && `Dirección: ${quote.clientAddress}`,
    quote.projectName && `Proyecto: ${quote.projectName}`,
  ].filter(Boolean) as string[];

  if (clientLines.length === 0) {
    clientLines.push("Cliente por definir");
  }

  clientLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 4.5;
  });

  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("DETALLE DE PRODUCTOS Y PRECIOS", margin, y);
  y += 2;

  const tableBody = quote.items.map((item) => [
    item.product || "—",
    String(item.units),
    formatCurrency(item.unitPrice),
    formatCurrency(item.units * item.unitPrice),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Producto", "UND", "Precio", "Subtotal"]],
    body: tableBody.length > 0 ? tableBody : [["—", "—", "—", "—"]],
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [20, 20, 20],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    theme: "grid",
  });

  y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ?.finalY ?? y + 20;
  y += 6;

  const subtotal = quoteSubtotal(quote.items);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text(`TOTAL PRESUPUESTO: ${formatCurrency(subtotal)}`, margin, y);
  y += 8;

  if (quote.notes.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text("NOTAS", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    const noteLines = doc.splitTextToSize(quote.notes, pageWidth - margin * 2);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 4 + 4;
  }

  if (quote.timeline.some((t) => t.activity.trim() || t.duration.trim())) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("TIEMPOS Y CRONOGRAMA", margin, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [["Actividad / Entregable", "Plazo estimado"]],
      body: quote.timeline
        .filter((t) => t.activity.trim() || t.duration.trim())
        .map((t) => [t.activity || "—", t.duration || "—"]),
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [40, 40, 40],
        textColor: 255,
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
      theme: "grid",
    });

    y =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? y + 16;
    y += 8;
  }

  const termsY = y;
  const pageHeight = doc.internal.pageSize.getHeight();
  if (termsY > pageHeight - 50) {
    doc.addPage();
    y = margin;
  } else {
    y = termsY;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text("TÉRMINOS Y CONDICIONES", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const termsLines = doc.splitTextToSize(
    quote.terms.trim() || "Sin términos definidos.",
    pageWidth - margin * 2,
  );
  doc.text(termsLines, margin, y);

  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `${COMPANY_INFO.name} · ${COMPANY_INFO.email} · ${COMPANY_INFO.phone}`,
    pageWidth / 2,
    footerY,
    { align: "center" },
  );

  doc.save(`cotizacion-${quote.quoteNumber}.pdf`);
}
