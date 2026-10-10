---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements. Do not use as a substitute for verifying your own changes before review.
---

# Requesting Code Review

Dispatch a code reviewer subagent to catch issues before they cascade. The reviewer gets precisely crafted context for evaluation — never your session's history.

**Core principle:** Review early, review often.

## Two axes: Standards ∥ Spec

Review the diff between `HEAD` and a fixed point along **two separate axes** (do not merge findings across axes):

- **Standards:** does the code conform to this repo's documented coding standards?
- **Spec:** does the code faithfully implement the originating issue / design / plan?

When useful, run both as **parallel** `subagent` / `subagent_fork` reviewers so they don't pollute each other's context, then aggregate under `## Standards` and `## Spec`.

**Pin the fixed point first:** commit SHA, branch, tag, or merge-base. Confirm `git rev-parse` and a non-empty `git diff <fixed-point>...HEAD` (three-dot) before spawning reviewers.

**Spec source:** issue refs in commits, a path the user passed, or a design/plan under `docs/` / `docs/superpowers/`. If none exists, skip the Spec axis and note "no spec available" — do **not** require a Matt issue-tracker setup doc.

**Standards sources:** repo docs such as `AGENTS.md`, `CODING_STANDARDS.md`, `CONTRIBUTING.md`. On top of those, carry a **Fowler smell baseline** (Refactoring ch.3) as judgment heuristics only: Mysterious Name, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Shotgun Surgery, Divergent Change, Speculative Generality, Message Chains, Middle Man, Refused Bequest. Rules: **the repo overrides** the baseline; baseline smells are always judgment calls, never hard violations; skip anything tooling already enforces.

**Behavior proof** (does it actually work end-to-end?) stays in `verification-before-completion` — not a third review axis here.

### Checklists and disposition under Standards ∥ Spec

The following are **checklists and post-review disposition under Standards ∥ Spec** — not a third review axis:

**Five axes (checklist):** correctness · readability · architecture · security · performance. Use them to structure comments inside Standards and/or Spec; do not invent a separate "five-axis" verdict lane.

**Sizing:** prefer ~100-line focused diffs; split when a change is too large to review in one sitting.

**Severity labels:** Critical (blocks) · Important (should fix before proceeding) · Minor (note for later).

**Blind floor:** for self-authored diffs, re-read as if you did not write them. Apply a Blind floor — if you cannot name at least one concrete risk, gap, or residual uncertainty after that pass, say so explicitly rather than rubber-stamping.

**Verification gap:** check whether the author's verification story (tests run, build, manual checks) actually covers the change; flag a **verification-gap** when claims outrun evidence.

**Triage disposition** (after findings exist): `intent_gap` · `bad_spec` · `patch` · `defer` — choose one primary disposition per finding cluster so the author knows whether to revisit intent, fix the spec, patch code, or defer.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Get git SHAs:**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or: git merge-base origin/main HEAD
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch code reviewer subagent:**

Dispatch via dsh `subagent` or `subagent_fork`, filling the template at [code-reviewer.md](code-reviewer.md). Do not invent a `type` field or other foreign agent-kind labels — dsh schemas do not accept them.

**Placeholders:**
- `{DESCRIPTION}` - Brief summary of what you built
- `{PLAN_OR_REQUIREMENTS}` - What it should do
- `{BASE_SHA}` - Starting commit
- `{HEAD_SHA}` - Ending commit

**3. After dispatch (dsh wait + messaging):**

Finish only local work that does **not** need the reviewer's findings (ledger lines, packaging the next brief, reading already-written report paths). Then **end this turn** when nothing useful remains. Do **not** loop `list_agents` or status-ping `send_message` ("how is it going?") — that is not a wait.

Parent↔reviewer may still use adjacent `send_message` for **substantive** mid-flight notes (clarifications, extra constraints). The tool returns delivery ack only; replies and the unconditional `subagent-settled` notice arrive via inbox (see `using-superpowers/references/dsh-tools.md`).

**4. Act on feedback** (after `agent-message` and/or settlement land):
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Example

```
[Just completed Task 2: Add verification function]

You: Let me request code review before proceeding.

BASE_SHA=$(git rev-parse HEAD~1)  # or the fixed point pinned in Step 1
HEAD_SHA=$(git rev-parse HEAD)

[Dispatch code reviewer subagent]
  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types
  PLAN_OR_REQUIREMENTS: Task 2 from docs/superpowers/plans/deployment-plan.md
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661

[Optional local work that does not need the review]
[End this turn — do not poll list_agents; optional substantive send_message only]

[Later — inbox agent-message and/or settlement notice]
  Strengths: Clean architecture, real tests
  Issues:
    Important: Missing progress indicators
    Minor: Magic number (100) for reporting interval
  Assessment: Ready to proceed

You: [Fix progress indicators]
[Continue to Task 3]
```

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll just review the diff myself instead of dispatching a reviewer" | You're the coordinator — reviewing the diff inline burns the context window you need to keep driving the work. Dispatch a reviewer subagent: the diff and the evaluation live in its context, and only the findings come back to you. |
| "The reviewer needs my whole session history to understand the change" | Hand it precisely crafted context, never your session's history. That keeps the reviewer on the work product, not your thought process. |
| "I'll keep calling list_agents until the reviewer is ready" | `list_agents` is not a wait. End the turn (or keep doing non-dependent work); consume inbox settlement / agent-message when they arrive. |
| "send_message is forbidden while waiting" | Status pings are forbidden. Substantive adjacent `send_message` is the real parent↔child channel; it still does not return a reply in the tool result. |

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
- Argue with valid technical feedback
- Poll `list_agents` (or status-ping `send_message`) in a loop to wait for the reviewer

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

See template at: [code-reviewer.md](code-reviewer.md)
