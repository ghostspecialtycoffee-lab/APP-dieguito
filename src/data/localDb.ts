import type { LocalDatabase, PaymentMethod, Product, Sale } from "./types";

const STORAGE_KEY = "ghost-sales-db-v1";

function createId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const defaultProducts: Omit<Product, "id" | "createdAt">[] = [
  { name: "Espresso", category: "bebida", price: 3500, active: true },
  { name: "Cappuccino", category: "bebida", price: 5500, active: true },
  { name: "Latte", category: "bebida", price: 6000, active: true },
  { name: "Americano", category: "bebida", price: 4500, active: true },
  { name: "Cold Brew", category: "bebida", price: 6500, active: true },
  { name: "Croissant", category: "comida", price: 4000, active: true },
  { name: "Brownie", category: "comida", price: 4500, active: true },
  { name: "Bolsa 250g", category: "otro", price: 28000, active: true },
];

function seedDatabase(): LocalDatabase {
  const now = Date.now();
  const products: Product[] = defaultProducts.map((p) => ({
    ...p,
    id: createId(),
    createdAt: now,
  }));

  const espresso = products.find((p) => p.name === "Espresso");
  const cappuccino = products.find((p) => p.name === "Cappuccino");
  const croissant = products.find((p) => p.name === "Croissant");

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const sales: Sale[] = [];

  if (espresso && cappuccino) {
    sales.push({
      id: createId(),
      date: today,
      items: [
        {
          productId: espresso.id,
          productName: espresso.name,
          quantity: 2,
          unitPrice: espresso.price,
          subtotal: espresso.price * 2,
        },
        {
          productId: cappuccino.id,
          productName: cappuccino.name,
          quantity: 1,
          unitPrice: cappuccino.price,
          subtotal: cappuccino.price,
        },
      ],
      paymentMethod: "tarjeta",
      total: espresso.price * 2 + cappuccino.price,
      notes: "Venta de ejemplo",
      createdAt: now,
    });
  }

  if (croissant && cappuccino) {
    sales.push({
      id: createId(),
      date: yesterday,
      items: [
        {
          productId: croissant.id,
          productName: croissant.name,
          quantity: 3,
          unitPrice: croissant.price,
          subtotal: croissant.price * 3,
        },
        {
          productId: cappuccino.id,
          productName: cappuccino.name,
          quantity: 2,
          unitPrice: cappuccino.price,
          subtotal: cappuccino.price * 2,
        },
      ],
      paymentMethod: "efectivo",
      total: croissant.price * 3 + cappuccino.price * 2,
      createdAt: now - 86400000,
    });
  }

  return { products, sales, seeded: true };
}

export function loadDatabase(): LocalDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDatabase();
      saveDatabase(seeded);
      return seeded;
    }
    return JSON.parse(raw) as LocalDatabase;
  } catch {
    const seeded = seedDatabase();
    saveDatabase(seeded);
    return seeded;
  }
}

export function saveDatabase(db: LocalDatabase): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDatabase(): LocalDatabase {
  const seeded = seedDatabase();
  saveDatabase(seeded);
  return seeded;
}

export function listProducts(db: LocalDatabase, activeOnly = false): Product[] {
  const products = [...db.products].sort((a, b) => a.name.localeCompare(b.name));
  return activeOnly ? products.filter((p) => p.active) : products;
}

export function createProduct(
  db: LocalDatabase,
  data: { name: string; category: Product["category"]; price: number },
): LocalDatabase {
  const product: Product = {
    id: createId(),
    name: data.name.trim(),
    category: data.category,
    price: data.price,
    active: true,
    createdAt: Date.now(),
  };
  const next = { ...db, products: [...db.products, product] };
  saveDatabase(next);
  return next;
}

export function updateProduct(
  db: LocalDatabase,
  productId: string,
  updates: Partial<Pick<Product, "name" | "category" | "price" | "active">>,
): LocalDatabase {
  const next = {
    ...db,
    products: db.products.map((p) =>
      p.id === productId ? { ...p, ...updates, name: updates.name?.trim() ?? p.name } : p,
    ),
  };
  saveDatabase(next);
  return next;
}

export function deactivateProduct(db: LocalDatabase, productId: string): LocalDatabase {
  return updateProduct(db, productId, { active: false });
}

export function listSalesByDateRange(
  db: LocalDatabase,
  startDate: string,
  endDate: string,
): Sale[] {
  return db.sales
    .filter((s) => s.date >= startDate && s.date <= endDate)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function createSale(
  db: LocalDatabase,
  data: {
    date: string;
    items: Array<{
      productId?: string;
      productName: string;
      quantity: number;
      unitPrice: number;
    }>;
    paymentMethod: PaymentMethod;
    notes?: string;
  },
): LocalDatabase {
  const items = data.items.map((item) => ({
    ...item,
    productName: item.productName.trim(),
    subtotal: item.quantity * item.unitPrice,
  }));
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const sale: Sale = {
    id: createId(),
    date: data.date,
    items,
    paymentMethod: data.paymentMethod,
    total,
    notes: data.notes?.trim() || undefined,
    createdAt: Date.now(),
  };
  const next = { ...db, sales: [...db.sales, sale] };
  saveDatabase(next);
  return next;
}

export function deleteSale(db: LocalDatabase, saleId: string): LocalDatabase {
  const next = { ...db, sales: db.sales.filter((s) => s.id !== saleId) };
  saveDatabase(next);
  return next;
}

export function computeSummary(
  db: LocalDatabase,
  startDate: string,
  endDate: string,
) {
  const sales = listSalesByDateRange(db, startDate, endDate);
  const byPaymentMethod: Record<PaymentMethod, number> = {
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0,
  };
  const productMap = new Map<
    string,
    { productName: string; quantity: number; revenue: number }
  >();

  let totalSales = 0;
  for (const sale of sales) {
    totalSales += sale.total;
    byPaymentMethod[sale.paymentMethod] += sale.total;
    for (const item of sale.items) {
      const existing = productMap.get(item.productName) ?? {
        productName: item.productName,
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += item.quantity;
      existing.revenue += item.subtotal;
      productMap.set(item.productName, existing);
    }
  }

  return {
    totalSales,
    transactionCount: sales.length,
    byPaymentMethod,
    topProducts: [...productMap.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10),
  };
}
