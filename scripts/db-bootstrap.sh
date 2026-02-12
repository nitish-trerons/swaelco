#!/bin/sh
set -eu

DB_URL="${DATABASE_URL:-file:./prisma/dev.db}"

case "$DB_URL" in
  file:*)
    DB_PATH_RAW="${DB_URL#file:}"
    ;;
  *)
    echo "DATABASE_URL must be a SQLite file URL (file:...) for db-bootstrap. Got: $DB_URL" >&2
    exit 1
    ;;
esac

case "$DB_PATH_RAW" in
  /*)
    DB_PATH="$DB_PATH_RAW"
    ;;
  *)
    # Prisma resolves relative sqlite paths from prisma/schema.prisma directory
    DB_PATH="prisma/$DB_PATH_RAW"
    ;;
esac

mkdir -p "$(dirname "$DB_PATH")"

EXISTING_USER_TABLE="$(sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table' AND name='User';" || true)"

if [ "$EXISTING_USER_TABLE" != "User" ]; then
  SQL_FILE="$(mktemp)"
  trap 'rm -f "$SQL_FILE"' EXIT

  npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > "$SQL_FILE"
  sqlite3 "$DB_PATH" < "$SQL_FILE"
else
  echo "SQLite schema already exists at $DB_PATH; skipping schema creation"
fi

node prisma/seed.mjs
