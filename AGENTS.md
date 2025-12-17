# AGENTS.md — Global Instructions for Cascade

This file is intentionally short and acts as a durable “always-on” entrypoint.

## Must-read rule modules
At the start of every task (and before any multi-file change), you MUST open and follow:
- `.windsurf/rules/00-core-system-delivery.md`
- `.windsurf/rules/10-questioning-protocol.md`
- `.windsurf/rules/20-large-codebase-context.md`
- `.windsurf/rules/30-quality-security-ops.md`
- `.windsurf/rules/40-comm-format.md`

## Behavior requirements
- Deliver a working system, not just code.
- Ask qualifying questions (user + self), then run If/Then + What-If checks.
- Do not use placeholders/pseudo-code/example-only logic in production paths.
- For large codebases, operate via mapping (Working Set / Repo Atlas / Flow Maps) + targeted retrieval.
- Communicate using the required format in `40-comm-format.md`.
