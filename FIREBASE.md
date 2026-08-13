# Firebase Hosting — ghost-contable.web.app

## Requisitos

- Cuenta Firebase con proyecto **`ghost-contable`**
- Node.js 18+

## Primera vez (en tu PC)

```bash
npm install
npx firebase login
npx firebase use ghost-contable
```

Si el proyecto no aparece, créalo en [Firebase Console](https://console.firebase.google.com/) con el ID `ghost-contable` y habilita **Hosting**.

## Despliegue automático (GitHub Actions)

El repo incluye `.github/workflows/firebase-hosting.yml`. Requiere el secreto **`FIREBASE_TOKEN`**:

```bash
npx firebase login:ci
```

Guarde el token en GitHub → Settings → Secrets → Actions → `FIREBASE_TOKEN`. Detalle en [scripts/firebase-ci-token.md](./scripts/firebase-ci-token.md).

## Desplegar la app

```bash
# (Opcional) Backend Convex en la nube al compilar:
# export VITE_CONVEX_URL=https://tu-deployment.convex.cloud

npm run deploy:firebase
```

Esto ejecuta `vite build` y sube `dist/` a Firebase Hosting.

URL esperada: **https://ghost-contable.web.app/dashboard**

## Si ves "Site Not Found"

Ese mensaje aparece cuando **nunca se ha desplegado** o el deploy falló. Después de `npm run deploy:firebase` correcto, la app debe cargar.

## Rutas de la app

| URL | Pantalla |
|-----|----------|
| `/dashboard` | Panel de ventas |
| `/registrar` | Registrar venta |
| `/historial` | Historial |
| `/productos` | Productos |
| `/informes` | Informes |
| `/cotizaciones` | Cotizaciones PDF |

Todas las rutas usan SPA: `firebase.json` redirige a `index.html`.

## Nota: Convex vs Firebase

- **Firebase Hosting** = donde se publica la web (`ghost-contable.web.app`)
- **Convex** (opcional) = base de datos en la nube (`VITE_CONVEX_URL`)
- Sin Convex, la app guarda datos en el navegador (modo local)
