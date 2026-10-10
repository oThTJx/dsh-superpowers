---
name: correct-course
description: "Drafts a cross-artifact change proposal (OLD→NEW) when plans/PRD/SPEC/UX drift mid-delivery. Use when committed artifacts must change together. Do not use for code-layer blast radius alone (use impact-analysis)."
tier: product
---

# Correct Course

## Overview

When committed product artifacts drift mid-delivery, draft a cross-artifact change proposal so plans, PRD, SPEC, and UX stay aligned. Code-only blast radius stays in `impact-analysis`.

## When to Use

- Mid-delivery drift across PRD / SPEC / UX / plans
- Committed artifacts must change together

**Do not use when:** code-layer blast radius alone (`impact-analysis`).

## Process

1. **Trigger.** Name the change that forced the course correction and which committed artifacts are in scope (PRD, SPEC, UX spines, plan, stories).
2. **OLD → NEW.** For each affected artifact, write what was committed vs what must replace it. Quote enough of OLD that a reviewer can see the delta without opening the whole file.
3. **Impact class:**
   - **Minor** — local wording / single FR tweak; no epic reshuffle
   - **Moderate** — several artifacts or AC changes; plan tasks move
   - **Major** — goals, non-goals, or UX journeys shift; re-Validate PRD/SPEC before more build
4. **Follow-ons.** List stories / plan tasks to add, change, or drop; list explicit non-changes.
5. **Approve before rewrite.** Get user approval on the proposal, then update artifacts. Markdown proposal only — no sprint-status scripts or HTML decks as required artifacts.

### Proposal skeleton

```markdown
# Course correction: <title>
- Trigger:
- Impact: Minor | Moderate | Major
## Artifacts
### <artifact>
- OLD: …
- NEW: …
## Follow-ons
- …
## Non-changes
- …
```

## Red Flags

| Thought | Reality |
|---------|---------|
| "I'll just edit the code" | Artifact drift needs a proposal first |
| "Skip OLD→NEW" | Without OLD, reviewers cannot see the delta |
| "This is impact-analysis" | That skill covers code/cross-layer gates, not product-artifact rewrite |

## Verification

- [ ] OLD→NEW pairs exist for each touched artifact
- [ ] Impact class chosen (Minor / Moderate / Major)
- [ ] User approved before rewrites
- [ ] No shortcut paths that skip approval; Markdown proposal only
