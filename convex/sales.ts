import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const paymentMethodValidator = v.union(
  v.literal("efectivo"),
  v.literal("tarjeta"),
  v.literal("transferencia"),
);

const saleItemValidator = v.object({
  productId: v.optional(v.id("products")),
  productName: v.string(),
  quantity: v.number(),
  unitPrice: v.number(),
  subtotal: v.number(),
});

const saleDocValidator = v.object({
  _id: v.id("sales"),
  _creationTime: v.number(),
  date: v.string(),
  items: v.array(saleItemValidator),
  paymentMethod: paymentMethodValidator,
  total: v.number(),
  notes: v.optional(v.string()),
  createdAt: v.number(),
});

export const listByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  returns: v.array(saleDocValidator),
  handler: async (ctx, args) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_date", (q) => q.gte("date", args.startDate))
      .collect();
    return sales.filter((sale) => sale.date <= args.endDate);
  },
});

export const listByDate = query({
  args: { date: v.string() },
  returns: v.array(saleDocValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sales")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

export const create = mutation({
  args: {
    date: v.string(),
    items: v.array(
      v.object({
        productId: v.optional(v.id("products")),
        productName: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      }),
    ),
    paymentMethod: paymentMethodValidator,
    notes: v.optional(v.string()),
  },
  returns: v.id("sales"),
  handler: async (ctx, args) => {
    if (args.items.length === 0) {
      throw new Error("Agregue al menos un producto a la venta");
    }
    const items = args.items.map((item) => {
      if (item.quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a cero");
      }
      if (item.unitPrice < 0) {
        throw new Error("El precio unitario no puede ser negativo");
      }
      return {
        ...item,
        productName: item.productName.trim(),
        subtotal: item.quantity * item.unitPrice,
      };
    });
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    return await ctx.db.insert("sales", {
      date: args.date,
      items,
      paymentMethod: args.paymentMethod,
      total,
      notes: args.notes?.trim() || undefined,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { saleId: v.id("sales") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const sale = await ctx.db.get("sales", args.saleId);
    if (!sale) {
      throw new Error("Venta no encontrada");
    }
    await ctx.db.delete(args.saleId);
    return null;
  },
});

export const summary = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  returns: v.object({
    totalSales: v.number(),
    transactionCount: v.number(),
    byPaymentMethod: v.object({
      efectivo: v.number(),
      tarjeta: v.number(),
      transferencia: v.number(),
    }),
    topProducts: v.array(
      v.object({
        productName: v.string(),
        quantity: v.number(),
        revenue: v.number(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_date", (q) => q.gte("date", args.startDate))
      .collect();
    const filtered = sales.filter((sale) => sale.date <= args.endDate);

    const byPaymentMethod = {
      efectivo: 0,
      tarjeta: 0,
      transferencia: 0,
    };
    const productMap = new Map<
      string,
      { productName: string; quantity: number; revenue: number }
    >();

    let totalSales = 0;
    for (const sale of filtered) {
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

    const topProducts = [...productMap.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalSales,
      transactionCount: filtered.length,
      byPaymentMethod,
      topProducts,
    };
  },
});
