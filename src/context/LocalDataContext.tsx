import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LocalDatabase } from "../data/types";
import * as localDb from "../data/localDb";

type LocalDataContextValue = {
  db: LocalDatabase;
  refresh: () => void;
};

const LocalDataContext = createContext<LocalDataContextValue | null>(null);

export function LocalDataProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<LocalDatabase>(() => localDb.loadDatabase());

  const refresh = useCallback(() => {
    setDb(localDb.loadDatabase());
  }, []);

  const value = useMemo(() => ({ db, refresh }), [db, refresh]);

  return (
    <LocalDataContext.Provider value={value}>{children}</LocalDataContext.Provider>
  );
}

export function useLocalData(): LocalDataContextValue {
  const ctx = useContext(LocalDataContext);
  if (!ctx) {
    throw new Error("useLocalData requiere LocalDataProvider");
  }
  return ctx;
}

export function useLocalDataOptional(): LocalDataContextValue | null {
  return useContext(LocalDataContext);
}
