---
name: prd
description: "Creates or validates a PRD Essential Spine with stable FR ids. Use when multiple people or multiple epics must align on one product contract. Do not use for a single-task SPEC (use spec-kernel)."
tier: product
---

# PRD

## Overview

Create or validate a PRD Essential Spine so multiple people or epics share one product contract with stable FR ids. Prefer a lean spine over a novel; the deliverable is alignment, not prose volume.

## When to Use

- Multi-person or multi-epic product alignment
- Existing PRD needs Validate before build continues

**Do not use when:** a single-task SPEC is enough (`spec-kernel`).

## Process

1. **Essential Spine.** Draft or load:
   - Problem / opportunity
   - Users (who benefits)
   - Goals
   - Non-goals
   - Functional requirements (each with a stable **FR-** id)
   - Success metrics (product-level)
2. **Stable FR ids.** Assign `FR-1`, `FR-2`, … Never renumber casually; deprecate instead of reuse. Keep each FR one testable capability statement.
3. **Validate:**
   - Every FR maps to a user and a goal
   - Contradictions and orphans are fixed or explicitly deferred
   - Non-goals do not silently reappear as FRs
4. **Reviewer summary only** for the handoff (what changed / what is still open) — not a full rewrite of the spine in chat.
5. Markdown only — no sprint-status YAML drivers or HTML decks as required artifacts.

### Lean spine skeleton

```markdown
# PRD: <title>
## Problem
## Users
## Goals
## Non-goals
## Requirements
- FR-1: …
- FR-2: …
## Success metrics
## Open questions
```

## Rationalizations

| Thought | Reality |
|---------|---------|
| "Skip Validate" | Unvalidated FR ids become silent drift |
| "This is just a SPEC" | Single-task contracts belong in `spec-kernel` |
| "Renumber FRs for neatness" | Stable ids beat cosmetic sequences |

## Verification

- [ ] Essential Spine fields present
- [ ] Stable FR- ids present
- [ ] Validate completed (FR ↔ user/goal)
- [ ] No shortcut paths that skip PRD gates; Markdown only
