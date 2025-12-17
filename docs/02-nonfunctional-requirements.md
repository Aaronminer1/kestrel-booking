# Non-Functional Requirements (Draft)

## Security
- Passwords are hashed using a modern algorithm (argon2 or bcrypt with appropriate parameters).
- Secrets are not committed to git; use env vars.
- Input validation at API boundaries.
- Authorization is deny-by-default.

## Reliability
- Timeouts for outbound calls (SMTP).
- Booking create endpoint supports idempotency keys.

## Observability
- Structured logs; correlation/request IDs.
- Errors are diagnosable without attaching a debugger in production.

## Maintainability
- Clear module boundaries; avoid cross-cutting refactors without maps.
- Keep diffs small; add tests with behavior changes.

## Performance
- Response time targets and load expectations are TBD; agent must ask.
