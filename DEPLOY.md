# Publicar en GitHub Pages

La app se despliega **solo con GitHub Pages** (sin Vercel ni Netlify).

## Activar (una vez)

1. Abre **Settings → Pages**:  
   https://github.com/ghostspecialtycoffee-lab/APP-dieguito/settings/pages

2. **Build and deployment → Source:** **Deploy from a branch**

3. Branch: **`gh-pages`**, folder: **`/ (root)`** → **Save**

4. URL de la app:  
   **https://ghostspecialtycoffee-lab.github.io/APP-dieguito/**

## Actualización automática

Cada push a `main` ejecuta el workflow **Publish to gh-pages**, que compila y actualiza la rama `gh-pages`.

## Backend Convex (automático)

Ejecuta **una vez**:

```bash
npm run setup:once
```

El workflow usa `CONVEX_DEPLOY_KEY` y despliega Convex + build en un solo paso. Ver [AUTOMATIZACION.md](./AUTOMATIZACION.md).

## Publicar manualmente desde tu máquina

```bash
npm install
npm run deploy:pages
```

Requiere `npx gh-pages` (se instala al ejecutar el script).

## Desarrollo local

```bash
npm install
npx convex dev
npm run dev
```

http://localhost:5173

Para probar con la misma ruta que GitHub Pages:

```bash
npm run build:pages && npm run preview
```

http://localhost:5173/APP-dieguito/
