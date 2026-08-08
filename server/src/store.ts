import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface Order {
  id: string;
  drink: string;
  size: "small" | "medium" | "large";
  customer: string;
  createdAt: string;
}

export type NewOrder = Pick<Order, "drink" | "size" | "customer">;

export const SIZES: Order["size"][] = ["small", "medium", "large"];

/**
 * A tiny order store. When `filePath` is provided it persists to a JSON file so
 * orders survive restarts; otherwise it keeps orders in memory (used by tests).
 */
export class OrderStore {
  private orders: Order[] = [];

  constructor(private readonly filePath: string | null = null) {
    if (this.filePath && existsSync(this.filePath)) {
      try {
        this.orders = JSON.parse(readFileSync(this.filePath, "utf8")) as Order[];
      } catch {
        this.orders = [];
      }
    }
  }

  list(): Order[] {
    return [...this.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  create(input: NewOrder): Order {
    const order: Order = {
      id: randomUUID(),
      drink: input.drink,
      size: input.size,
      customer: input.customer,
      createdAt: new Date().toISOString(),
    };
    this.orders.push(order);
    this.persist();
    return order;
  }

  private persist(): void {
    if (!this.filePath) return;
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(this.orders, null, 2));
  }
}
