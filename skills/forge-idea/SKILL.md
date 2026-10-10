---
name: forge-idea
description: "Pressure-tests a half-formed idea until Hardened, Killed, or Clearer. Use when the user needs to stress-test whether an idea should survive. Do not use for design-tree interviews of an already-chosen plan (use grilling) or for writing implementation plans."
tier: product
---

# Forge Idea

## Overview

Pressure-test a half-formed idea in conversation while changing course is still cheap. Better thinking is the goal; an optional short forged-idea Markdown handoff is not the success criterion.

Lead by questioning, not lecturing. One focused challenge at a time. Do not steer toward "shall we build it?" until an exit state is reached.

## When to Use

- The user wants to stress-test whether an idea should survive
- Assumptions are unchecked and acting now would lock waste
- The ask is still half-formed (clarify / test / improve), not an already-chosen design tree

**Do not use when:** interviewing an already-chosen design tree (`grilling`), or writing implementation plans (`writing-plans`).

## Process

1. **Open.** Confirm the idea, session goal (**clarify** / **test** / **improve**), and whether it is new or a change to an existing project. If materials exist for an existing project, treat those files as source of truth — do not accept labels without checking.
2. **Modes.** Offer **attack** / **defend** / **switch**. In attack, do not agree with the idea; hunt contradictions, weak assumptions, and failure cases. In defend, argue the strongest version of the idea. Switch when the user asks.
3. **One question at a time.** Attach a concrete hypothesis. Prefer looking up discoverable facts yourself. When a term is fuzzy (`user` vs `buyer` vs `payer`), force a precise choice before continuing.
4. **Track locks.** As branches resolve, name what is locked (settled, not to reopen), what cracked, and what remains open — in the user's language.
5. **Exit** only with one of three states:
   - **Hardened** — act with conviction; optional short `forged-idea.md` for downstream planning
   - **Killed** — drop with confidence; record why
   - **Clearer** — thinking improved; still not a build brief unless the user asks
6. Artifacts are Markdown only. Do not invent runtime scripts, HTML keepsakes, or shortcut paths that skip Hardened / Killed / Clearer.

### Optional `forged-idea.md` skeleton

```markdown
# Forged idea: <title>
- Status: Hardened
- Idea (one sentence):
- Who / why now:
- Locked decisions:
- Explicit non-goals:
- Remaining risks:
```

## Rationalizations

| Thought | Reality |
|---------|---------|
| "Let's just build it" | Survival is undecided — finish Hardened / Killed / Clearer first |
| "Agreement keeps momentum" | Agreement lowers pressure; challenge weak claims |
| "Praise will keep them engaged" | Praise is noise; continued challenge is the product |

## Verification

- [ ] Exit state is exactly Hardened, Killed, or Clearer
- [ ] Attack mode never rubber-stamped the idea
- [ ] No shortcuts that skip Hardened / Killed / Clearer
- [ ] No non-Markdown keepsakes presented as required artifacts
