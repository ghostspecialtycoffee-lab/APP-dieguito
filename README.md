# Programa de Asistencias Técnicas en Café

Aplicación web para gestionar asistencia técnica en fincas cafeteras.

## Empezar (configuración)

**→ Lee [CONFIGURACION.md](./CONFIGURACION.md)** — checklist paso a paso para:

1. Activar GitHub Pages  
2. Conectar Convex (datos en la nube)  
3. Desarrollo local  

URL de la app (tras activar Pages):

**https://ghostspecialtycoffee-lab.github.io/APP-dieguito/**

## Desarrollo rápido

```bash
npm install
npx convex dev    # crea .env.local
npm run dev       # http://localhost:5173
```

Verificar setup: `npm run check:config`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo local |
| `npm run build:pages` | Build para GitHub Pages |
| `npm run deploy:pages` | Push manual a rama `gh-pages` |
| `npm run check:config` | Verificar qué falta configurar |

## Documentación

- [CONFIGURACION.md](./CONFIGURACION.md) — pasos manuales (Pages + Convex)
- [DEPLOY.md](./DEPLOY.md) — detalles técnicos de despliegue

## Licencia

MIT
