# Flow Map: GET /health

## Purpose
Provide a deterministic liveness check for local development and CI verification.

## External Contract
- Method: `GET`
- Path: `/health`
- Success:
  - Status: `200`
  - Body: `{ "status": "ok" }`
  - Content-Type: `application/json`

## Flow (Trigger → Response)
1. **Trigger**
   - An HTTP client calls `GET /health`.

2. **Boundary: Fastify routing**
   - File: `src/routes/health.ts`
   - Symbol: `registerHealthRoutes(app)`
   - Behavior: registers a GET route at `/health`.

3. **Handler execution**
   - File: `src/routes/health.ts`
   - Route handler sends JSON `{ status: 'ok' }`.

4. **Response**
   - Fastify serializes the returned payload and writes the HTTP response.

## Invariants / Guardrails
- Route must remain **GET-only**.
- Response must remain **static** and **DB-independent**.
- Binding and port configuration are handled by the server entrypoint, not the route.

## Verification
- Automated test:
  - File: `test/health.test.ts`
  - Mechanism: `app.inject({ method: 'GET', url: '/health' })`
  - Asserts: status code, JSON body, and `content-type` header.

## Locations of Interest
- App construction:
  - `src/app.ts` (`buildApp()`)
- Route registration:
  - `src/routes/health.ts` (`registerHealthRoutes()`)
- Runtime entrypoint:
  - `src/server.ts` (`main()`)
