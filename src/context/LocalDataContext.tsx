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
  setDb: (db: LocalDatabase) => void;
};

const LocalDataContext = createContext<LocalDataContextValue | null>(null);

export function LocalDataProvider({ children }: { children: ReactNode }) {
  const [db, setDbState] = useState<LocalDatabase>(() => localDb.loadDatabase());

  const refresh = useCallback(() => {
    setDbState(localDb.loadDatabase());
  }, []);

  const setDb = useCallback((next: LocalDatabase) => {
    setDbState(next);
  }, []);

  const value = useMemo(
    () => ({ db, refresh, setDb }),
    [db, refresh, setDb],
  );

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
