#!/usr/bin/env bash
# Build in the git checkout and publish a minimal standalone bundle.
# Run on the server from the repo root, e.g.:
#   cd /var/www/nip_frontend_app && bash scripts/deploy-standalone.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE="${NIP_RELEASE_DIR:-/var/www/nip_frontend_release}"

cd "$ROOT"

echo "==> Pull latest code"
git pull

echo "==> Install dependencies (npm ci)"
npm ci

echo "==> Production build (standalone)"
# Drop legacy broken favicon.ico if it exists on the server (PNG mislabeled as .ico).
rm -f "$ROOT/public/favicon.ico"
npm run build

if [[ ! -d "$ROOT/.next/standalone" ]]; then
  echo "ERROR: .next/standalone not found. Is output: \"standalone\" set in next.config.ts?"
  exit 1
fi

echo "==> Publish standalone bundle to $RELEASE"
rm -rf "$RELEASE"
mkdir -p "$RELEASE/.next"

cp -a "$ROOT/.next/standalone/." "$RELEASE/"
cp -a "$ROOT/.next/static" "$RELEASE/.next/static"
cp -a "$ROOT/public" "$RELEASE/public"

if [[ -f "$ROOT/.env.production" ]]; then
  cp "$ROOT/.env.production" "$RELEASE/.env.production"
fi

echo "==> Done. Standalone bundle published to $RELEASE"
echo "    Restart your app process separately if your host does not do it automatically."
