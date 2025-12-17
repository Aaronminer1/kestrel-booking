# Backlog (Suggested)

## Epic A — Platform scaffolding
- Tooling: TypeScript, package manager (pnpm), lint, format, test runner
- Fastify server + health endpoint
- Prisma + SQLite + migrations
- CI pipeline (lint + test)

## Epic B — Auth & RBAC
- Signup/login/logout
- JWT/session strategy
- Role model + middleware

## Epic C — Scheduling domain
- Services model
- Availability model
- Booking model + overlap prevention
- Schedule views (API)

## Epic D — Notifications
- Email confirmations via SMTP (MailHog locally)
- Retry strategy and failure visibility

## Epic E — Policies & safety
- Cancellation/reschedule policy
- Audit log
- Idempotency keys

## Epic F — UI
- Admin/staff screens: services, availability, schedule
- Customer screens: browse services, book, manage bookings

## Epic G — Ops readiness
- Request IDs and structured logging
- Rate limiting
- Runbook and rollback procedure
