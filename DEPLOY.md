# Publicar la app web

## Opción A — GitHub Pages (recomendada)

### Si usas la rama `gh-pages` (ya publicada)

1. Abre **Settings → Pages**:  
   https://github.com/ghostspecialtycoffee-lab/APP-dieguito/settings/pages

2. **Build and deployment → Source**: elige **Deploy from a branch**

3. Branch: **`gh-pages`**, folder: **`/ (root)`**, Save.

4. En 1–2 minutos la app estará en:  
   **https://ghostspecialtycoffee-lab.github.io/APP-dieguito/**

### Si usas GitHub Actions

1. En la misma página, Source: **GitHub Actions**
2. Agrega secret `VITE_CONVEX_URL` (ver abajo)
3. Ejecuta workflow **Deploy Web App** en Actions

---

## Backend Convex (datos en la nube)

Sin esto la interfaz carga pero no guarda datos.

```bash
npx convex login
npx convex deploy --cmd 'npm run build'
```

Copia la URL (`https://….convex.cloud`) y:

- **GitHub Actions:** Settings → Secrets → `VITE_CONVEX_URL`
- **Vercel / Netlify:** variable de entorno `VITE_CONVEX_URL`

---

## Opción B — Vercel

1. https://vercel.com/new → importar este repo
2. Variable: `VITE_CONVEX_URL`
3. Deploy (usa `vercel.json` incluido)

## Opción C — Netlify

Importar repo; `netlify.toml` ya configurado. Agregar `VITE_CONVEX_URL`.

---

## Local

```bash
npm install
npx convex dev
npm run start:web
```

http://localhost:5173
