import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  FileText,
  FileSpreadsheet,
  Download,
  BarChart3,
  History,
} from "lucide-react";
import { PageHeader } from "../components/ui";

const reportCards = [
  {
    title: "Informe por Visita",
    desc: "Reporte detallado de una visita específica",
    icon: FileText,
    action: "Generar PDF",
  },
  {
    title: "Informe Consolidado",
    desc: "Resumen de todas las visitas y actividades",
    icon: BarChart3,
    action: "Generar PDF",
  },
  {
    title: "Reporte de Finca",
    desc: "Estado general con indicadores clave",
    icon: FileText,
    action: "Generar PDF",
  },
  {
    title: "Historial de Actividades",
    desc: "Cronología de actividades y recomendaciones",
    icon: History,
    action: "Generar PDF",
  },
  {
    title: "Exportar Datos",
    desc: "Exportar información a Excel o CSV",
    icon: FileSpreadsheet,
    action: "Exportar",
  },
];

export default function Reports() {
  const farms = useQuery(api.farms.list);

  const handleExport = (title: string) => {
    if (!farms) return;
    const data = JSON.stringify(farms, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Informes y Reportes"
        subtitle="Generación de informes técnicos y exportación de datos"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((card) => (
          <div key={card.title} className="card flex flex-col">
            <card.icon className="h-8 w-8 text-coffee-500" />
            <h3 className="mt-3 font-semibold text-coffee-900">{card.title}</h3>
            <p className="mt-1 flex-1 text-sm text-coffee-600">{card.desc}</p>
            <button
              type="button"
              className="btn-primary mt-4 flex items-center justify-center gap-2"
              onClick={() => handleExport(card.title)}
            >
              <Download className="h-4 w-4" />
              {card.action}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 card bg-coffee-50">
        <h3 className="font-semibold text-coffee-900">
          Funcionalidades adicionales
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-coffee-700">
          <li>• Calendario de visitas con programación y recordatorios</li>
          <li>• Alertas y notificaciones para visitas y actividades</li>
          <li>• Respaldo en la nube con Convex</li>
          <li>• Gestión de usuarios y permisos (próximamente)</li>
        </ul>
      </div>
    </div>
  );
}
