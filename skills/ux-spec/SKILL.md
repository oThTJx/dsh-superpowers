---
name: ux-spec
description: "Produces DESIGN.md and EXPERIENCE.md dual spines for UX-critical work. Use when interaction/journey contracts matter. Do not use for logic-only backend tasks."
tier: product
---

# UX Spec

## Overview

Produce dual UX spines — **DESIGN.md** and **EXPERIENCE.md** — when interaction and journey contracts matter. Keep design structure and lived experience separable so either can change without rewriting the other wholesale.

## When to Use

- UX-critical work where journeys, states, and interaction rules must be explicit

**Do not use when:** logic-only backend tasks with no meaningful interaction contract.

## Process

1. **DESIGN.md** — visual/structure principles, key screens or surfaces, component/state inventory, accessibility baselines, content hierarchy.
2. **EXPERIENCE.md** — user journeys (happy / recovery / abandon), success and failure paths, empty / error / loading contracts, handoff points to other systems.
3. **Cross-check:**
   - Every journey step maps to a design surface
   - Every critical UI state appears in both spines (or is explicitly deferred in Non-goals)
   - Accessibility baselines are not optional footnotes
4. Get user approval before treating the spines as committed. Markdown only — no HTML decks as required artifacts.

### Dual-spine skeletons

```markdown
# DESIGN.md
## Principles
## Surfaces
## States
## Accessibility baseline

# EXPERIENCE.md
## Journeys
## Empty / error / loading
## Success signals
## Non-goals (UX)
```

## Rationalizations

| Thought | Reality |
|---------|---------|
| "Backend-only, skip UX" | If users interact, journeys need contracts |
| "One mega doc" | Dual spines keep design vs experience separable |
| "Wireframes later" | Without surfaces and states, EXPERIENCE.md floats |

## Verification

- [ ] DESIGN.md and EXPERIENCE.md both present
- [ ] Journeys and states cross-checked
- [ ] Accessibility baseline named
- [ ] No shortcut paths that skip user approval; Markdown only
