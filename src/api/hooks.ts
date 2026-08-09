import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useLocalDataOptional } from "../context/LocalDataContext";
import * as store from "../data/localDb";
import type {
  Alert,
  Diagnostic,
  Farm,
  Visit,
  WorkPlan,
  WorkPlanActivity,
} from "../data/types";
import { isCloudMode } from "../lib/appMode";

export function useFarmsList(): Farm[] | undefined {
  const local = useLocalDataOptional();
  const convex = useQuery(api.farms.list, isCloudMode ? {} : "skip");
  if (!isCloudMode && local) {
    return store.listFarms(local.db);
  }
  return convex as Farm[] | undefined;
}

export function useFarm(farmId: string | undefined): Farm | null | undefined {
  const local = useLocalDataOptional();
  const convex = useQuery(
    api.farms.get,
    isCloudMode && farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  if (!isCloudMode && local) {
    if (!farmId) return undefined;
    return store.getFarm(local.db, farmId);
  }
  return convex as Farm | null | undefined;
}

export function useCreateFarm() {
  const local = useLocalDataOptional();
  const convexMut = useMutation(api.farms.create);

  return async (args: {
    name: string;
    owner: string;
    address: string;
    altitude: number;
    areaHa: number;
    plantCount?: number;
    variety?: string;
    sowingDate?: string;
  }) => {
    if (!isCloudMode && local) {
      const id = store.createFarm(local.db, args);
      local.refresh();
      return id;
    }
    return convexMut(args);
  };
}

export function useUpdateFarm() {
  const local = useLocalDataOptional();
  const convexMut = useMutation(api.farms.update);

  return async (args: {
    farmId: string;
    name?: string;
    owner?: string;
    address?: string;
    altitude?: number;
    areaHa?: number;
    plantCount?: number;
    variety?: string;
    sowingDate?: string;
  }) => {
    if (!isCloudMode && local) {
      const { farmId, ...patch } = args;
      store.updateFarm(local.db, farmId, patch);
      local.refresh();
      return null;
    }
    return convexMut({
      farmId: args.farmId as Id<"farms">,
      name: args.name,
      owner: args.owner,
      address: args.address,
      altitude: args.altitude,
      areaHa: args.areaHa,
      plantCount: args.plantCount,
      variety: args.variety,
      sowingDate: args.sowingDate,
    });
  };
}

export function useVisitsByFarm(
  farmId: string | undefined,
): Visit[] | undefined {
  const local = useLocalDataOptional();
  const convex = useQuery(
    api.visits.listByFarm,
    isCloudMode && farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  if (!isCloudMode && local) {
    if (!farmId) return undefined;
    return store.listVisitsByFarm(local.db, farmId);
  }
  return convex as Visit[] | undefined;
}

export function useVisit(visitId: string | undefined): Visit | null | undefined {
  const local = useLocalDataOptional();
  const convex = useQuery(
    api.visits.get,
    isCloudMode && visitId ? { visitId: visitId as Id<"visits"> } : "skip",
  );
  if (!isCloudMode && local) {
    if (!visitId) return undefined;
    return store.getVisit(local.db, visitId);
  }
  return convex as Visit | null | undefined;
}

export function useCreateVisit() {
  const local = useLocalDataOptional();
  const convexMut = useMutation(api.visits.create);

  return async (args: {
    farmId: string;
    date: string;
    visitType: string;
    technician: string;
    weather?: string;
    observations?: string;
    activities: string[];
    recommendations: string[];
    photoUrls: string[];
    nextVisitDate?: string;
  }) => {
    if (!isCloudMode && local) {
      const id = store.createVisit(local.db, args);
      local.refresh();
      return id;
    }
    return convexMut({
      ...args,
      farmId: args.farmId as Id<"farms">,
    });
  };
}

export function useUpdateVisit() {
  const local = useLocalDataOptional();
  const convexMut = useMutation(api.visits.update);

  return async (args: {
    visitId: string;
    date?: string;
    visitType?: string;
    technician?: string;
    weather?: string;
    observations?: string;
    activities?: string[];
    recommendations?: string[];
    photoUrls?: string[];
    nextVisitDate?: string;
  }) => {
    if (!isCloudMode && local) {
      const { visitId, ...patch } = args;
      store.updateVisit(local.db, visitId, patch);
      local.refresh();
      return null;
    }
    const { visitId, ...rest } = args;
    return convexMut({
      visitId: visitId as Id<"visits">,
      ...rest,
    });
  };
}

export function useDiagnosticByFarm(
  farmId: string | undefined,
): Diagnostic | null | undefined {
  const local = useLocalDataOptional();
  const convex = useQuery(
    api.diagnostics.getByFarm,
    isCloudMode && farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  if (!isCloudMode && local) {
    if (!farmId) return undefined;
    return store.getDiagnosticByFarm(local.db, farmId);
  }
  return convex as Diagnostic | null | undefined;
}

export function useUpsertDiagnostic() {
  const local = useLocalDataOptional();
  const convexMut = useMutation(api.diagnostics.upsert);

  return async (args: {
    farmId: string;
    cropAge?: number;
    spacing?: string;
    shadeType?: string;
    sowingSystem?: string;
    fertilizationFreq?: string;
    lastFertilization?: string;
    observations?: string;
    soilPh?: number;
    organicMatter?: number;
    phosphorus?: number;
    potassium?: number;
    calcium?: number;
    magnesium?: number;
    aluminum?: number;
    soilPdfName?: string;
  }) => {
    if (!isCloudMode && local) {
      const id = store.upsertDiagnostic(local.db, args);
      local.refresh();
      return id;
    }
    return convexMut({
      ...args,
      farmId: args.farmId as Id<"farms">,
    });
  };
}

export function useWorkPlanByFarm(
  farmId: string | undefined,
): WorkPlan | null | undefined {
  const local = useLocalDataOptional();
  const convex = useQuery(
    api.workPlans.getByFarm,
    isCloudMode && farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  if (!isCloudMode && local) {
    if (!farmId) return undefined;
    return store.getWorkPlanByFarm(local.db, farmId);
  }
  return convex as WorkPlan | null | undefined;
}

export function useUpsertWorkPlan() {
  const local = useLocalDataOptional();
  const convexMut = useMutation(api.workPlans.upsert);

  return async (args: {
    farmId: string;
    objective: string;
    activities: WorkPlanActivity[];
    responsible?: string;
    scheduleStart?: string;
    scheduleEnd?: string;
  }) => {
    if (!isCloudMode && local) {
      const id = store.upsertWorkPlan(local.db, args);
      local.refresh();
      return id;
    }
    return convexMut({
      ...args,
      farmId: args.farmId as Id<"farms">,
    });
  };
}

export function useAlertsList(): Alert[] | undefined {
  const local = useLocalDataOptional();
  const convex = useQuery(api.alerts.list, isCloudMode ? {} : "skip");
  if (!isCloudMode && local) {
    return store.listAlerts(local.db);
  }
  return convex as Alert[] | undefined;
}

export function useMarkAlertRead() {
  const local = useLocalDataOptional();
  const convexMut = useMutation(api.alerts.markRead);

  return async (alertId: string) => {
    if (!isCloudMode && local) {
      store.markAlertRead(local.db, alertId);
      local.refresh();
      return null;
    }
    return convexMut({ alertId: alertId as Id<"alerts"> });
  };
}

export function useSeedData() {
  const local = useLocalDataOptional();
  const convexMut = useMutation(api.seed.seed);

  return async () => {
    if (!isCloudMode && local) {
      local.refresh();
      return null;
    }
    return convexMut({});
  };
}
