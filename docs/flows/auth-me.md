# Flow Map: GET /auth/me

## Purpose
Return the current authenticated user’s profile information.

## External Contract
- Method: `GET`
- Path: `/auth/me`
- Headers:
  - `Authorization: Bearer <token>`
- Success:
  - Status: `200`
  - Body: `{ "user": { "id": number, "email": string, "role": "ADMIN"|"STAFF"|"CUSTOMER" } }`
  - Content-Type: `application/json`
- Failure:
  - `401` `{ "error": "unauthorized" }` when token is missing/invalid or user cannot be found

## Flow (Trigger → Response)
1. **Trigger**
   - HTTP client calls `GET /auth/me`.

2. **Boundary: Fastify routing**
   - File: `src/routes/auth.ts`
   - Symbol: `registerAuthRoutes(app)`

3. **Authentication: JWT verify**
   - File: `src/routes/auth.ts`
   - Call: `request.jwtVerify()`
   - Behavior: on failure → logs a warning and returns `401 unauthorized`.

4. **Persistence: load user**
   - File: `src/routes/auth.ts`
   - Call: `app.prisma.user.findUnique({ where: { id: request.user.userId } })`
   - Behavior: if not found → `401 unauthorized`.

5. **Response**
   - Status: `200`
   - Body: `{ user: { id, email, role } }`.

## Invariants / Guardrails
- Auth routes are only enabled when `JWT_SECRET` is set (see `src/app.ts`).
- `GET /auth/me` must never return the password hash.

## Verification
- Automated test:
  - File: `test/auth.test.ts`
  - Case: `me returns current user for valid token`

## Locations of Interest
- JWT typing:
  - `src/fastify-types.ts`
- JWT plugin setup:
  - `src/app.ts`
- Route implementation:
  - `src/routes/auth.ts`
