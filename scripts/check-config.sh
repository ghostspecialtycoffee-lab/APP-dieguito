#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ok=0
warn=0
fail=0

pass() { echo "  ✓ $1"; ok=$((ok + 1)); }
warn_msg() { echo "  ⚠ $1"; warn=$((warn + 1)); }
fail_msg() { echo "  ✗ $1"; fail=$((fail + 1)); }

echo "═══════════════════════════════════════════════════════"
echo "  Programa de Asistencias Técnicas en Café"
echo "  Verificación de configuración"
echo "═══════════════════════════════════════════════════════"
echo ""

echo "▸ Entorno local"
if command -v node >/dev/null 2>&1; then
  pass "Node.js $(node -v)"
else
  fail_msg "Node.js no instalado (requiere v18+)"
fi

if [ -d "node_modules" ]; then
  pass "Dependencias npm instaladas"
else
  warn_msg "Ejecuta: npm install"
fi

echo ""
echo "▸ Convex (desarrollo local)"
if [ -f ".env.local" ] && grep -q 'VITE_CONVEX_URL=http' .env.local 2>/dev/null; then
  url=$(grep VITE_CONVEX_URL .env.local | cut -d= -f2- | tr -d '"' | tr -d "'")
  pass "VITE_CONVEX_URL en .env.local → $url"
else
  warn_msg "Sin .env.local con Convex. Ejecuta: npx convex dev"
fi

echo ""
echo "▸ GitHub Pages (producción)"
echo "  URL esperada: https://ghostspecialtycoffee-lab.github.io/APP-dieguito/"
if git ls-remote --heads origin gh-pages 2>/dev/null | grep -q gh-pages; then
  pass "Rama remota gh-pages existe"
else
  fail_msg "Rama gh-pages no encontrada en origin"
fi

if npm run build:pages >/dev/null 2>&1; then
  pass "Build para Pages (npm run build:pages) OK"
  rm -rf dist
else
  fail_msg "Build falló — revisa npm install y errores de TypeScript"
fi

echo ""
echo "▸ Pendiente en GitHub (manual)"
warn_msg "Activar Pages: Settings → Pages → branch gh-pages / (root)"
warn_msg "Secret Actions: VITE_CONVEX_URL = URL de npx convex deploy"
warn_msg "Re-publicar: Actions → Publish to gh-pages → Run workflow"
echo ""
echo "  Guía completa: CONFIGURACION.md"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  Resultado: $ok OK · $warn advertencias · $fail errores"
echo "═══════════════════════════════════════════════════════"

if [ "$fail" -gt 0 ]; then
  exit 1
fi
