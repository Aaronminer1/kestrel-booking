# Acceptance Criteria (Draft)

The agent should convert these into Given/When/Then tests and confirm gaps with the user.

## Milestone 1 — Scaffold
- API exposes `GET /health` returning `{ status: "ok" }`.
- DB migrations run locally.
- `pnpm test` and `pnpm lint` are present and succeed (even if minimal).
- A basic CI workflow runs lint + tests.

## Milestone 2 — Auth & Roles
- Users can sign up and log in.
- Roles exist: `admin`, `staff`, `customer`.
- Only `admin/staff` can create services and availability.
- Customers can only view services and book.

## Milestone 3 — Booking Core
- Staff can create services with: name, durationMinutes, priceCents.
- Staff can create weekly availability blocks.
- Customer can book a service at a time slot.
- The system prevents overlapping bookings for the same staff member.
- Customer receives email confirmation.
- Staff can view the daily schedule.

## Milestone 4 — Policies & Safety
- Cancellation policy exists (exact rules TBD).
- Reschedule policy exists (exact rules TBD).
- Booking creation is idempotent when an idempotency key is provided.
- Every booking state change is audit-logged.

## Milestone 5 — Minimal UI
- Admin/staff can manage services/availability.
- Customer can browse services and book an appointment.

## Milestone 6 — Ops
- All requests include a correlation/request ID in logs.
- Rate limiting is enabled on auth endpoints.
- A runbook exists with deploy/rollback and incident triage steps.
