import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";

export default function SeedBanner() {
  const seed = useMutation(api.seed.seed);
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  useEffect(() => {
    if (!hasConvex) return;
    seed()
      .then(() => setSeeded(true))
      .catch((e: Error) => setError(e.message));
  }, [hasConvex, seed]);

  if (!hasConvex) {
    return (
      <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
        Conecte Convex para persistencia en la nube. Ejecute{" "}
        <code className="rounded bg-amber-200 px-1">npx convex dev</code> y
        configure <code className="rounded bg-amber-200 px-1">VITE_CONVEX_URL</code>.
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
