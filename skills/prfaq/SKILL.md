---
name: prfaq
description: "Runs Working Backwards (press release → customer FAQ → internal FAQ → verdict). Use when customer narrative must be proven before build. Do not use to kill/harden a raw idea (use forge-idea) or to interview a design tree (use grilling)."
tier: product
---

# PRFAQ

## Overview

Prove the customer narrative before build via Working Backwards: press release → customer FAQ → internal FAQ → Verdict. If the story does not hold in customer language, do not start the build spine.

## When to Use

- Customer narrative must be proven before implementation
- Leadership needs a go/no-go grounded in customer language

**Do not use when:** killing/hardening a raw idea (`forge-idea`), or interviewing a design tree (`grilling`).

## Process

1. **Press release** — write the customer-facing announcement as if shipped (date, customer problem, what changed, why it matters). No internal jargon.
2. **Customer FAQ** — questions buyers actually ask (price, migration, who it is for, what breaks, alternatives). Answer in customer voice.
3. **Internal FAQ** — what the team must answer (cost, risk, dependencies, capacity, compliance, rollback). Separate from the customer FAQ; do not mix audiences.
4. **Verdict** — **proceed** / **revise** / **stop**, with reasons tied to the FAQs. If revise, name the exact narrative gaps to fix before another pass.
5. Markdown only. No shortcut paths or HTML keepsakes as required artifacts.

### Lean Working Backwards skeleton

```markdown
# PRFAQ: <title>
## Press release
## Customer FAQ
Q: …
A: …
## Internal FAQ
Q: …
A: …
## Verdict
proceed | revise | stop — because …
```

## Red Flags

| Thought | Reality |
|---------|---------|
| "Skip internal FAQ" | Hidden costs surface there |
| "This replaces forge-idea" | Raw idea survival is a different skill |
| "Ship the press release tone into the PRD" | PRFAQ proves narrative; PRD holds FR contracts |

## Verification

- [ ] Working Backwards sequence complete (press → customer FAQ → internal FAQ)
- [ ] Verdict recorded (proceed / revise / stop)
- [ ] Customer and internal FAQs stay audience-separated
- [ ] No shortcut paths that skip the PRFAQ gates; Markdown only
