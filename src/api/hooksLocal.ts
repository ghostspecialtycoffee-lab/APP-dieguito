import { useLocalData } from "../context/LocalDataContext";
import * as localDb from "../data/localDb";
import type { PaymentMethod, Product, ProductCategory } from "../data/types";

export function useProducts(activeOnly = false) {
  const { db } = useLocalData();
  return {
    products: localDb.listProducts(db, activeOnly),
    loading: false,
  };
}

export function useSalesByDateRange(startDate: string, endDate: string) {
  const { db } = useLocalData();
  return {
    sales: localDb.listSalesByDateRange(db, startDate, endDate),
    loading: false,
  };
}

export function useSalesSummary(startDate: string, endDate: string) {
  const { db } = useLocalData();
  return {
    summary: localDb.computeSummary(db, startDate, endDate),
    loading: false,
  };
}

export function useProductMutations() {
  const { db, setDb } = useLocalData();

  return {
    create: async (data: {
      name: string;
      category: ProductCategory;
      price: number;
    }) => {
      setDb(localDb.createProduct(db, data));
    },
    update: async (
      productId: string,
      updates: Partial<Pick<Product, "name" | "category" | "price" | "active">>,
    ) => {
      setDb(localDb.updateProduct(db, productId, updates));
    },
    remove: async (productId: string) => {
      setDb(localDb.deactivateProduct(db, productId));
    },
  };
}

export function useSaleMutations() {
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
      setDb(localDb.createSale(db, data));
    },
    remove: async (saleId: string) => {
      setDb(localDb.deleteSale(db, saleId));
    },
  };
}
