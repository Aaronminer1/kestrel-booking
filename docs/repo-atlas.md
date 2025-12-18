# Repo Atlas (to be built by the agent)

This file must be maintained as the system grows.

## Directory-to-domain map

- `.github/workflows/`
  - CI workflows
- `docs/`
  - Stakeholder and engineering specs
- `docs/flows/`
  - Flow maps for critical paths
- `prisma/`
  - Prisma schema and migrations (SQLite)
- `scripts/`
  - Local tooling scripts (test runner)
- `src/`
  - Runtime application code (Fastify server, routes)
- `test/`
  - Vitest tests (Fastify `inject()` integration tests)

Root configs:
- `package.json`: scripts + dependencies
- `tsconfig.json`: build config
- `tsconfig.typecheck.json`: typecheck config (includes tests/config)
- `eslint.config.js`: lint config
- `vitest.config.ts`: test runner config
- `.env.example`: documented local env vars
- `.gitignore`: ignores `.env`, `dev.db`, `test.db`, `dist/`, `node_modules/`

## Component map

- **HTTP API (Fastify)**
  - `buildApp()` constructs the Fastify instance and registers routes.
- **Persistence (Prisma + SQLite)**
  - Prisma schema is the source of truth for the DB model.
  - Migrations are committed under `prisma/migrations/`.
- **Tooling**
  - TypeScript build and typecheck
  - ESLint linting
  - Vitest testing
  - GitHub Actions CI

## Entry points

- Runtime:
  - `src/server.ts` (process entrypoint; reads `PORT`, binds `127.0.0.1`)
- App composition:
  - `src/app.ts` (`buildApp()` creates Fastify instance and registers routes)

## Data map

- Prisma schema:
  - `prisma/schema.prisma`
- SQLite database:
  - local dev default file: `./dev.db` (from `DATABASE_URL`)
- Entities:
  - `Service`:
    - `id` (autoincrement)
    - `name`
    - `durationMinutes`
    - `priceCents`
    - `createdAt`, `updatedAt`
  - `User`:
    - `id` (autoincrement)
    - `email` (unique)
    - `passwordHash`
    - `role` (`ADMIN`, `STAFF`, `CUSTOMER`)
    - `createdAt`, `updatedAt`

## Interface map

- HTTP:
  - `GET /health` → `200` `{ "status": "ok" }`
  - `POST /auth/signup` → `201` `{ token, user }`
  - `POST /auth/login` → `200` `{ token, user }`
  - `GET /auth/me` → `200` `{ user }` (requires `Authorization: Bearer <token>`)
  - `GET /admin/ping` → `200` `{ "pong": true }` (requires `Authorization: Bearer <token>`; role `ADMIN`)
- Environment variables:
  - `PORT` (optional; default `3000`)
  - `DATABASE_URL` (required for Prisma scripts; default in `.env.example`)
  - `JWT_SECRET` (required for Milestone 2 auth endpoints; set in `.env` for local dev)

- Package scripts:
  - `pnpm dev`: start server with watch (`tsx`)
  - `pnpm build`: compile to `dist/`
  - `pnpm start`: run compiled server
  - `pnpm test`: runs migrations against `test.db` and then runs Vitest (`scripts/test.ts`)
  - `pnpm lint`: run ESLint
  - `pnpm typecheck`: typecheck all TS (including tests/config)
  - `pnpm db:migrate`: `prisma migrate dev`
  - `pnpm db:deploy`: `prisma migrate deploy`
  - `pnpm prisma:generate`: `prisma generate`

## Test map

- Health endpoint integration test:
  - `test/health.test.ts`
  - Uses Fastify `app.inject()` (no network, deterministic)

- Password hashing unit tests:
  - `test/password.test.ts`

- Auth integration tests:
  - `test/auth.test.ts`

- Admin RBAC integration tests:
  - `test/admin.test.ts`

## Locations of Interest (LOIs)

- `src/server.ts`
  - `parsePort()` and `main()`
  - Invariant: binds to `127.0.0.1` by default; `PORT` override must be validated
- `src/app.ts`
  - `buildApp()`
  - Invariant: route registration happens during app construction
- `src/routes/health.ts`
  - `registerHealthRoutes()`
  - Invariant: `GET /health` remains DB-independent and returns static JSON
- `src/routes/auth.ts`
  - `registerAuthRoutes()`
  - Invariant: auth routes require `JWT_SECRET` and use Prisma for persistence
- `src/auth/guards.ts`
  - `authenticate(app)` and `requireRole([...])`
  - Invariant: auth decisions are based on DB role, not only token claims
- `src/routes/admin.ts`
  - `registerAdminRoutes()`
  - Invariant: admin routes require authentication and role checks
- `src/plugins/prisma.ts`
  - `prismaPlugin`
  - Invariant: Prisma client is registered once and disconnected on close
- `src/fastify-types.ts`
  - Fastify and JWT type augmentation
- `scripts/test.ts`
  - Deterministic test runner that runs migrations against `test.db`
- `scripts/seed-admin.ts`
  - Local helper to promote an existing user to `ADMIN`
- `src/security/password.ts`
  - `hashPassword()` and `verifyPassword()`
  - Invariant: raw passwords are never stored; verification uses constant-time compare via bcrypt
- `prisma/schema.prisma`
  - Invariant: Prisma schema is the source of truth for domain models and auth identity
- `.github/workflows/ci.yml`
  - Invariant: CI runs `pnpm lint`, `pnpm typecheck`, `pnpm test`

## Flow maps
See `docs/flows/` for detailed critical path flow maps.

- `docs/flows/health.md`
- `docs/flows/auth-signup.md`
- `docs/flows/auth-login.md`
- `docs/flows/auth-me.md`
- `docs/flows/admin-ping.md`
