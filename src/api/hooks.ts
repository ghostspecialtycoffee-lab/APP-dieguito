import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useLocalData } from "../context/LocalDataContext";
import { isCloudMode } from "../lib/utils";
import * as localDb from "../data/localDb";
import type { PaymentMethod, Product, ProductCategory } from "../data/types";

export function useProducts(activeOnly = false) {
  const cloud = useQuery(
    api.products.list,
    isCloudMode ? { activeOnly } : "skip",
  );
  const { db } = useLocalData();

  if (isCloudMode) {
    return {
      products: cloud ?? [],
      loading: cloud === undefined,
    };
  }

  return {
    products: localDb.listProducts(db, activeOnly),
    loading: false,
  };
}

export function useSalesByDateRange(startDate: string, endDate: string) {
  const cloud = useQuery(
    api.sales.listByDateRange,
    isCloudMode ? { startDate, endDate } : "skip",
  );
  const { db } = useLocalData();

  if (isCloudMode) {
    return {
      sales: cloud ?? [],
      loading: cloud === undefined,
    };
  }

  return {
    sales: localDb.listSalesByDateRange(db, startDate, endDate),
    loading: false,
  };
}

export function useSalesSummary(startDate: string, endDate: string) {
  const cloud = useQuery(
    api.sales.summary,
    isCloudMode ? { startDate, endDate } : "skip",
  );
  const { db } = useLocalData();

  if (isCloudMode) {
    return {
      summary: cloud ?? null,
      loading: cloud === undefined,
    };
  }

  return {
    summary: localDb.computeSummary(db, startDate, endDate),
    loading: false,
  };
}

export function useProductMutations() {
  const createCloud = useMutation(api.products.create);
  const updateCloud = useMutation(api.products.update);
  const removeCloud = useMutation(api.products.remove);
  const { db, setDb } = useLocalData();

  return {
    create: async (data: {
      name: string;
      category: ProductCategory;
      price: number;
    }) => {
      if (isCloudMode) {
        return await createCloud(data);
      }
      setDb(localDb.createProduct(db, data));
    },
    update: async (
      productId: string,
      updates: Partial<Pick<Product, "name" | "category" | "price" | "active">>,
    ) => {
      if (isCloudMode) {
        await updateCloud({
          productId: productId as Id<"products">,
          ...updates,
        });
        return;
      }
      setDb(localDb.updateProduct(db, productId, updates));
    },
    remove: async (productId: string) => {
      if (isCloudMode) {
        await removeCloud({ productId: productId as Id<"products"> });
        return;
      }
      setDb(localDb.deactivateProduct(db, productId));
    },
  };
}

export function useSaleMutations() {
  const createCloud = useMutation(api.sales.create);
  const removeCloud = useMutation(api.sales.remove);
  const { db, setDb } = useLocalData();

  return {
    create: async (data: {
      date: string;
      items: Array<{
        productId?: string;
        productName: string;
        quantity: number;
        unitPrice: number;
      }>;
      paymentMethod: PaymentMethod;
      notes?: string;
    }) => {
      if (isCloudMode) {
        return await createCloud({
          ...data,
          items: data.items.map((item) => ({
            ...item,
            productId: item.productId as Id<"products"> | undefined,
          })),
        });
      }
      setDb(localDb.createSale(db, data));
    },
    remove: async (saleId: string) => {
      if (isCloudMode) {
        await removeCloud({ saleId: saleId as Id<"sales"> });
        return;
      }
      setDb(localDb.deleteSale(db, saleId));
    },
  };
}
