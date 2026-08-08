import cors from "cors";
import express, { type Express } from "express";

import { OrderStore, SIZES, type NewOrder } from "./store.js";

export function createApp(store: OrderStore): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/orders", (_req, res) => {
    res.json(store.list());
  });

  app.post("/api/orders", (req, res) => {
    const body = req.body as Partial<NewOrder>;
    const drink = typeof body.drink === "string" ? body.drink.trim() : "";
    const customer = typeof body.customer === "string" ? body.customer.trim() : "";
    const size = body.size;

    if (!drink || !customer) {
      res.status(400).json({ error: "drink and customer are required" });
      return;
    }
    if (!size || !SIZES.includes(size)) {
      res.status(400).json({ error: `size must be one of: ${SIZES.join(", ")}` });
      return;
    }

    const order = store.create({ drink, customer, size });
    res.status(201).json(order);
  });

  return app;
}
