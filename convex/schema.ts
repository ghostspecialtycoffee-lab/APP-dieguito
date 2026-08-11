import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const categoryValidator = v.union(
  v.literal("bebida"),
  v.literal("comida"),
  v.literal("otro"),
);

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

export default defineSchema({
  products: defineTable({
    name: v.string(),
    category: categoryValidator,
    price: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
  }).index("by_active", ["active"]),

  sales: defineTable({
    date: v.string(),
    items: v.array(saleItemValidator),
    paymentMethod: paymentMethodValidator,
    total: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_created", ["createdAt"]),
});
