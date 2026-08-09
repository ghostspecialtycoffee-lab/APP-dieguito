#!/usr/bin/env python3
"""
Automatiza la configuración de GitHub Pages + Convex + despliegue.

Uso:
  python3 scripts/automate_setup.py          # ver estado
  python3 scripts/automate_setup.py --full   # configurar todo (requiere gh + convex login)

Requisitos: Node 18+, gh CLI autenticado, npx convex login (una vez).
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

REPO = os.environ.get("GITHUB_REPOSITORY", "ghostspecialtycoffee-lab/APP-dieguito")
OWNER, NAME = REPO.split("/", 1)
PAGES_URL = "https://ghostspecialtycoffee-lab.github.io/APP-dieguito/"
WORKFLOW = "publish-gh-pages.yml"


def run(cmd: list[str], **kwargs) -> subprocess.CompletedProcess:
    print(f"  → {' '.join(cmd)}")
    return subprocess.run(cmd, check=False, **kwargs)


def require(cmd: str) -> None:
    if not shutil.which(cmd):
        sys.exit(f"Falta '{cmd}' en PATH.")


def gh_api(path: str, method: str = "GET", data: dict | None = None) -> dict | None:
    cmd = ["gh", "api", path, "-X", method]
    if data:
        for key, value in data.items():
            cmd.extend(["-f", f"{key}={value}"])
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        return None
    if not result.stdout.strip():
        return {}
    return json.loads(result.stdout)


def check_pages() -> str:
    info = gh_api(f"repos/{REPO}/pages")
    if not info:
        return "no_configurado"
    status = info.get("status", "unknown")
    source = info.get("source", {})
    branch = source.get("branch", "?")
    print(f"  GitHub Pages: {status} (rama {branch}) → {info.get('html_url', PAGES_URL)}")
    return status


def configure_pages() -> bool:
    print("\n▸ Configurando GitHub Pages…")
    info = gh_api(f"repos/{REPO}/pages")
    payload = {
        "build_type": "legacy",
        "source[branch]": "gh-pages",
        "source[path]": "/",
    }
    if info:
        ok = gh_api(f"repos/{REPO}/pages", "PUT", payload) is not None
    else:
        ok = gh_api(f"repos/{REPO}/pages", "POST", payload) is not None
    if ok:
        print("  ✓ Pages configurado (gh-pages / root)")
    else:
        print("  ⚠ No se pudo configurar Pages vía API (¿permisos admin?).")
        print(f"    Manual: https://github.com/{REPO}/settings/pages")
    return ok


def secret_exists(name: str) -> bool:
    result = subprocess.run(
        ["gh", "secret", "list", "-R", REPO],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return False
    return any(line.startswith(name) for line in result.stdout.splitlines())


def set_convex_deploy_key(key: str) -> bool:
    result = run(
        ["gh", "secret", "set", "CONVEX_DEPLOY_KEY", "--body", key, "-R", REPO],
        capture_output=True,
        text=True,
    )
    if result.returncode == 0:
        print("  ✓ Secret CONVEX_DEPLOY_KEY guardado en GitHub")
        return True
    print(f"  ✗ No se pudo guardar el secret: {result.stderr.strip()}")
    return False


def create_convex_deploy_key() -> str | None:
    print("\n▸ Creando deploy key de Convex…")
    login = run(["npx", "convex", "login"], capture_output=True, text=True)
    if login.returncode != 0:
        print("  ✗ convex login falló. Abre el enlace en el navegador y autoriza.")
        return None

    with tempfile.NamedTemporaryFile(mode="w", suffix=".env", delete=False) as tmp:
        env_path = tmp.name

    token = run(
        [
            "npx",
            "convex",
            "deployment",
            "token",
            "create",
            "github-actions",
            "--deployment",
            "prod",
            "--save-env",
            env_path,
        ],
        capture_output=True,
        text=True,
    )
    if token.returncode != 0:
        print(f"  ✗ {token.stderr.strip()}")
        os.unlink(env_path)
        return None

    key = None
    with open(env_path) as f:
        for line in f:
            if line.startswith("CONVEX_DEPLOY_KEY="):
                key = line.split("=", 1)[1].strip().strip('"').strip("'")
    os.unlink(env_path)

    if not key:
        print("  ✗ No se obtuvo CONVEX_DEPLOY_KEY")
        return None
    print("  ✓ Deploy key creada")
    return key


def trigger_workflow() -> bool:
    print("\n▸ Ejecutando workflow de publicación…")
    result = run(
        ["gh", "workflow", "run", WORKFLOW, "-R", REPO, "--ref", "main"],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"  ✗ {result.stderr.strip()}")
        return False
    print("  ✓ Workflow iniciado — espera ~1 minuto")
    return True


def wait_for_pages(timeout: int = 120) -> bool:
    print("\n▸ Verificando URL pública…")
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(PAGES_URL, timeout=10) as resp:
                if resp.status == 200:
                    print(f"  ✓ {PAGES_URL} responde OK")
                    return True
        except (urllib.error.URLError, TimeoutError):
            pass
        time.sleep(10)
    print(f"  ⚠ {PAGES_URL} aún no responde (puede tardar unos minutos)")
    return False


def status_report() -> None:
    print("═══════════════════════════════════════════════════════")
    print("  Estado de automatización — Asistencias Técnicas Café")
    print("═══════════════════════════════════════════════════════")
    require("gh")
    require("node")

    pages = check_pages()
    has_key = secret_exists("CONVEX_DEPLOY_KEY")
    has_legacy = secret_exists("VITE_CONVEX_URL")
    print(f"  Secret CONVEX_DEPLOY_KEY: {'✓' if has_key else '✗ pendiente'}")
    print(f"  Secret VITE_CONVEX_URL (legacy): {'✓' if has_legacy else '—'}")

    if pages in ("built", "building"):
        print(f"  Web pública: {PAGES_URL}")
    else:
        print("  Web pública: pendiente activar Pages")

    if has_key:
        print("\n  Todo listo en CI. Cada push a main despliega Convex + Pages.")
    else:
        print("\n  Falta una sola vez: npm run setup:once")
    print("═══════════════════════════════════════════════════════")


def full_setup(skip_workflow: bool = False) -> int:
    require("gh")
    require("node")
    require("npm")

    auth = subprocess.run(["gh", "auth", "status"], capture_output=True)
    if auth.returncode != 0:
        sys.exit("Ejecuta: gh auth login")

    configure_pages()

    key = os.environ.get("CONVEX_DEPLOY_KEY")
    if not key and not secret_exists("CONVEX_DEPLOY_KEY"):
        key = create_convex_deploy_key()
        if key:
            set_convex_deploy_key(key)
    elif secret_exists("CONVEX_DEPLOY_KEY"):
        print("\n▸ CONVEX_DEPLOY_KEY ya existe en GitHub — omitiendo creación")
    elif key:
        set_convex_deploy_key(key)

    if not skip_workflow:
        trigger_workflow()
        wait_for_pages()

    status_report()
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Automatizar setup GitHub + Convex")
    parser.add_argument(
        "--full",
        action="store_true",
        help="Configurar Pages, Convex deploy key y ejecutar workflow",
    )
    parser.add_argument(
        "--skip-workflow",
        action="store_true",
        help="No ejecutar el workflow (solo secrets y Pages)",
    )
    args = parser.parse_args()

    if args.full:
        return full_setup(skip_workflow=args.skip_workflow)
    status_report()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
