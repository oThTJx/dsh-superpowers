---
name: retrospective
description: "Runs evidence-based retrospective with source-backed findings and acceptance verdicts. Use at epic or milestone end. Do not use as a substitute for finishing-a-development-branch or verification-before-completion."
tier: product
---

# Retrospective

## Overview

Run an evidence-based retrospective at epic or milestone end: source-backed findings and explicit acceptance verdicts. Vibes without sources are not findings.

## When to Use

- Epic or milestone boundary
- The team needs learnings tied to evidence, not vibes

**Do not use when:** substituting for `finishing-a-development-branch` or `verification-before-completion`.

## Process

1. **Collect sources** — session notes, PRs, incidents, metrics, customer reports. List them up front.
2. **Findings** — each finding carries a **source** pointer (path, PR, log, metric, date). No source → not a finding; demote to an open question.
3. **Verdict per finding** — exactly one of:
   - **accepted** — learning stands; no open work required
   - **accepted-with-open-items** — learning stands; follow-ups listed
   - **rejected** — evidence insufficient or contradicted; say why
4. **Follow-ups** — for open items, name owner-shaped next actions (not vague "improve process").
5. Markdown only — no sprint-status scripts or HTML decks as required artifacts.

### Lean retrospective skeleton

```markdown
# Retrospective: <milestone>
## Sources
- …
## Findings
### F1 — <title>
- Source: …
- Verdict: accepted | accepted-with-open-items | rejected
- Notes: …
## Follow-ups
- …
```

## Red Flags

| Thought | Reality |
|---------|---------|
| "Ship vibes" | Findings without sources are not evidence |
| "This finishes the branch" | Branch finish stays in `finishing-a-development-branch` |
| "Skip rejected findings" | Recording rejects prevents re-arguing the same weak claim |

## Verification

- [ ] Findings are source-backed
- [ ] Each finding has one of the three verdicts
- [ ] Open items have concrete follow-ups
- [ ] No shortcut paths that skip source-backed findings; Markdown only
