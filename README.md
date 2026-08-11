# Sistema de Registro de Ventas Diarias e Informes

Aplicación web para **Ghost Specialty Coffee** que permite registrar ventas diarias, consultar historial y generar informes.

## Características

- **Panel de ventas**: resumen del día, semana y mes
- **Registro de ventas**: productos, cantidades y método de pago (efectivo, tarjeta, transferencia)
- **Catálogo de productos**: bebidas, comida y otros artículos
- **Historial**: filtro por fechas y detalle de cada transacción
- **Informes**: totales, top productos, exportación CSV y JSON
- **Modo local**: funciona en el navegador sin backend (datos en `localStorage`)
- **Modo nube** (opcional): backend en tiempo real con [Convex](https://convex.dev)

## Requisitos

- Node.js 18+

## Instalación

```bash
npm install
npm run dev
```

Abra http://localhost:5173

La app incluye datos de ejemplo (productos y ventas) al primer uso en modo local.

## Backend Convex (opcional)

```bash
cp .env.example .env.local
npx convex dev
```

Copie la URL de Convex a `VITE_CONVEX_URL` en `.env.local` y reinicie `npm run dev`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo local |
| `npm run build` | Build de producción |
| `npm run build:pages` | Build para GitHub Pages |
| `npm run lint` | ESLint |

## Estructura

- `src/pages/` — Dashboard, registro, historial, productos, informes
- `src/data/` — persistencia local
- `convex/` — esquema y funciones (modo nube)

## Licencia

Uso interno — Ghost Specialty Coffee
