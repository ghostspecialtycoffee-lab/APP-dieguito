# APP-dieguito — Dieguito Coffee ☕

A small full-stack demo app: place a coffee order and watch the live order queue update.

- **client/** — Vite + React + TypeScript single-page app.
- **server/** — Express + TypeScript JSON API that stores orders (persisted to a local JSON file).

## Requirements

- Node.js >= 20 (developed on Node 22)
- npm 10+

## Getting started

```bash
npm install        # install all workspaces
npm run dev        # start the API (:8787) and the web app (:5173) together
```

Then open http://localhost:5173. The Vite dev server proxies `/api/*` to the
API server, so no CORS or extra config is needed for local development.

## Common commands

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Run API + client together (hot reload)              |
| `npm run dev:server`| Run only the API on `:8787`                         |
| `npm run dev:client`| Run only the web app on `:5173`                     |
| `npm run build`     | Type-check the server and build the client bundle   |
| `npm run typecheck` | Type-check every workspace                          |
| `npm run lint`      | Lint the codebase with ESLint                       |
| `npm test`          | Run the server API tests (Vitest + Supertest)       |

## API

| Method | Path           | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | `/api/health`  | Health check                    |
| GET    | `/api/orders`  | List orders (newest first)      |
| POST   | `/api/orders`  | Create an order                 |

Create payload:

```json
{ "drink": "Flat White", "size": "medium", "customer": "Diego" }
```

`size` must be one of `small`, `medium`, `large`.

## Configuration

- `PORT` — API port (default `8787`).
- `DATA_FILE` — where orders are persisted (default `server/data/orders.json`).
- `VITE_API_TARGET` — API target for the Vite dev proxy (default `http://localhost:8787`).
