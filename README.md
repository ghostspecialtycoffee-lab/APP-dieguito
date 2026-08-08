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

## Instalación

```bash
npm install
```

### Backend (Convex)

```bash
# Desarrollo local con Convex
npx convex dev
```

Copie la URL de despliegue en `.env.local`:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_AGENT_MODE=anonymous
```

### Frontend

```bash
npm run dev
```

Abra http://localhost:5173

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Compilar para producción |
| `npm run preview` | Vista previa del build |
| `npx convex dev` | Backend Convex en desarrollo |

## Estructura

```
src/
  components/   # Layout, UI compartidos
  pages/        # Pantallas por módulo
convex/
  schema.ts     # Tablas: farms, diagnostics, workPlans, visits, alerts
  farms.ts      # CRUD fincas
  ...
```

## Flujo del programa

1. Registro de finca
2. Diagnóstico inicial
3. Plan de trabajo
4. Visitas técnicas y bitácora
5. Informes y exportación

## Licencia

MIT
