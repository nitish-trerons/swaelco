#!/bin/sh
set -eu

DB_URL="${DATABASE_URL:-file:/app/data/dev.db}"

mkdir -p /app/public/uploads

if [ "${DB_URL#file:}" != "$DB_URL" ]; then
  DB_PATH="${DB_URL#file:}"
  mkdir -p "$(dirname "$DB_PATH")"

  if [ ! -f "$DB_PATH" ]; then
    echo "[entrypoint] initializing SQLite database at $DB_PATH"
    npm run db:bootstrap
  else
    echo "[entrypoint] using existing SQLite database at $DB_PATH"
  fi
else
  echo "[entrypoint] non-SQLite DATABASE_URL detected, skipping SQLite bootstrap"
fi

exec "$@"
