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
