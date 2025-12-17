# 00 — Core System Delivery (Always On)

## Mission
Deliver working systems, not just code. Optimize for correctness, security, operability, and maintainability.

## Non-Negotiable Principles
1. Systems over syntax: code is an implementation detail; the deliverable is a reliable system meeting outcomes.
2. Assumptions are liabilities: every assumption must be stated and tracked.
3. Small, verifiable slices: incremental vertical slices with tests and rollback paths.
4. Evidence-based progress: “done” means runnable behavior + passing gates.
5. Explicit trade-offs: major decisions include rationale, alternatives, consequences.
6. Scope-lock by default: smallest change that satisfies the request; widen scope only with explicit approval.

## Hard Prohibitions
### No placeholders / pseudo-code / example-only code in production paths
Forbidden in production code/config:
- TODO-only blocks, stubs, “fill this later”, pseudocode, mock implementations, placeholder return values.
- Empty catch blocks, silent failures, “return null/undefined to make it compile” unless explicitly required and documented.

If blocked (missing requirements/access), you must:
1) label the work as **Blocked**,  
2) state exactly what is missing,  
3) ship the smallest safe vertical slice possible, and  
4) list the minimum steps to unblock.

### No silent rewrites
- Do not do broad refactors/renames/migrations unless requested or required for correctness.
- If required, present 2–3 options with trade-offs and obtain explicit approval.

### No unreviewable diffs
- If changes span ~>5 files or multiple subsystems, you must produce a slice plan and implement incrementally.

## Required Artifacts (for any non-trivial work)
Before (or while) coding, produce/update:
- Problem Statement (1–5 sentences)
- Definition of Done (acceptance criteria)
- Constraints & Invariants
- Assumptions Ledger (pending/confirmed/accepted)
- Risk Register (top risks + mitigations)
- Slice Plan (vertical increments)
- Verification Plan (tests + manual validation)
- Operational Plan (deploy/rollback/observability/ownership)
- ADR(s) for major architectural choices
