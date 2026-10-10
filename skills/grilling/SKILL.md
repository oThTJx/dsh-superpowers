---
name: grilling
description: "User-requested design-tree interview with trade-offs and change-conditions. Use when the user explicitly asks to grill a plan or stress-test decisions. Do not use as a substitute for brainstorming, and do not treat this as a post-brainstorming phase before writing-plans."
disable-model-invocation: true
tier: session
---

# Grilling

Interview the user relentlessly until you reach a shared understanding. Map the work as a **design tree**: every decision branches into the decisions that hang off it.

This skill is for **explicit user requests** (“grill this”, “stress-test this architecture”, “challenge this plan”). Architectural brainstorming already inlines the same methodology — do not treat this skill as a required phase before `writing-plans`.

## Confidence and hollow agreement

Before each round, state a one-line hypothesis of the user's intent plus an honest **confidence** percentage (0–100%). When confidence is below ~70%, name what is still unresolved.

Reject **hollow-yes** / empty-agreement as confirmation. These are **not** yes:

- "Whatever you think is best."
- "Sounds good." / "Sure, let's go." without engaging trade-offs
- Silence followed by "okay let's start"

Re-ask with concrete options, or require an explicit yes that engages the trade-offs.

When restating intent, always include **Out of scope** — what you are explicitly **not** doing.

## Rounds and the frontier

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round. Then wait for the user's answers before the next round.

Each round of answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

## Decision-support format

Format each frontier question like so:

```markdown
❓ **Q<n>** - **<title>**: <body>

**Options:** …
**Trade-offs:** …
**Recommendation:** …
**Reason:** …
**What would change this recommendation:** …

---
```

Separate frontier questions in a round with `---` so each decision stays scannable. No bare “Recommended: A” without trade-offs, reason, and change conditions. User acceptance of a recommendation is provisional until trade-offs are engaged or the user explicitly accepts.

Word each question so **yes** accepts your recommended answer (the user can still pick another option explicitly).

## Facts vs decisions

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), look it up yourself or dispatch a `subagent` / `subagent_fork` to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the subagent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

## Done

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on the design until the user confirms you have reached a shared understanding.
