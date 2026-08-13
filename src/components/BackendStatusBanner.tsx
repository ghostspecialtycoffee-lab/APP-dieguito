import { useConvexConnectionState } from "convex/react";
import { isCloudMode } from "../lib/utils";

export function BackendStatusBanner() {
  if (!isCloudMode) {
    return (
      <div className="mb-4 rounded-lg border border-coffee-200 bg-coffee-50 px-4 py-3 text-sm text-coffee-800">
        <strong>Modo local:</strong> los datos se guardan en este navegador.
        Esta app usa <strong>Convex</strong> (no Firebase) para sincronizar en la
        nube. Para activarlo, configure{" "}
        <code className="rounded bg-white px-1 text-xs">VITE_CONVEX_URL</code>{" "}
        y ejecute{" "}
        <code className="rounded bg-white px-1 text-xs">npx convex dev</code>.
      </div>
    );
  }

  const connection = useConvexConnectionState();
  const isOnline = connection.isWebSocketConnected;
  const hasEverConnected = connection.hasEverConnected;

  if (!hasEverConnected && !isOnline) {
    return (
      <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Conectando a Convex…</strong> Si esto persiste, revise{" "}
        <code className="rounded bg-white px-1 text-xs">VITE_CONVEX_URL</code> en
        su despliegue o ejecute{" "}
        <code className="rounded bg-white px-1 text-xs">npm run setup:once</code>.
        (El backend es Convex, no Firebase.)
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
        <strong>Sin conexión a Convex.</strong> Los cambios no se sincronizarán
        hasta recuperar la conexión. Verifique internet y la URL del backend.
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
      <strong>Convex conectado</strong> — datos en la nube activos.
    </div>
  );
}
