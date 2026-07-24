#!/usr/bin/env bash
# Build in the git checkout, publish a minimal standalone bundle, restart pm2.
# Run on the server from the repo root, e.g.:
#   cd /var/www/nip_frontend_app && bash scripts/deploy-standalone.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE="${NIP_RELEASE_DIR:-/var/www/nip_frontend_release}"
PM2_NAME="${NIP_PM2_NAME:-nip_frontend}"
PORT="${PORT:-3000}"
HOSTNAME="${HOSTNAME:-0.0.0.0}"

cd "$ROOT"

echo "==> Pull latest code"
git pull

echo "==> Install dependencies (npm ci)"
npm ci

echo "==> Production build (standalone)"
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

echo "==> Restart pm2 ($PM2_NAME on port $PORT)"
cd "$RELEASE"

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  PORT="$PORT" HOSTNAME="$HOSTNAME" pm2 restart "$PM2_NAME" --update-env
else
  PORT="$PORT" HOSTNAME="$HOSTNAME" pm2 start server.js --name "$PM2_NAME"
fi

pm2 save

echo "==> Done. Live app runs from $RELEASE (not the git checkout)."
