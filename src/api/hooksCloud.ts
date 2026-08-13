import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { PaymentMethod, Product, ProductCategory } from "../data/types";

export function useProducts(activeOnly = false) {
  const cloud = useQuery(api.products.list, { activeOnly });
  return {
    products: cloud ?? [],
    loading: cloud === undefined,
  };
}

export function useSalesByDateRange(startDate: string, endDate: string) {
  const cloud = useQuery(api.sales.listByDateRange, { startDate, endDate });
  return {
    sales: cloud ?? [],
    loading: cloud === undefined,
  };
}

export function useSalesSummary(startDate: string, endDate: string) {
  const cloud = useQuery(api.sales.summary, { startDate, endDate });
  return {
    summary: cloud ?? null,
    loading: cloud === undefined,
  };
}

export function useProductMutations() {
  const createCloud = useMutation(api.products.create);
  const updateCloud = useMutation(api.products.update);
  const removeCloud = useMutation(api.products.remove);

  return {
    create: async (data: {
      name: string;
      category: ProductCategory;
      price: number;
    }) => {
      return await createCloud(data);
    },
    update: async (
      productId: string,
      updates: Partial<Pick<Product, "name" | "category" | "price" | "active">>,
    ) => {
      await updateCloud({
        productId: productId as Id<"products">,
        ...updates,
      });
    },
    remove: async (productId: string) => {
      await removeCloud({ productId: productId as Id<"products"> });
    },
  };
}

export function useSaleMutations() {
  const createCloud = useMutation(api.sales.create);
  const removeCloud = useMutation(api.sales.remove);

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
      return await createCloud({
        ...data,
        items: data.items.map((item) => ({
          ...item,
          productId: item.productId as Id<"products"> | undefined,
        })),
      });
    },
    remove: async (saleId: string) => {
      await removeCloud({ saleId: saleId as Id<"sales"> });
    },
  };
}
