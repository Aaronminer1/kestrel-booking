# Flow Map: GET /admin/ping

## Purpose
Provide a minimal protected endpoint to verify authorization behavior (RBAC) in Milestone 2.

## External Contract
- Method: `GET`
- Path: `/admin/ping`
- Headers:
  - `Authorization: Bearer <token>`
- Success:
  - Status: `200`
  - Body: `{ "pong": true }`
  - Content-Type: `application/json`
- Failure:
  - `401` `{ "error": "unauthorized" }` when token is missing/invalid
  - `403` `{ "error": "forbidden" }` when authenticated but role is not `ADMIN`

## Flow (Trigger → Response)
1. **Trigger**
   - HTTP client calls `GET /admin/ping`.

2. **Boundary: Fastify routing**
   - File: `src/routes/admin.ts`
   - Symbol: `registerAdminRoutes(app)`

3. **Authentication**
   - File: `src/auth/guards.ts`
   - Symbol: `authenticate(app)`
   - Behavior:
     - Calls `request.jwtVerify()`
     - Loads the user from Prisma via `app.prisma.user.findUnique({ id })`
     - On failure returns `401 unauthorized`

4. **Authorization**
   - File: `src/auth/guards.ts`
   - Symbol: `requireRole([Role.ADMIN])`
   - Behavior:
     - If role is not allowed returns `403 forbidden`

5. **Handler**
   - File: `src/routes/admin.ts`
   - Response: `{ pong: true }`

## Invariants / Guardrails
- Route is only registered when `JWT_SECRET` is set (see `src/app.ts`).
- Auth decisions are based on the current DB role, not just token claims.

## Verification
- Automated test:
  - File: `test/admin.test.ts`
  - Asserts:
    - `401` without token
    - `403` with `CUSTOMER` token
    - `200` with `ADMIN` token

## Locations of Interest
- Route:
  - `src/routes/admin.ts`
- Guards:
  - `src/auth/guards.ts`
- Auth endpoints:
  - `src/routes/auth.ts`
