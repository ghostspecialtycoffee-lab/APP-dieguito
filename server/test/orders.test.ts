import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "../src/app.js";
import { OrderStore } from "../src/store.js";

function makeApp() {
  return createApp(new OrderStore(null));
}

describe("orders API", () => {
  it("reports health", async () => {
    const res = await request(makeApp()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("starts with an empty list", async () => {
    const res = await request(makeApp()).get("/api/orders");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("creates and then lists an order", async () => {
    const app = makeApp();
    const create = await request(app)
      .post("/api/orders")
      .send({ drink: "Flat White", size: "medium", customer: "Diego" });

    expect(create.status).toBe(201);
    expect(create.body).toMatchObject({
      drink: "Flat White",
      size: "medium",
      customer: "Diego",
    });
    expect(create.body.id).toBeTruthy();

    const list = await request(app).get("/api/orders");
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].drink).toBe("Flat White");
  });

  it("rejects invalid input", async () => {
    const app = makeApp();
    const missingFields = await request(app).post("/api/orders").send({ drink: "Latte" });
    expect(missingFields.status).toBe(400);

    const badSize = await request(app)
      .post("/api/orders")
      .send({ drink: "Latte", size: "huge", customer: "Sam" });
    expect(badSize.status).toBe(400);
  });
});
