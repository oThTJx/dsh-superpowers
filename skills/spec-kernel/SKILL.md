---
name: spec-kernel
description: "Produces a five-field SPEC (Why/Capabilities/Constraints/Non-goals/Success) under Spec Law. Use when intent must become a buildable contract before writing-plans. Do not use as a multi-epic PRD (use prd) or as brainstorming design approval."
tier: core
---

# Spec Kernel

## Overview

Turn intent into a buildable five-field SPEC under Spec Law, then hand off to `writing-plans`. The SPEC is the machine contract for a single buildable unit — not a multi-epic PRD and not a brainstorming approval chat.

## When to Use

- Intent must become a buildable contract before planning
- You have enough clarity to name Why and Success, but not a multi-epic PRD

**Do not use when:** multi-epic product alignment (`prd`), or brainstorming design approval (`brainstorming`).

## Process

1. **Gather sources** (idea, notes, brief, transcript, forged idea). Ask only for missing intent. Derive a short slug for the work.
2. **Draft SPEC** with exactly five fields:

| Field | Must answer |
|-------|-------------|
| **Why** | Why this now; the problem or opportunity in one tight paragraph |
| **Capabilities** | What the system must enable (user-visible or API-visible), numbered |
| **Constraints** | Hard limits (tech, time, compliance, compatibility) |
| **Non-goals** | Explicitly out of scope this pass |
| **Success** | Observable signals that the build worked |

3. **Apply Spec Law:**
   - Every Capability maps to Why and to at least one Success signal
   - Constraints bind; they are not soft preferences
   - Non-goals stay explicit; silent scope is a defect
   - No process steps or implementation plan inside the SPEC
4. **Validate with the user**; fix gaps before handoff.
5. **Hand off** to `writing-plans`. Markdown templates only — no runtime scripts or HTML keepsakes as required artifacts.

### Lean SPEC skeleton

```markdown
# SPEC: <slug>
## Why
## Capabilities
1. …
## Constraints
- …
## Non-goals
- …
## Success
- …
```

## Rationalizations

| Thought | Reality |
|---------|---------|
| "Skip Non-goals" | Silent disagreement about what is not built is the failure mode |
| "This is the PRD" | Multi-epic contracts belong in `prd` |
| "Add the task list here" | Task decomposition belongs in `writing-plans` |

## Verification

- [ ] All five SPEC fields present
- [ ] Spec Law checked with the user (Capability ↔ Why/Success)
- [ ] Non-goals explicit
- [ ] No shortcut paths that skip the kernel gates; Markdown templates only
