import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import { LoadingState, PageHeader } from "../components/ui";

export default function Alerts() {
  const alerts = useQuery(api.alerts.list);
  const markRead = useMutation(api.alerts.markRead);

  if (alerts === undefined) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Alertas"
        subtitle="Notificaciones de visitas y actividades pendientes"
      />

      {alerts.length === 0 ? (
        <div className="card text-center py-12 text-coffee-600">
          No hay alertas activas.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`card flex items-start gap-4 ${
                alert.read ? "opacity-60" : "border-coffee-400"
              }`}
            >
              <Bell
                className={`h-5 w-5 shrink-0 ${
                  alert.read ? "text-coffee-400" : "text-coffee-600"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-coffee-900">{alert.title}</p>
                <p className="text-sm text-coffee-600">{alert.message}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-coffee-100 px-2 py-0.5 text-coffee-700">
                    {alert.type}
                  </span>
                  {alert.dueDate && (
                    <span className="text-coffee-500">
                      Vence: {alert.dueDate}
                    </span>
                  )}
                  {alert.farmId && (
                    <Link
                      to={`/fincas/${alert.farmId}`}
                      className="text-coffee-600 hover:underline"
                    >
                      Ver finca
                    </Link>
                  )}
                </div>
              </div>
              {!alert.read && (
                <button
                  type="button"
                  className="btn-secondary flex items-center gap-1 shrink-0"
                  onClick={() => markRead({ alertId: alert._id })}
                >
                  <Check className="h-4 w-4" />
                  Marcar leída
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
