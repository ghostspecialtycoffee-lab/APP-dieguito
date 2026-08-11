import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) {
      return null;
    }

    const products = [
      { name: "Espresso", category: "bebida" as const, price: 3500 },
      { name: "Cappuccino", category: "bebida" as const, price: 5500 },
      { name: "Latte", category: "bebida" as const, price: 6000 },
      { name: "Americano", category: "bebida" as const, price: 4500 },
      { name: "Cold Brew", category: "bebida" as const, price: 6500 },
      { name: "Croissant", category: "comida" as const, price: 4000 },
      { name: "Brownie", category: "comida" as const, price: 4500 },
      { name: "Bolsa 250g", category: "otro" as const, price: 28000 },
    ];

    const now = Date.now();
    for (const product of products) {
      await ctx.db.insert("products", {
        ...product,
        active: true,
        createdAt: now,
      });
    }

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const allProducts = await ctx.db.query("products").collect();
    const espresso = allProducts.find((p) => p.name === "Espresso");
    const cappuccino = allProducts.find((p) => p.name === "Cappuccino");
    const croissant = allProducts.find((p) => p.name === "Croissant");

    if (espresso && cappuccino) {
      await ctx.db.insert("sales", {
        date: today,
        items: [
          {
            productId: espresso._id,
            productName: espresso.name,
            quantity: 2,
            unitPrice: espresso.price,
            subtotal: espresso.price * 2,
          },
          {
            productId: cappuccino._id,
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
      await ctx.db.insert("sales", {
        date: yesterday,
        items: [
          {
            productId: croissant._id,
            productName: croissant.name,
            quantity: 3,
            unitPrice: croissant.price,
            subtotal: croissant.price * 3,
          },
          {
            productId: cappuccino._id,
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

    return null;
  },
});
