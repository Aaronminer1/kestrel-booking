# Flow Map: POST /auth/login

## Purpose
Authenticate an existing user by verifying credentials and returning a signed JWT.

## External Contract
- Method: `POST`
- Path: `/auth/login`
- Request body:
  - `email` (string)
  - `password` (string)
- Success:
  - Status: `200`
  - Body: `{ "token": string, "user": { "id": number, "email": string, "role": "ADMIN"|"STAFF"|"CUSTOMER" } }`
  - Content-Type: `application/json`
- Failure:
  - `401` `{ "error": "invalid_credentials" }` for unknown email or wrong password

## Flow (Trigger → Response)
1. **Trigger**
   - HTTP client calls `POST /auth/login` with JSON body.

2. **Boundary: Fastify routing + validation**
   - File: `src/routes/auth.ts`
   - Symbol: `registerAuthRoutes(app)`
   - Behavior: registers `POST /auth/login` and validates required fields.

3. **Normalization**
   - File: `src/routes/auth.ts`
   - Symbol: `normalizeEmail(email)`

4. **Persistence: lookup user**
   - File: `src/routes/auth.ts`
   - Call: `app.prisma.user.findUnique({ where: { email } })`
   - Behavior: if not found → `401 invalid_credentials`.

5. **Security: verify password**
   - File: `src/security/password.ts`
   - Symbol: `verifyPassword(password, hash)`
   - Behavior: if verification fails → `401 invalid_credentials`.

6. **Auth: JWT issuance**
   - File: `src/routes/auth.ts`
   - Call: `reply.jwtSign({ userId, role })`

7. **Response**
   - Status: `200`
   - Body: `{ token, user }`.

## Invariants / Guardrails
- Auth routes are only enabled when `JWT_SECRET` is set (see `src/app.ts`).
- Invalid credentials must not leak whether the email exists.

## Verification
- Automated tests:
  - File: `test/auth.test.ts`
  - Cases:
    - `login returns a token for valid credentials`
    - `login rejects invalid password`

## Locations of Interest
- JWT plugin setup:
  - `src/app.ts`
- Route implementation:
  - `src/routes/auth.ts`
- Password verification:
  - `src/security/password.ts`
