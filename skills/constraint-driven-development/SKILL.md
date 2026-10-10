---
name: constraint-driven-development
description: "Guides writing and enforcing a durable consumer-project CONSTRAINTS.md quality bar with floor-guards and ratchets. Use when setting or raising project-wide thresholds. Do not use for one-off task acceptance criteria, as a substitute for verification-before-completion, or to replace deepseek-harness root AGENTS.md."
tier: core
---

# Constraint-Driven Development

## Overview

Process skills describe what good looks like in prose the agent reads once. This skill produces something different: a **consumer-project** `CONSTRAINTS.md` — a written record of **that project's** quality bar with numbers, floor-guards, and ratchets that outlive the session and can be checked mechanically.

`CONSTRAINTS.md` lives in the **consumer project's repo root**, not in deepseek-harness. The harness keeps `AGENTS.md` as its own authority; this skill complements `verification-before-completion` by defining standing thresholds beside per-task acceptance criteria.

Spec-driven work says what to build. Test-driven development proves behavior. Constraint-driven development defines what "good enough to ship" means before anyone argues about it in a pull request.

## When to Use

- Starting a consumer project or significant feature with no written quality bar
- The user asks to set up constraints, quality gates, or project-wide standards
- An agent keeps silencing checks or skipping tests to reach green
- Coverage, performance, or accessibility numbers get renegotiated every PR instead of once
- Before autonomous loops where the only gate is a suite the agent also wrote

Skip when:

- The consumer project already has `CONSTRAINTS.md` and the user is not changing it — read and follow it
- One-off spikes or throwaway prototypes
- The user wants a code review now (`requesting-code-review`) or CI pipeline design
- One-off task acceptance criteria for a single change

The interview needs a live user. In non-interactive runs, apply the floor only, note that you did, and flag numbered dimensions for a human.

## Process

### Step 1: Detect before you ask

Gather stack, test runner, linters, coverage, CI, and existing agent guidance from the consumer repo. Report findings in two lines, then ask only what remains.

### Step 2: Four questions, each with a default

Follow one-question-at-a-time intake. Every question has a default so "I don't know" still produces a working config:

1. **Dimensions** — beyond the floor, which to enforce (coverage, security scanning, performance, accessibility, architecture boundaries)? Default: coverage + security when a test runner exists.
2. **Failure posture** — block or warn on check failure mid-task? Default: block on floor, warn elsewhere for the first two weeks.
3. **Numbers** — user targets or measure today and hold? Default: measure and hold (ratchets).
4. **Budget** — slowest check tolerated before handoff? Default: ~90 seconds at task end, unlimited in CI.

Stop at four questions.

### Step 3: Write consumer-project CONSTRAINTS.md

One file at the **consumer repo root**. Structure:

- **Floor** — always enforced: no new suppression comments, no unimplemented stubs, no skipped/deleted tests without commit reason, no secrets in source, this file does not get weakened to pass a change
- **Enforced with numbers** — table of dimension, rule, command that produces the verdict, and where it runs
- **Measured, not yet enforced** — today's value and direction (must not fall)
- **Exceptions** — rule, path, reason, owner, expiry

Every numbered row names the command that produces the verdict. A number without a command is aspiration, not a constraint.

Point the consumer project's agent guidance at the file: read `CONSTRAINTS.md` before writing code; do not weaken it to make a change pass.

### Step 4: Install and wire checks

Each chosen dimension needs a mechanism. Prefer de facto tools the ecosystem already targets. Scope expensive checks to the diff. Place checks by cost:

| Phase | What runs | Budget |
|---|---|---|
| Edit loop | Types, lint, secrets, floor | under ~5s, changed files |
| Task end | Related tests, coverage on changed lines | under agreed budget (~90s default) |
| Review / CI | Full suite, security scans, direction checks | minutes |

**Cost decides placement.** A check that stalls the edit loop gets disabled; a disabled gate is worse than no gate.

### Step 5: Floor-guard the bar

Watch the diff for five moves that lower the bar:

1. Threshold moved — budget lowered, severity dropped, check removed
2. Test made easier — `.skip`, deleted test file, assertions stripped
3. Checker silenced — new `@ts-ignore`, `eslint-disable`, `istanbul ignore`, `nosemgrep`, `gitleaks:allow`, `Stryker disable`
4. Unfinished work — stub throws, empty `catch`, `TODO` where implementation belongs
5. New exception row nobody discussed

Tightening is silent; loosening is loud. Compare `CONSTRAINTS.md` against its state at the branch point.

Rank constraints by circularity: **external** (axe, osv-scanner, Lighthouse) > **project** (lint rules, layer boundaries) > **suite** (your own tests). A bar made entirely of suite checks is weaker than one with an outside opinion.

### Step 6: Ratchets when you lack a number

Record today's metric, refuse to get worse, update when it improves. Put it in "Measured, not yet enforced" with direction **must not fall**. Setting 80% on a 62% codebase produces ignored red builds; holding 62% does not.

## Rationalizations

| Excuse | Reality |
|---|---|
| "We'll add constraints once the code settles" | Code settles around whatever was allowed while moving |
| "The tests are the constraints" | Tests prove self-agreement, not coverage of new code, dependency risk, or bundle growth |
| "This will slow the agent down" | Only if slow checks land in the fast loop — that's placement, not an argument against constraints |
| "I'll remember our standards" | The agent won't, and it writes most of the code |

## Red Flags

- Interview ran past four questions or produced a config the user cannot explain
- A dimension has a number but no command behind it
- Every constraint is judged only by the project's own test suite
- `CONSTRAINTS.md` changed in the same commit as the feature that was failing
- An exception has no owner or expiry more than a year out
- Slow checks landed in the edit loop and someone passes `--no-verify`

## Verification

- [ ] Consumer-project `CONSTRAINTS.md` exists; every number has a stated reason
- [ ] Floor passes on the current codebase without weakening the file
- [ ] Each user-picked dimension has a command that runs today
- [ ] Fast stage stays under a few seconds; expensive checks run at task end or CI
- [ ] At least one external constraint is present (not judged only by the suite)
- [ ] Measured metrics record today's value and a direction
- [ ] Exceptions have an owner and expiry
- [ ] Consumer agent guidance points at the file
- [ ] A trial run on the current branch produces no failures the user disagrees with
