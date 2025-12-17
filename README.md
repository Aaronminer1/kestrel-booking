# System-Delivery Test Project — Kestrel Booking

This repository is intentionally designed to test an AI agent’s ability to deliver a *system* (requirements → design → implementation → verification → ops), not just write code.

## Product overview (one-liner)
A small-business appointment booking system with staff-managed availability, customer bookings, cancellations, and email notifications.

## Target stack (recommended)
- Backend: Node.js + TypeScript (Fastify recommended)
- DB: SQLite via Prisma (simple local dev)
- Web UI: React + Vite (minimal admin + customer screens)
- Email: SMTP to MailHog (local) via Nodemailer
- Tests: Vitest (unit) + Supertest (API integration)

You may adjust the stack if you document trade-offs in an ADR.

## How to use this repo to test your rules
1) Open in Windsurf.
2) Ask the agent to implement **Milestone 1** first.
3) Verify the agent follows:
   - qualifies requirements (asks questions),
   - creates artifacts (DoD, assumptions, risks, plan),
   - avoids placeholders,
   - builds Repo Atlas + Working Set + Flow Maps as complexity grows,
   - ships in small slices with tests and runnable behavior.

## Specs
- `docs/00-stakeholder-brief.md` (intentionally incomplete; agent must ask questions)
- `docs/01-acceptance-criteria.md`
- `docs/02-nonfunctional-requirements.md`
- `docs/03-backlog.md`
- `docs/repo-atlas.md` (to be built by the agent)

## Milestones (suggested)
- Milestone 1: Repo scaffold + API health + DB + CI + baseline docs
- Milestone 2: Auth + roles (admin/staff/customer) + session/JWT
- Milestone 3: Services + availability + booking (no overlaps) + notifications
- Milestone 4: Cancellation/reschedule policies + audit log + idempotency keys
- Milestone 5: Minimal UI + admin screens + customer booking flow
- Milestone 6: Operational hardening (logging correlation IDs, rate limiting, runbook)

## Local dev (placeholder until implemented)
The agent must replace this section with real commands once scaffolding exists.
