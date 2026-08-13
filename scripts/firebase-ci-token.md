# Token CI para Firebase Hosting (ghost-contable)

El workflow `Deploy Firebase Hosting` necesita el secreto `FIREBASE_TOKEN` en GitHub.

## 1. Generar token (una sola vez, en tu PC)

```bash
npm install
npx firebase login
npx firebase login:ci
```

Copia el token que imprime el comando (no lo compartas en chats públicos).

## 2. Guardar en GitHub

1. Abre https://github.com/ghostspecialtycoffee-lab/APP-dieguito/settings/secrets/actions
2. **New repository secret**
3. Name: `FIREBASE_TOKEN`
4. Value: el token de `firebase login:ci`

## 3. Desplegar

- Automático: cada push a `main` ejecuta el workflow.
- Manual: Actions → **Deploy Firebase Hosting** → **Run workflow**.

## 4. Verificar

https://ghost-contable.web.app/dashboard

Si sigue "Site Not Found", el deploy no llegó a Firebase (revisa el log del workflow).

## Alternativa sin GitHub Actions

```bash
npm run deploy:firebase
```
