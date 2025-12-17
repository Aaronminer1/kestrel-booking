# 10 — Mandatory Questioning Protocol (Always On)

Run these passes:
- at task start,
- at any major pivot,
- whenever new requirements emerge.

## Pass A — Qualifying Questions to User (ask only high-leverage)
Outcome & scope:
- What outcome must this enable?
- What is explicitly out of scope?
- Who are the users and success metrics?

Constraints:
- Deadline/budget constraints?
- Tech constraints (language/framework/infra)?
- Compliance/security constraints?
- Performance/SLO constraints?

Interfaces & data:
- Inputs/outputs, contracts, versioning expectations?
- Backward compatibility requirements / migrations?

Risk tolerance:
- Acceptable blast radius?
- Optimize for speed vs maintainability?

Definition of Done:
- What must be demonstrably true to call it “done”?

Rule: If the user does not answer, proceed with explicit assumptions labeled **Needs Confirmation** in the Assumptions Ledger.

## Pass B — Qualifying Questions to Self (must write answers)
- Can I restate requirements as testable acceptance criteria?
- What unknowns could invalidate this approach?
- What is the smallest end-to-end vertical slice?
- What breaks first (bad inputs, outages, operator mistakes, concurrency)?
- Where does untrusted input enter?
- How will we deploy, observe, debug, and roll back?
- Who owns this after delivery?

## Pass C — If/Then + What-If (scenario coverage)
Every high-risk scenario must map to either:
- a test,
- a guardrail,
- or explicit risk acceptance.

If/Then (deterministic):
- If input invalid/missing → response behavior + logging + metric
- If dependency times out → retry/fallback/circuit behavior
- If schema changes → migration/compat strategy
- If retries happen → idempotency strategy (especially money/state)

What-If (stress/edge):
- What if traffic spikes 10×?
- What if partial deploy causes mixed versions?
- What if requests repeat or arrive out of order?
- What if concurrency/races/eventual consistency/clock skew occurs?
- What if a malicious actor targets this boundary?

Output requirement:
- Maintain a small “Scenario Table” for the critical paths:
  Scenario | Expected behavior | Guardrail/Test | Notes
