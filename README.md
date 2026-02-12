# SWAELCO Elevators Platform

Modern, lightweight Next.js 15 app for an elevator installer company with:

- Public marketing site (SSG)
- Authenticated customer portal
- Internal role-based operations dashboard
- Prisma + SQLite backend
- NextAuth credentials auth
- RHF + Zod forms
- Lazy-loaded 3D elevator viewer

## Stack

- Next.js (App Router, TypeScript, Server Components)
- Tailwind CSS + shadcn-style UI primitives
- Prisma + SQLite
- NextAuth
- React Hook Form + Zod
- `@react-three/fiber` + `three` (lazy-only marketing viewer)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Initialize database and seed data:

```bash
npm run db:bootstrap
```

4. Run development server:

```bash
npm run dev
```

## Docker (Easy Backend + App Run)

1. Set a real secret in `docker-compose.yml` (or override with env):

```bash
openssl rand -base64 32
```

2. Start with Docker Compose:

```bash
docker compose up --build
```

This will:
- Build the app image
- Start on `http://localhost:3000`
- Auto-bootstrap SQLite on first run
- Persist database in volume `swaelco_data`
- Persist uploads in volume `swaelco_uploads`

3. Stop:

```bash
docker compose down
```

4. Reset DB data (optional destructive):

```bash
docker compose down -v
```

## Demo Accounts

- Admin: `admin@swaelco.com` / `Admin123!`
- Project manager: `pm@swaelco.com` / `Manager123!`
- Technician: `tech@swaelco.com` / `Tech123!`
- Customer: `customer@acmetowers.com` / `Customer123!`

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - lint checks
- `npm run db:bootstrap` - create SQLite schema + seed (portable fallback)
- `npm run db:seed` - reseed demo data
- `npm run db:migrate` - Prisma migrate dev (may fail in restricted sandboxes)
- `npm run db:push` - Prisma db push

## Key Routes

Public:

- `/`
- `/services`
- `/about`
- `/contact`

Auth:

- `/login`
- `/register`

App:

- `/dashboard`
- `/projects`, `/projects/[id]`
- `/customers`, `/customers/[id]`
- `/buildings`, `/buildings/[id]`
- `/tasks`
- `/profile`

API:

- `/api/auth/**`
- `/api/projects/**`
- `/api/customers/**`
- `/api/buildings/**`
- `/api/tasks`
- `/api/documents/upload`

## Notes

- Marketing pages are static by default for low server overhead.
- 3D code is client-only and lazy-loaded with low-performance fallback mode.
- RBAC is enforced both in UI and API handlers.
- Customer records support soft-delete and optional anonymization.
