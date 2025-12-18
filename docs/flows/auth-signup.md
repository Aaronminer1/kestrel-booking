# Flow Map: POST /auth/signup

## Purpose
Create a new user identity record and return a signed JWT for subsequent authenticated requests.

## External Contract
- Method: `POST`
- Path: `/auth/signup`
- Request body:
  - `email` (string)
  - `password` (string)
- Success:
  - Status: `201`
  - Body: `{ "token": string, "user": { "id": number, "email": string, "role": "ADMIN"|"STAFF"|"CUSTOMER" } }`
  - Content-Type: `application/json`
- Failure:
  - `409` `{ "error": "email_taken" }` when the email already exists

## Flow (Trigger → Response)
1. **Trigger**
   - HTTP client calls `POST /auth/signup` with JSON body.

2. **Boundary: Fastify routing**
   - File: `src/routes/auth.ts`
   - Symbol: `registerAuthRoutes(app)`
   - Behavior: registers `POST /auth/signup`.

3. **Boundary: input validation**
   - File: `src/routes/auth.ts`
   - Mechanism: Fastify JSON schema on route
   - Behavior: enforces required fields and rejects unknown properties.

4. **Normalization**
   - File: `src/routes/auth.ts`
   - Symbol: `normalizeEmail(email)`
   - Behavior: trims and lowercases email before persistence.

5. **Persistence: uniqueness check**
   - File: `src/routes/auth.ts`
   - Call: `app.prisma.user.findUnique({ where: { email } })`
   - Behavior: if existing user found → `409 email_taken`.

6. **Security: password hashing**
   - File: `src/security/password.ts`
   - Symbol: `hashPassword(password)`
   - Behavior: hashes password using bcrypt; raw password is never stored.

7. **Persistence: create user**
   - File: `src/routes/auth.ts`
   - Call: `app.prisma.user.create(...)`
   - Behavior: stores `email` and `passwordHash`, default role `CUSTOMER`.

8. **Auth: JWT issuance**
   - File: `src/routes/auth.ts`
   - Call: `reply.jwtSign({ userId, role })`
   - Dependency: JWT plugin configured in `src/app.ts`.

9. **Response**
   - Status: `201`
   - Body: `{ token, user }`.

## Invariants / Guardrails
- Auth routes are only enabled when `JWT_SECRET` is set (see `src/app.ts`).
- Raw passwords must never be persisted or logged.
- Email is stored in normalized form.

## Verification
- Automated test:
  - File: `test/auth.test.ts`
  - Case: `signup creates a user and returns a token`

## Locations of Interest
- App composition:
  - `src/app.ts` (JWT registration + route registration)
- Route implementation:
  - `src/routes/auth.ts`
- Password hashing:
  - `src/security/password.ts`
- Prisma identity model:
  - `prisma/schema.prisma` (`User`, `Role`)
