import { useEffect, useState } from "react";
import { isCloudMode } from "../lib/appMode";
import { useSeedData } from "../api/hooks";

export default function SeedBanner() {
  const seed = useSeedData();
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCloudMode) {
      setSeeded(true);
      return;
    }
    seed()
      .then(() => setSeeded(true))
      .catch((e: Error) => setError(e.message));
  }, [seed]);

  if (!isCloudMode) {
    return (
      <div className="bg-coffee-100 border-b border-coffee-300 px-4 py-2 text-center text-sm text-coffee-800">
        Modo demostración: los datos se guardan en este navegador. Para respaldo
        en la nube, configure Convex con{" "}
        <code className="rounded bg-coffee-200 px-1">npm run setup:finish</code>.
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-b border-red-300 px-4 py-2 text-center text-sm text-red-900">
        Error al inicializar datos: {error}
      </div>
    );
  }

  if (seeded) return null;

  return (
    <div className="bg-coffee-100 border-b border-coffee-300 px-4 py-2 text-center text-sm text-coffee-800">
      Inicializando datos de demostración…
    </div>
  );
}
