# Runbook (to be implemented)

This runbook must be updated as production-impacting behavior is added.

## How to run locally

Prerequisites:
- Node.js 20+
- pnpm (recommended via Corepack, but a standalone pnpm install also works)

From a PowerShell prompt at the repository root:

- (Optional) Enable Corepack:

  `corepack enable`

  If this fails with an `EPERM` error on Windows (due to writing shims under `C:\Program Files\nodejs`), you can usually proceed as long as `pnpm` is already available:

  `pnpm -v`

- Install dependencies:

  `pnpm install --frozen-lockfile`

- Create a local env file (recommended):

  `Copy-Item .env.example .env`

- Configure auth (Milestone 2):

  Set a JWT signing secret in `.env`:

  `JWT_SECRET="dev-secret"`

- Run DB migrations (creates `dev.db` by default):

  `pnpm db:migrate`

- Start the server in watch mode:

  `pnpm dev`

- Validate the health endpoint:

  `Invoke-RestMethod http://127.0.0.1:3000/health`

Expected output:
- `status` should be `ok`.

- Validate auth endpoints (Milestone 2):

  Signup:

  `Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/auth/signup -ContentType application/json -Body '{"email":"test@example.com","password":"pw"}'`

  Login:

  `Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/auth/login -ContentType application/json -Body '{"email":"test@example.com","password":"pw"}'`

  Me (replace `<token>`):

  `Invoke-RestMethod -Method Get -Uri http://127.0.0.1:3000/auth/me -Headers @{ Authorization = "Bearer <token>" }`

- Validate admin RBAC endpoint (Milestone 2):

  Admin ping (replace `<token>`):

  `Invoke-RestMethod -Method Get -Uri http://127.0.0.1:3000/admin/ping -Headers @{ Authorization = "Bearer <token>" }`

  Promote a user to admin (local helper):

  - Create a user via `/auth/signup` (or use an existing user email).
  - Promote the user:

  ` $env:ADMIN_EMAIL = "test@example.com"; pnpm tsx scripts/seed-admin.ts `

  Notes:
  - This script promotes an existing user; it does not create users.
  - Authorization checks for `/admin/ping` use the current DB role.

- Validate services endpoints (Milestone 3):

  List services (public):

  `Invoke-RestMethod -Method Get -Uri http://127.0.0.1:3000/services`

  Create a service (requires `ADMIN` or `STAFF`):

  1) Signup and capture token:

  `Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/auth/signup -ContentType application/json -Body '{"email":"staff@example.com","password":"pw"}'`

  2) Promote the user:

  ` $env:ADMIN_EMAIL = "staff@example.com"; pnpm tsx scripts/seed-admin.ts `

  3) Login again to obtain a token with the updated role:

  `Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/auth/login -ContentType application/json -Body '{"email":"staff@example.com","password":"pw"}'`

  4) Create service (replace `<token>`):

  `Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/services -ContentType application/json -Headers @{ Authorization = "Bearer <token>" } -Body '{"name":"Consultation","durationMinutes":30,"priceCents":5000}'`

## How to run tests and CI checks

From a PowerShell prompt at the repository root:

- Lint:

  `pnpm lint`

- Typecheck:

  `pnpm typecheck`

- Tests:

  `pnpm test`

  Notes:
  - `pnpm test` runs tests against an isolated SQLite database file `./test.db`.
  - The test runner applies migrations via `pnpm db:deploy` using `DATABASE_URL=file:./test.db`.

- Run the full local verification sequence (recommended):

  `pnpm lint; pnpm typecheck; pnpm test; pnpm db:migrate`

## Common failure modes and diagnosis

- **`pnpm` is not recognized**
  - Cause: Corepack not enabled or Node not installed correctly.
  - Fix:
    - Confirm Node 20+ is installed: `node -v`
    - Enable Corepack: `corepack enable`
    - Retry: `pnpm -v`

- **`corepack enable` fails with EPERM on Windows**
  - Symptom: `Internal Error: EPERM: operation not permitted, open 'C:\Program Files\nodejs\pnpx'` (or similar).
  - Cause: Corepack attempts to create/update shims in a protected directory.
  - Fix:
    - If `pnpm -v` already works, you can skip `corepack enable` and proceed.
    - Otherwise, run PowerShell as Administrator and retry `corepack enable`, or install pnpm by another supported method.

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

- **Auth endpoints return 404**
  - Cause: `JWT_SECRET` is not set, so auth routes are disabled at startup.
  - Fix:
    - Ensure `.env` contains `JWT_SECRET`.
    - Restart the server.

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
