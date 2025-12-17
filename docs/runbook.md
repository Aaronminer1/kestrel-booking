# Runbook (to be implemented)

This runbook must be updated as production-impacting behavior is added.

## How to run locally

Prerequisites:
- Node.js 20+
- Corepack (ships with Node) and pnpm via Corepack

From a PowerShell prompt at the repository root:

- Enable Corepack:

  `corepack enable`

- Install dependencies:

  `pnpm install`

- Create a local env file (recommended):

  `Copy-Item .env.example .env`

- Run DB migrations (creates `dev.db` by default):

  `pnpm db:migrate`

- Start the server in watch mode:

  `pnpm dev`

- Validate the health endpoint:

  `Invoke-RestMethod http://127.0.0.1:3000/health`

Expected output:
- `status` should be `ok`.

## How to run tests and CI checks

From a PowerShell prompt at the repository root:

- Lint:

  `pnpm lint`

- Typecheck:

  `pnpm typecheck`

- Tests:

  `pnpm test`

- Run the full local verification sequence (recommended):

  `pnpm lint; pnpm typecheck; pnpm test; pnpm db:migrate`

## Common failure modes and diagnosis

- **`pnpm` is not recognized**
  - Cause: Corepack not enabled or Node not installed correctly.
  - Fix:
    - Confirm Node 20+ is installed: `node -v`
    - Enable Corepack: `corepack enable`
    - Retry: `pnpm -v`

- **Port 3000 already in use**
  - Symptom: server fails to start with an EADDRINUSE error.
  - Fix:
    - Use another port for this session:
      - `setx PORT 3001`
      - Restart your terminal
      - `pnpm dev`
    - Or set for current PowerShell session only:
      - `$env:PORT = "3001"; pnpm dev`

- **Prisma migration fails / DATABASE_URL not set**
  - Cause: missing `.env` or invalid `DATABASE_URL`.
  - Fix:
    - `Copy-Item .env.example .env`
    - Confirm contents of `.env` include:
      - `DATABASE_URL="file:./dev.db"`
    - Retry: `pnpm db:migrate`

## Rollback procedure

This milestone does not deploy to a shared environment.

Local rollback options:
- Revert the last commit (or changeset) that introduced the issue.
- If the SQLite DB is in a bad state for local dev, delete `dev.db` and re-run migrations:
  - `Remove-Item -Force .\dev.db`
  - `pnpm db:migrate`

## Post-deploy validation

Not applicable for Milestone 1 (local-only).

If you run this service in another environment, validate:
- Process starts successfully
- `GET /health` returns `{ "status": "ok" }`
