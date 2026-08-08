import { Cloud, Users, Shield, Database } from "lucide-react";
import { PageHeader } from "../components/ui";

export default function Settings() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  return (
    <div>
      <PageHeader
        title="Configuración"
        subtitle="Ajustes del programa y gestión de usuarios"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-coffee-600" />
            <h3 className="font-semibold text-coffee-900">Respaldo en la nube</h3>
          </div>
          <p className="text-sm text-coffee-600">
            Los datos se almacenan en Convex para acceso seguro desde cualquier
            dispositivo.
          </p>
          <p className="text-sm">
            Estado:{" "}
            <span
              className={
                hasConvex
                  ? "font-medium text-green-700"
                  : "font-medium text-amber-700"
              }
            >
              {hasConvex ? "Conectado" : "No configurado"}
            </span>
          </p>
        </div>

        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-coffee-600" />
            <h3 className="font-semibold text-coffee-900">Usuarios y permisos</h3>
          </div>
          <p className="text-sm text-coffee-600">
            Gestión de técnicos y niveles de acceso. Disponible en versión
            futura con autenticación.
          </p>
        </div>

        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-coffee-600" />
            <h3 className="font-semibold text-coffee-900">Seguridad</h3>
          </div>
          <p className="text-sm text-coffee-600">
            Autenticación y control de acceso por rol (administrador, técnico,
            consultor).
          </p>
        </div>

        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-coffee-600" />
            <h3 className="font-semibold text-coffee-900">Datos del programa</h3>
          </div>
          <p className="text-sm text-coffee-600">
            Fincas, diagnósticos, planes de trabajo, visitas y alertas se
            sincronizan en tiempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
