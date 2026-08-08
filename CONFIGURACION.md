# Configuración requerida

Sigue estos pasos en orden. La app ya está compilada en la rama `gh-pages`; solo falta activar Pages y (opcional) conectar Convex.

---

## Checklist rápido

| Paso | Qué hacer | Estado |
|------|-----------|--------|
| 1 | Activar GitHub Pages (rama `gh-pages`) | ⬜ Pendiente |
| 2 | Verificar que la web abre | ⬜ Pendiente |
| 3 | Login en Convex (`npx convex login`) | ⬜ Pendiente |
| 4 | Desplegar backend (`npx convex deploy`) | ⬜ Pendiente |
| 5 | Crear secret `VITE_CONVEX_URL` en GitHub | ⬜ Pendiente |
| 6 | Re-publicar (`Publish to gh-pages`) | ⬜ Pendiente |
| 7 | (Opcional) Desarrollo local con `.env.local` | ⬜ Pendiente |

---

## Paso 1 — Activar GitHub Pages

**Quién:** dueño o admin del repositorio.

1. Abre: **https://github.com/ghostspecialtycoffee-lab/APP-dieguito/settings/pages**

2. En **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`

3. Clic en **Save**.

4. Espera 1–2 minutos. La URL será:

   **https://ghostspecialtycoffee-lab.github.io/APP-dieguito/**

> La rama `gh-pages` ya existe y se actualiza automáticamente en cada push a `main`.

---

## Paso 2 — Verificar la web

Abre la URL anterior. Deberías ver:

- Sidebar verde con “Asistencias Técnicas en Café”
- Panel de inicio con el flujo del programa

Si ves pantalla en blanco o sin estilos, confirma que Pages usa la rama `gh-pages` y espera un minuto más.

**Sin Convex:** la app carga pero muestra un aviso amarillo y no guarda datos.

---

## Paso 3 — Convex (backend en la nube)

Necesitas Node.js 18+ en tu computador.

```bash
cd APP-dieguito
npm install
npx convex login
```

Sigue el navegador para autorizar Convex (cuenta gratuita).

---

## Paso 4 — Desplegar Convex a producción

```bash
npx convex deploy --cmd 'npm run build:pages'
```

Al terminar, copia la **Deployment URL** que aparece en la terminal. Ejemplo:

```
https://happy-animal-123.convex.cloud
```

Guárdala: la usarás en el Paso 5.

> También puedes verla en el dashboard de Convex → tu proyecto → Settings → Deployment URL.

---

## Paso 5 — Secret en GitHub (para que Pages use Convex)

1. Abre: **https://github.com/ghostspecialtycoffee-lab/APP-dieguito/settings/secrets/actions**

2. **New repository secret**
   - **Name:** `VITE_CONVEX_URL`
   - **Secret:** la URL del Paso 4 (solo la URL, sin espacios)

3. **Add secret**

---

## Paso 6 — Re-publicar con Convex conectado

1. Abre: **https://github.com/ghostspecialtycoffee-lab/APP-dieguito/actions/workflows/publish-gh-pages.yml**

2. Clic en **Run workflow** → branch `main` → **Run workflow**

3. Espera ~30 s. Cuando termine en verde, recarga la web.

La app debería cargar fincas de demostración (El Paraíso, La Esperanza, San José) sin aviso amarillo.

---

## Paso 7 — Desarrollo local (opcional)

```bash
cp .env.example .env.local
npx convex dev
```

`npx convex dev` escribe automáticamente `VITE_CONVEX_URL` en `.env.local`.

En otra terminal:

```bash
npm run dev
```

Abre http://localhost:5173

Para probar la misma ruta que GitHub Pages:

```bash
npm run build:pages && npm run preview
```

Abre http://localhost:5173/APP-dieguito/

---

## Verificar configuración

En tu máquina, después de los pasos anteriores:

```bash
npm run check:config
```

---

## Resumen de URLs importantes

| Recurso | URL |
|---------|-----|
| App web | https://ghostspecialtycoffee-lab.github.io/APP-dieguito/ |
| GitHub Pages settings | https://github.com/ghostspecialtycoffee-lab/APP-dieguito/settings/pages |
| GitHub Actions secrets | https://github.com/ghostspecialtycoffee-lab/APP-dieguito/settings/secrets/actions |
| Workflow publicación | https://github.com/ghostspecialtycoffee-lab/APP-dieguito/actions/workflows/publish-gh-pages.yml |
| Convex dashboard | https://dashboard.convex.dev |

---

## Problemas frecuentes

**“Configure Convex…” en la web**  
→ Falta el secret `VITE_CONVEX_URL` o no volviste a ejecutar **Publish to gh-pages**.

**404 en GitHub Pages**  
→ Pages no está activado o la rama no es `gh-pages`.

**Rutas internas no cargan (solo Inicio)**  
→ El build debe usar `npm run build:pages` (ya lo hace el workflow automático).

**`npx convex deploy` pide login**  
→ Ejecuta `npx convex login` primero.

---

## Soporte

Documentación técnica adicional: [DEPLOY.md](./DEPLOY.md)
