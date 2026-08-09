#!/usr/bin/env bash
# Configuración en un solo comando (interacción mínima: login Convex en el navegador).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${GITHUB_REPOSITORY:-ghostspecialtycoffee-lab/APP-dieguito}"
PAGES_URL="https://ghostspecialtycoffee-lab.github.io/APP-dieguito/"

echo "═══════════════════════════════════════════════════════"
echo "  Setup automático — Asistencias Técnicas en Café"
echo "═══════════════════════════════════════════════════════"
echo ""

command -v node >/dev/null || { echo "Instala Node.js 18+"; exit 1; }
command -v gh >/dev/null || { echo "Instala GitHub CLI: https://cli.github.com"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Ejecuta: gh auth login"; exit 1; }

npm install --silent

echo "▸ 1/4 — GitHub Pages (rama gh-pages)"
gh api "repos/${REPO}/pages" --jq .status 2>/dev/null || \
  gh api -X POST "repos/${REPO}/pages" \
    -f build_type=legacy \
    -f 'source[branch]=gh-pages' \
    -f 'source[path]=/' 2>/dev/null || \
  gh api -X PUT "repos/${REPO}/pages" \
    -f build_type=legacy \
    -f 'source[branch]=gh-pages' \
    -f 'source[path]=/' 2>/dev/null || \
  echo "  ⚠ Configura Pages manualmente si falla: Settings → Pages → gh-pages"
echo "  URL: ${PAGES_URL}"

if gh secret list -R "$REPO" 2>/dev/null | grep -q '^CONVEX_DEPLOY_KEY'; then
  echo "▸ 2/4 — Convex: secret ya existe, omitiendo"
else
  echo "▸ 2/4 — Convex (abre el navegador si pide login)"
  npx convex login
  ENV_TMP="$(mktemp)"
  npx convex deployment token create github-actions --deployment prod --save-env "$ENV_TMP"
  # shellcheck source=/dev/null
  source "$ENV_TMP"
  rm -f "$ENV_TMP"
  gh secret set CONVEX_DEPLOY_KEY --body "$CONVEX_DEPLOY_KEY" -R "$REPO"
  echo "  ✓ CONVEX_DEPLOY_KEY guardado en GitHub"
fi

echo "▸ 3/4 — Publicar en gh-pages"
gh workflow run publish-gh-pages.yml -R "$REPO" --ref main
echo "  ✓ Workflow iniciado (Actions → Publish to gh-pages)"

echo "▸ 4/4 — Esperando sitio…"
for _ in 1 2 3 4 5 6 7 8; do
  if curl -sf -o /dev/null "$PAGES_URL"; then
    echo "  ✓ ${PAGES_URL}"
    break
  fi
  sleep 15
done

echo ""
echo "Listo. Cada push a main despliega Convex + Pages automáticamente."
echo "Ver estado: npm run setup:status"
