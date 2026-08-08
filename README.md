# Programa de Asistencias Técnicas en Café

Aplicación web para gestionar asistencia técnica en fincas cafeteras: registro de fincas, diagnósticos, planes de trabajo, visitas técnicas, bitácora, informes y alertas.

## Características

- **Fincas**: registro con ubicación, altitud, área y datos del productor
- **Diagnóstico inicial**: cultivo, fertilización, análisis de suelos (pH, MO, P, K, Ca, Mg, Al)
- **Plan de trabajo**: objetivos, actividades con insumos y fechas
- **Visitas técnicas**: registro de campo con actividades, recomendaciones y evidencias
- **Bitácora**: historial searchable de todas las actividades
- **Informes**: exportación de datos (JSON; PDF en versión futura)
- **Calendario y alertas**: visitas programadas y notificaciones
- **Backend en tiempo real** con [Convex](https://convex.dev)

## Requisitos

- Node.js 18+
- Cuenta Convex (gratuita) o modo agente anónimo para desarrollo

## Instalación local

```bash
npm install
npx convex dev
npm run dev
```

Abra http://localhost:5173

## App web en GitHub Pages

Despliegue **solo con GitHub Pages** (sin Vercel).

1. **Settings → Pages** → Source: **Deploy from a branch** → `gh-pages` / `/ (root)`
2. URL: **https://ghostspecialtycoffee-lab.github.io/APP-dieguito/**
3. Cada push a `main` actualiza `gh-pages` (workflow **Publish to gh-pages**)

Para datos en la nube, configure Convex y el secret `VITE_CONVEX_URL`. Ver [DEPLOY.md](./DEPLOY.md).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo con recarga en caliente |
| `npm run build` | Compilar para producción (ruta `/`) |
| `npm run build:pages` | Build con ruta `/APP-dieguito/` para GitHub Pages |
| `npm run preview` | Servir `dist` en http://localhost:5173 |
| `npm run start:web` | Build + servir producción |
| `npm run deploy:pages` | Build + push a rama `gh-pages` |
| `npx convex dev` | Backend Convex (desarrollo) |

## Licencia

MIT
