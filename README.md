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

**Automatización (recomendada):** una sola vez en tu PC:

```bash
npm run setup:once
```

Ver [AUTOMATIZACION.md](./AUTOMATIZACION.md). Después, cada push a `main` despliega Convex + Pages sin más pasos.

URL: **https://ghostspecialtycoffee-lab.github.io/APP-dieguito/**

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run setup:once` | Configurar todo (Pages + Convex + secret) — **una vez** |
| `npm run setup:status` | Ver qué falta configurar |
| `npm run dev` | Desarrollo con recarga en caliente |
| `npm run build:pages` | Build con ruta `/APP-dieguito/` para GitHub Pages |
| `npm run deploy:pages` | Build + push manual a `gh-pages` |
| `npm run check:config` | Verificar entorno local |

## Licencia

MIT
