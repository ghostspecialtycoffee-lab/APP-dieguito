#!/usr/bin/env bash
# Después de npx convex login — crea deploy key, guarda secret y publica.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${GITHUB_REPOSITORY:-ghostspecialtycoffee-lab/APP-dieguito}"

command -v gh >/dev/null || { echo "Instala gh: https://cli.github.com"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Ejecuta: gh auth login"; exit 1; }

echo "▸ Creando deploy key de Convex (prod)…"
ENV_TMP="$(mktemp)"
if ! npx convex deployment token create github-actions --deployment prod --save-env "$ENV_TMP"; then
  echo "✗ Falló. ¿Ya hiciste npx convex login?"
  rm -f "$ENV_TMP"
  exit 1
fi
# shellcheck source=/dev/null
source "$ENV_TMP"
rm -f "$ENV_TMP"

echo "▸ Guardando CONVEX_DEPLOY_KEY en GitHub…"
gh secret set CONVEX_DEPLOY_KEY --body "$CONVEX_DEPLOY_KEY" -R "$REPO"

echo "▸ Desplegando (workflow Publish to gh-pages)…"
gh workflow run publish-gh-pages.yml -R "$REPO" --ref main

echo ""
echo "✓ Listo. En ~1 minuto recarga:"
echo "  https://ghostspecialtycoffee-lab.github.io/APP-dieguito/"
echo ""
echo "Ver progreso: gh run list -R $REPO --workflow publish-gh-pages.yml"
