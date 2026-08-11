export type ProductCategory = "bebida" | "comida" | "otro";
export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia";

export type Product = {
  id?: string;
  _id?: string;
  name: string;
  category: ProductCategory;
  price: number;
  active: boolean;
  createdAt: number;
};

export type SaleItem = {
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Sale = {
  id?: string;
  _id?: string;
  date: string;
  items: SaleItem[];
  paymentMethod: PaymentMethod;
  total: number;
  notes?: string;
  createdAt: number;
};

export type LocalDatabase = {
  products: Product[];
  sales: Sale[];
  seeded: boolean;
};

export type SalesSummary = {
  totalSales: number;
  transactionCount: number;
  byPaymentMethod: Record<PaymentMethod, number>;
  topProducts: Array<{
    productName: string;
    quantity: number;
    revenue: number;
  }>;
};
