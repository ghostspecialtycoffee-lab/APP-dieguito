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
echo "  Verificación de configuración"
echo "═══════════════════════════════════════════════════════"

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
  warn_msg "Sin .env.local — ejecuta: npx convex dev"
fi

echo ""
echo "▸ GitHub Pages"
echo "  URL: https://ghostspecialtycoffee-lab.github.io/APP-dieguito/"
if git ls-remote --heads origin gh-pages 2>/dev/null | grep -q gh-pages; then
  pass "Rama remota gh-pages existe"
else
  fail_msg "Rama gh-pages no encontrada"
fi

if npm run build:pages >/dev/null 2>&1; then
  pass "Build Pages OK"
  rm -rf dist
else
  fail_msg "Build falló"
fi

echo ""
echo "▸ Automatización CI"
warn_msg "Secret CONVEX_DEPLOY_KEY → npm run setup:status (requiere gh)"
warn_msg "Setup completo una vez → npm run setup:once"
echo "  Guía: AUTOMATIZACION.md"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Resultado: $ok OK · $warn advertencias · $fail errores"
echo "═══════════════════════════════════════════════════════"

if [ "$fail" -gt 0 ]; then
  exit 1
fi
