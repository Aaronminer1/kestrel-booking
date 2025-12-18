# Flow Map: GET /services

## Purpose
Allow customers (and unauthenticated users) to browse available services.

## External Contract
- Method: `GET`
- Path: `/services`
- Success:
  - Status: `200`
  - Body: `{ "services": Array<{ "id": number, "name": string, "durationMinutes": number, "priceCents": number }> }`
  - Content-Type: `application/json`

## Flow (Trigger → Response)
1. **Trigger**
   - HTTP client calls `GET /services`.

2. **Boundary: Fastify routing**
   - File: `src/routes/services.ts`
   - Symbol: `registerPublicServiceRoutes(app)`
   - Behavior: registers a GET route at `/services`.

3. **Persistence: list services**
   - File: `src/routes/services.ts`
   - Call: `app.prisma.service.findMany({ orderBy: { id: 'asc' } })`

4. **Response shaping**
   - File: `src/routes/services.ts`
   - Symbol: `toServiceResponse(service)`
   - Behavior: maps DB records to a stable public shape (does not include timestamps).

5. **Response**
   - Status: `200`
   - Body: `{ services: [...] }`

## Invariants / Guardrails
- Route remains **public** and does not require auth.
- List ordering is stable (`id ASC`).

## Verification
- Automated test:
  - File: `test/services.test.ts`
  - Case: `GET /services returns an empty list when none exist`

## Locations of Interest
- Route registration:
  - `src/routes/services.ts`
- App composition:
  - `src/app.ts` (registers `registerPublicServiceRoutes` unconditionally)
- Prisma schema:
  - `prisma/schema.prisma` (`Service`)
