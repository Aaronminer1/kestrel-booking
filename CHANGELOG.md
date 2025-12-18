# Changelog

## 2025-12-17

- Added Fastify server scaffold with `GET /health` returning `{ "status": "ok" }`.
- Added Vitest integration test for `/health` using Fastify `inject()`.
- Added Prisma + SQLite schema and initial migration.
- Added pnpm scripts for `lint`, `typecheck`, `test`, Prisma client generation, and migrations.
- Added GitHub Actions CI workflow running `lint`, `typecheck`, `test`, and `prisma:generate`.
- Added operational documentation: `docs/runbook.md`, `docs/repo-atlas.md`, and `docs/flows/health.md`.
- Verified locally on Windows: `pnpm install --frozen-lockfile`, `pnpm prisma:generate`, `pnpm db:migrate`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- Updated `docs/runbook.md` with a documented fallback when `corepack enable` fails with `EPERM` on Windows.
- Milestone 2 (Slice 1): added `User` + `Role` to Prisma schema and created migration `add_user_auth`.
- Milestone 2 (Slice 1): added password hashing utilities using `bcryptjs` and corresponding unit tests.
- Milestone 2 (Slice 1): added `JWT_SECRET` to `.env.example` for local auth development.
- Milestone 2 (Slice 2): added auth routes (`/auth/signup`, `/auth/login`, `/auth/me`) with JWT Bearer tokens.
- Milestone 2 (Slice 2): added deterministic test runner (`scripts/test.ts`) using isolated `test.db` and `prisma migrate deploy`.
- Milestone 2 (Slice 2): fixed Fastify plugin encapsulation for Prisma via `fastify-plugin`.
- Milestone 2 (Slice 2): pinned `@fastify/jwt` to a Fastify v4 compatible version.
- Milestone 2 (Slice 3): added RBAC guards (`authenticate`, `requireRole`) and admin-only endpoint `GET /admin/ping`.
- Milestone 2 (Slice 3): added admin promotion helper script (`scripts/seed-admin.ts`) for local development.
- Milestone 2 (Slice 3): added flow map `docs/flows/admin-ping.md` and updated Repo Atlas.
- Milestone 3 (Slice 1): added services endpoints: `GET /services` (public) and `POST /services` (requires `ADMIN`/`STAFF`).
- Milestone 3 (Slice 1): added integration tests for services endpoints (`test/services.test.ts`).
- Milestone 3 (Slice 1): added flow maps `docs/flows/services-list.md` and `docs/flows/services-create.md` and updated Runbook/Repo Atlas.
