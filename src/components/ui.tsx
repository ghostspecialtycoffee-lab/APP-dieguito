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

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card">
      <p className="text-sm font-medium text-coffee-600">{label}</p>
      <p className="mt-2 text-2xl font-bold text-coffee-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-coffee-500">{hint}</p>}
    </div>
  );
}
