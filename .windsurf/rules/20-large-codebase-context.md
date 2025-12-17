# 20 — Large Codebase Context Protocol (Always On)

Goal: operate on large repos without ingesting every line. Treat this as retrieval + mapping.

## Working Set Discipline
- Start by selecting a small working set (5–20 files) that define the boundary:
  entrypoints/handlers, orchestration, domain logic, persistence, tests.
- Keep an explicit list:
  Working Set File | Why it matters | Key symbols | Invariants/Hazards
- Pull additional files only when needed for the current slice.

## Repo Atlas (required for non-trivial repos or cross-module changes)
Maintain/update a living map (e.g., `docs/repo-atlas.md`) containing:
- Directory-to-domain map (folders → responsibilities)
- Component map (services/modules/packages + dependency directions)
- Entry points (service boots, routing tables, jobs, consumers, CLIs)
- Data map (stores, schemas/migrations, key entities, ownership)
- Interface map (APIs/events/contracts + versioning rules)
- Test map (where tests live, how to run, coverage hotspots)
- LOIs (Locations of Interest): curated file paths + symbols relevant to the task

## Flow Maps (critical paths)
For each in-scope journey/behavior, map:
Trigger → boundary → orchestration → domain logic → persistence → response
Include: file paths + function/class names + invariants at each boundary.

## Cross-cutting change guardrail
Do not perform a cross-cutting refactor until:
- Working Set exists,
- Repo Atlas exists/updated,
- at least one Flow Map exists for the affected critical path.

## Summary rule
Prefer “map artifacts + targeted retrieval” over bulk file dumping.
