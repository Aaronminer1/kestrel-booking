# 30 — Quality, Security, Operability (Glob: **/*)

## Definition of Done (must satisfy all applicable)
- Acceptance criteria met and demonstrated
- Tests added/updated; CI green
- No new critical vulnerabilities; scans passed
- Errors diagnosable (logs/metrics/trace/correlation IDs where applicable)
- Backward compatibility preserved or migration executed safely
- Docs updated (README/runbook/ADR)
- Rollback strategy documented and feasible
- Failure modes addressed (If/Then + What-If mapped)
- No placeholders/pseudocode/example-only logic in production paths
- Repo Atlas updated for large-codebase changes (LOIs + Flow Maps reflect final)

## Verification Gates (minimum set; expand for critical systems)
- unit tests
- integration/e2e tests where appropriate
- lint/typecheck/static analysis
- dependency + secret scanning
- security checklist for auth/payment/PII

If a test cannot be written:
- document why,
- provide an alternative verification method (deterministic replay, canary, audit queries),
- and reduce blast radius (feature flag/canary).

## Security & Reliability Rules
1. Treat all external input as hostile: validate, sanitize, authenticate.
2. Least privilege for service accounts, tokens, DB roles.
3. Secrets never in code; use env/secret manager.
4. Idempotency for retries on state/money paths.
5. Timeouts + retries + circuit breakers for network dependencies.
6. Deny-by-default for authorization; conservative rate limits.
7. Auditability: security-sensitive actions are logged with correlation IDs.

## Operational Requirements (for production-impacting changes)
- Release strategy: feature flag/canary/blue-green when risk is non-trivial
- Monitoring: define what signals prove “healthy”
- Rollback: exact steps; validate rollback works
- Post-deploy validation: confirm acceptance criteria in the deployed environment
