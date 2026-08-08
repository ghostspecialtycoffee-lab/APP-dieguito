import { Link } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-coffee-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-coffee-600">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16 text-coffee-600">
      Cargando…
    </div>
  );
}

export function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center py-12 text-center">
      <p className="text-coffee-600">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function FarmBreadcrumb({
  farmId,
  farmName,
  current,
}: {
  farmId: Id<"farms">;
  farmName: string;
  current?: string;
}) {
  return (
    <nav className="mb-4 text-sm text-coffee-600">
      <Link to="/fincas" className="hover:text-coffee-800">Fincas</Link>
      <span className="mx-2">/</span>
      <Link to={`/fincas/${farmId}`} className="hover:text-coffee-800">
        {farmName}
      </Link>
      {current && (
        <>
          <span className="mx-2">/</span>
          <span className="text-coffee-900 font-medium">{current}</span>
        </>
      )}
    </nav>
  );
}

export function FlowSteps() {
  const steps = [
    { title: "Registro de Finca", desc: "Datos generales, ubicación, productor" },
    { title: "Diagnóstico Inicial", desc: "Cultivo, fertilización, suelos" },
    { title: "Plan de Trabajo", desc: "Objetivos y actividades" },
    { title: "Visitas Técnicas", desc: "Seguimiento y evidencias" },
    { title: "Informes", desc: "Reportes y exportación PDF" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, i) => (
        <div
          key={step.title}
          className="card relative border-coffee-300 bg-coffee-50"
        >
          <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-coffee-600 text-sm font-bold text-white">
            {i + 1}
          </span>
          <h3 className="font-semibold text-coffee-900">{step.title}</h3>
          <p className="mt-1 text-xs text-coffee-600">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}
