---
name: incremental-implementation
description: Use when implementing approved multi-file changes, plan tasks, or multi-file maintenance work that requires coordinated changes across files. Prefer this over direct coding when a task touches more than one file or needs slice-by-slice verify-and-checkpoint. Do not use for single-file edits, trivial typo fixes that meet all tiny-edit conditions, or throwaway prototypes.
---

# Incremental Implementation

## Overview

Implement multi-file work in **vertical slices**: one coherent change, verify, checkpoint when appropriate, then the next slice. Do not batch unrelated files into one undifferentiated edit.

**Announce at start:** "I'm using incremental-implementation to work through this in slices."

## When to Use

- Approved plan tasks that touch several files
- Multi-file maintenance that requires coordinated changes (rename across modules, shared type moves, cross-package wiring)
- A fix or feature where each slice should stay green before continuing

## When NOT to Use

- Single-file edits (use tiny-edit if all five conditions hold, otherwise TDD alone)
- Bug investigation (use `systematic-debugging` first; load this skill only for the multi-file fix phase)
- Throwaway prototypes
- An approved multi-task plan the partner chose to run inline, or when no subagent tool is available (use `executing-plans` instead); when subagents are available and per-task review is wanted, use `subagent-driven-development`

## The Slice Loop

For each slice:

1. **Scope one slice** — smallest end-to-end unit that moves the task forward
2. **Implement** — follow `test-driven-development` when behavior changes
3. **Verify** — run the checks that prove this slice (use `verification-before-completion` before claiming pass)
4. **Checkpoint when appropriate** — pause for review when the slice crosses a risky boundary, changes public API, or the plan marks a review gate; otherwise continue
5. **Commit mentally** — leave the tree in a state the next slice can build on

## Risk-first and contract-first

Prefer **Risk-first** slicing: prove the riskiest seam first so later slices sit on known ground. When UI and backend must move in parallel, use **contract-first** (shared types / API contract before either side expands).

## Feature flags for incomplete work

If a slice must merge before the feature is user-ready, put incomplete behavior behind a **feature flag** (or equivalent gate) so the default path stays safe. Do not leave half-wired user-visible paths on by default.

## Scope discipline

Touch only what the task requires. If you notice adjacent debt, note it — do not fix it in this slice:

```
NOTICED BUT NOT TOUCHING:
- <path> — <observation> (unrelated to this task)
→ Want a follow-up task?
```

## Red Flags

| Thought | Reality |
|---------|---------|
| "I'll edit all files at once" | Slices exist to catch integration mistakes early |
| "Tests at the end" | Each slice verifies before the next |
| "Skip checkpoint, it's small" | Cross-layer slices need a checkpoint even when small |
| "I'll debug while implementing" | Finish diagnosis first; implementation slices assume root cause is known |

## Integration

- **After debugging:** root cause known → optional `impact-analysis` if the gate fires → TDD per slice
- **With an approved plan:** `executing-plans` owns task order; this skill owns slice discipline within one task
- **Conflict priority:** `executing-plans` beats this skill when a full multi-task plan is already approved
