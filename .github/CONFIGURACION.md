## Configuración pendiente

Si abres este repositorio, empieza por **[CONFIGURACION.md](../CONFIGURACION.md)**.

### GitHub Pages (una vez)

- Settings → Pages → **Deploy from a branch** → `gh-pages` / `/ (root)`

### Convex (datos en la nube)

1. `npx convex login`
2. `npx convex deploy --cmd 'npm run build:pages'`
3. Secret `VITE_CONVEX_URL` en Settings → Secrets → Actions
4. Ejecutar workflow **Publish to gh-pages**
