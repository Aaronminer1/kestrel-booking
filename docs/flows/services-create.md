# Flow Map: POST /services

## Purpose
Allow staff/admin users to create services that customers can later browse and book.

## External Contract
- Method: `POST`
- Path: `/services`
- Headers:
  - `Authorization: Bearer <token>`
- Request body:
  - `name` (string)
  - `durationMinutes` (integer)
  - `priceCents` (integer)
- Success:
  - Status: `201`
  - Body: `{ "service": { "id": number, "name": string, "durationMinutes": number, "priceCents": number } }`
  - Content-Type: `application/json`
- Failure:
  - `401` `{ "error": "unauthorized" }` when token is missing/invalid
  - `403` `{ "error": "forbidden" }` when authenticated but role is not `ADMIN` or `STAFF`
  - `400` validation error when body is missing required fields or contains unknown properties

## Flow (Trigger → Response)
1. **Trigger**
   - HTTP client calls `POST /services`.

2. **Boundary: Fastify routing + validation**
   - File: `src/routes/services.ts`
   - Symbol: `registerServiceAdminRoutes(app)`
   - Behavior:
     - Route is only registered when `JWT_SECRET` is set (see `src/app.ts`).
     - Fastify JSON schema validates the request body.

3. **Authentication**
   - File: `src/auth/guards.ts`
   - Symbol: `authenticate(app)`
   - Behavior:
     - Calls `request.jwtVerify()`
     - Loads the user from Prisma via `app.prisma.user.findUnique({ id })`
     - On failure returns `401 unauthorized`

4. **Authorization**
   - File: `src/auth/guards.ts`
   - Symbol: `requireRole([Role.ADMIN, Role.STAFF])`
   - Behavior:
     - If role is not allowed returns `403 forbidden`

5. **Persistence: create service**
   - File: `src/routes/services.ts`
   - Call: `app.prisma.service.create({ data: { name, durationMinutes, priceCents } })`

6. **Response shaping**
   - File: `src/routes/services.ts`
   - Symbol: `toServiceResponse(service)`

7. **Response**
   - Status: `201`
   - Body: `{ service: {...} }`

## Invariants / Guardrails
- Deny-by-default: only `ADMIN`/`STAFF` may create services.
- Authorization is based on the current DB role (see `authenticate(app)`), not only token claims.

## Verification
- Automated test:
  - File: `test/services.test.ts`
  - Cases:
    - `POST /services requires auth and STAFF/ADMIN role`
    - `POST /services is not registered when JWT_SECRET is not set, but GET /services still works`

## Locations of Interest
- Route:
  - `src/routes/services.ts`
- Guards:
  - `src/auth/guards.ts`
- App composition:
  - `src/app.ts` (registers `registerServiceAdminRoutes` only when JWT enabled)
- Prisma schema:
  - `prisma/schema.prisma` (`Service`)
