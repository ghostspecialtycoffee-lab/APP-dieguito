import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { createApp } from "./app.js";
import { OrderStore } from "./store.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT ?? 8787);
const DATA_FILE = process.env.DATA_FILE ?? resolve(__dirname, "../data/orders.json");

const store = new OrderStore(DATA_FILE);
const app = createApp(store);

app.listen(PORT, () => {
  console.log(`[dieguito] API listening on http://localhost:${PORT}`);
  console.log(`[dieguito] persisting orders to ${DATA_FILE}`);
});
