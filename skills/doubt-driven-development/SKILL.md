---
name: doubt-driven-development
description: "Runs in-flight adversarial review of non-trivial decisions (CLAIM→EXTRACT→DOUBT→RECONCILE). Use when a high-stakes choice is about to lock in. Do not use for post-hoc PR review (use requesting-code-review) or user design interviews (use grilling)."
tier: discipline
---

# Doubt-Driven Development

## Overview

A confident answer is not a correct one. Long sessions turn assumptions into "facts" without notice. Doubt-driven development materializes a fresh-context reviewer — biased to **disprove**, not approve — before non-trivial output stands.

This is not `requesting-code-review`. That skill judges a finished artifact. Doubt-driven is an in-flight posture: cross-examine decisions while course-correction is still cheap. It is not `grilling`, which runs user design interviews.

## When to Use

A decision is **non-trivial** when at least one applies:

- Introduces or modifies branching logic
- Crosses a module or service boundary
- Asserts a property the type system cannot verify (thread safety, idempotence, ordering, invariants)
- Correctness depends on context a future reader cannot see
- Blast radius is irreversible (production deploy, data migration, public API change)

Apply when about to lock an architectural choice, commit non-trivial code, or claim a non-obvious fact ("this is safe", "this scales").

Skip when:

- Mechanical operations (rename, format, file moves)
- Following a clear, unambiguous user instruction
- Reading or summarizing existing code
- One-line changes with obvious correctness
- Pure tooling operations (running tests, listing files)
- The user explicitly asked for speed over verification

## Process

**Orchestrator-only.** Run from the main session where Step 3 can dispatch a fresh-context `subagent` / `subagent_fork`. Inside a subagent context, surface that doubt-driven cannot nest and let the main session handle it, or use degraded self-questioning and flag the result as degraded.

```
Doubt cycle:
- [ ] Step 1: CLAIM — wrote the claim + why-it-matters
- [ ] Step 2: EXTRACT — isolated artifact + contract, stripped reasoning
- [ ] Step 3: DOUBT — invoked fresh-context reviewer with adversarial prompt
- [ ] Step 4: RECONCILE — classified every finding against the artifact text
- [ ] Step 5: STOP — met stop condition (trivial findings, 3 cycles, or user override)
```

### Step 1: CLAIM

Name the decision in two or three lines:

```
CLAIM: "The new caching layer is thread-safe under the read-heavy workload."
WHY THIS MATTERS: a race here corrupts user data and is hard to detect in QA.
```

If you cannot write the claim that compactly, you have a vibe, not a decision.

### Step 2: EXTRACT

Give the reviewer **artifact** and **contract**, not your journey:

- Code: the diff or function — not the whole file
- Decision: the proposal in 3–5 sentences plus constraints it must satisfy
- Assertion: claim plus evidence, kept distinct from the CLAIM block

Strip your reasoning. If you hand over conclusions, you get validation of conclusions.

### Step 3: DOUBT

Dispatch a fresh-context reviewer with an **adversarial** prompt:

```
Adversarial review. Find what is wrong with this artifact.
Assume the author is overconfident. Look for unstated assumptions, edge cases,
hidden coupling, contract violations, broken conventions, failure modes.

Do NOT validate. Do NOT summarize. Find issues, or state explicitly that you
cannot find any after thorough examination.

ARTIFACT: <paste artifact>
CONTRACT: <paste contract>
```

Pass **ARTIFACT + CONTRACT only** — not the CLAIM, not your reasoning. Handing the reviewer your conclusion biases toward agreement.

Use `subagent` / `subagent_fork` per `using-superpowers/references/dsh-tools.md`. The adversarial prompt overrides any default balanced review shape.

### Step 4: RECONCILE

Classify each finding in precedence order (first match wins):

1. **Contract misread** — fix the contract, re-classify next cycle
2. **Valid + actionable** — change the artifact, re-loop
3. **Valid trade-off** — document explicitly for the user
4. **Noise** — note it; ask whether clearer contract would have prevented the false flag

Re-read the artifact text. Rubber-stamping the reviewer is the same failure as ignoring it.

### Step 5: STOP

Stop when:

- Next iteration returns only trivial or already-considered findings, **or**
- **3 cycles** completed (escalate to user — do not grind a fourth alone), **or**
- User explicitly says "ship it"

If substantive issues remain after 3 cycles, the artifact may be too large — return to Step 2 and decompose. Do not lift the bound.

## Rationalizations

| Rationalization | Reality |
|---|---|
| "I'm confident, skip doubt" | Confidence correlates poorly with correctness on novel problems |
| "Spawning a reviewer is expensive" | Debugging a wrong commit in production costs more |
| "I'll do doubt at the end with requesting-code-review" | Post-hoc review catches wrong directions late; doubt catches them cheap |
| "If I doubt every step I'll never ship" | This skill applies to non-trivial decisions only |
| "The reviewer disagreed so I was wrong" | Disagreement is information; re-read the artifact and classify |

## Red Flags

- Fresh-context review for a one-line rename or formatting change
- Reviewer output treated as authoritative without re-reading artifact text
- Looping past 3 cycles without escalating
- Prompting "is this good?" instead of "find issues"
- Passing the CLAIM to the reviewer
- Re-spawning on an unchanged artifact (stalling, not doubting)
- **Doubt theater:** across 2+ cycles with substantive findings, zero classified actionable
- Doubting only after committing — that is post-hoc review, not doubt-driven

## Verification

- [ ] Every non-trivial decision was named as a CLAIM before standing
- [ ] At least one fresh-context review per non-trivial artifact (TDD RED can satisfy this for behavioral claims)
- [ ] Reviewer received ARTIFACT + CONTRACT — not CLAIM, not orchestrator reasoning
- [ ] Reviewer prompt was adversarial ("find issues"), not validating
- [ ] Findings classified: contract misread / actionable / trade-off / noise
- [ ] Stop condition met: trivial findings, 3 cycles, or user override
