#!/usr/bin/env bash
# Production deploy — run from the server app root (e.g. /var/www/nip_frontend_app).
# Ensures new npm dependencies (e.g. react-markdown) are installed before build.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Pull latest code"
git pull

echo "==> Install dependencies (npm ci)"
npm ci

echo "==> Production build"
rm -f "$ROOT/public/favicon.ico"
npm run build

echo "==> Done. Build complete in $ROOT"
echo "    Restart your app process separately if your host does not do it automatically."
