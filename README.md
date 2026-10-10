# @firefly0621/dsh-superpowers

English | [中文](README.zh.md)

Installable DeepSeek Harness plugin bundle that brings [obra/superpowers](https://github.com/obra/superpowers) into product sessions: the packaged skill catalog (**41** skills; `diagnosing-superpowers` permanently out of catalog until a deep dsh port), adapted to dsh tooling, plus a SessionStart-equivalent bootstrap.

Publish name: `@firefly0621/dsh-superpowers` (version tracks the harness family, currently `0.1.0-rc.35`). Source of record for this fork package: [github.com/oThTJx/dsh-superpowers](https://github.com/oThTJx/dsh-superpowers). This package is opt-in and is not part of the official main `dsh-base` composition.

## What it restores

| Superpowers behavior | dsh realization |
|---|---|
| Skills library under `skills/*/SKILL.md` | `ctx.skills` provider `superpowers` (packaged `skills/` directory, dsh-adapted) |
| SessionStart hook injecting `using-superpowers` | `system-prompt/assemble` section `skill:superpowers` with the same `<EXTREMELY_IMPORTANT>` framing (every non-subagent request); `using-superpowers` is user-only in the skill catalog |
| Platform `references/*-tools.md` | bundled `skills/using-superpowers/references/dsh-tools.md` appended inside that section |
| Subagent skip (`SUBAGENT-STOP`) | no full `using-superpowers` bootstrap when `session.header.origin === 'subagent'`; injects a short `skill:superpowers-worker` preamble instead |
| Model loads other skills on demand | existing `dsh-tool-skill` catalog + `skill` tool |

The skill bodies ship as dsh-adapted prose under `skills/` (no vendored source, no git submodule). Foreign-harness tool names and platform references were rewritten for dsh, and the `superpowers:` skill-name prefix was removed. The published tarball includes `skills/` plus `assets/NOTICE.md`, which records obra/superpowers (`8ca22dba9`, v6.4.2), mattpocock/skills (`49dd158d1`), addyosmani/agent-skills (`1401c8b80`), and bmad-code-org/BMAD-METHOD (`bda3c5929`, with trademark notice) as review pins.

## Matt skills and fused extensions

Superpowers remains the workflow kernel (`brainstorming` → `writing-plans` → TDD / debugging / review / verify). Selected [mattpocock/skills](https://github.com/mattpocock/skills), [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), and [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) practices ship as a **tiered catalog** (21 names with `metadata.tier`; full packaged catalog **41** skills). `SkillTier` values: `core` | `utility` | `session` | `discipline` | `product`.

| Tier (`metadata.tier`) | Skills | Notes |
|---|---|---|
| `core` | `domain-modeling`, `codebase-design`, `research`, `constraint-driven-development`, `spec-kernel` | Model + user |
| `utility` | `prototype`, `wizard` | Model + user; prototype is hard-throwaway |
| `session` | `grilling`, `handoff`, `wait-what` | **User-only** (`disable-model-invocation: true`) |
| `discipline` | `doubt-driven-development`, `source-driven-development`, `context-engineering`, `security-and-hardening` | Model + user |
| `product` | `forge-idea`, `party-mode`, `correct-course`, `prd`, `prfaq`, `ux-spec`, `retrospective` | Model + user; named in README only (not in bootstrap fork) |

Session skills (`grilling`, `handoff`, `wait-what`) are absent from the model `<available_skills>` catalog and refused by the model `skill` tool. Users invoke them with a whitespace-bounded `/name` token in a user message (for example `/grilling`); `dsh-tool-skill` injects the skill body as instructions. `using-superpowers` is also `disable-model-invocation: true`, but its standing copy arrives through the system-prompt bootstrap rather than that gesture (users may still `/using-superpowers` to reload the body without the adapter).

Obra skills that absorbed merges (keep on obra sync): `brainstorming` (inline Architectural grilling; Not Doing; Always/Ask/Never; reject aim-past-100), `using-superpowers` (≤5-line intent fork; anti-stack; tiny-edit; implementation priority; contextual gates), `test-driven-development`, `systematic-debugging`, `requesting-code-review` (Standards ∥ Spec + checklists), `incremental-implementation`, `code-simplification`, `research`, `codebase-design`, `writing-plans`, `explaining-changes`, `handoff`, `verification-before-completion`.

Superpowers extension skills (implementation discipline, not automatic routing): `incremental-implementation`, `impact-analysis`, `code-simplification`, `structured-refactoring`, `dsh-harness-contributor`, `explaining-changes`. The bootstrap `using-superpowers` skill defines when to load them, implementation priority, and contextual gates; `tier` and catalog descriptions do not auto-route.

`tier` is catalog metadata only — not a router. Invocation frontmatter is parsed privately by this provider (plugin-only; upstream harness packages unchanged).

## Install into a dsh profile

Requires DeepSeek Harness peers (`@deepseek-ai/dsh-skill` and related packages), typically from the official CLI/`dsh-base` stack. Source-workspace `workspace:*` peers mean the matching DSH release; packed manifests substitute that exact version. DSH checks those peer ranges at install and profile startup and refuses an incompatible pair without an exact version exemption — see [Version compatibility](#version-compatibility).

```sh
dsh plugin --profile web add @firefly0621/dsh-superpowers
```

From a harness source tree:

```sh
pnpm dsh plugin --profile web add @firefly0621/dsh-superpowers
```

Then boot `dsh --profile web` (or `pnpm dsh web`). If this fork's `dsh-base` already mounts `id: superpowers`, do not add the same row again — disable the base row first, or use a profile that does not include it.

### Local / pre-publish check

```sh
pnpm run build:lib:host
pnpm --filter @firefly0621/dsh-superpowers pack
pnpm dsh plugin --profile superpowers-demo add ./firefly0621-dsh-superpowers-0.1.0-rc.35.tgz
```

(`pnpm pack` writes the tarball to the repository root by default. There is no per-package `build` script; host lib build produces `lib/`.)

## Enable from this monorepo without npm

This package is opt-in in the harness source tree. Mount the shipped overlay patch (or `dsh plugin add`):

```sh
pnpm dsh web --patch packages/skill/superpowers/cordis.patch.yml
pnpm dsh --profile headless --patch packages/skill/superpowers/cordis.patch.yml "task"
```

Fork trees that already mount `id: superpowers` in their base need no extra step; set `disabled: true` on that row to omit it.

## Config

| Field | Default | Meaning |
|---|---|---|
| `skillsRoot` | packaged `skills/` directory | Absolute skills directory |
| `bootstrap` | `true` | Contribute parent `using-superpowers` (+ dsh adapter) as `skill:superpowers`, and the short worker preamble as `skill:superpowers-worker` on subagent-origin sessions |

## Update Superpowers

There is no vendored submodule. To re-port newer upstream releases: for each source, diff **content baseline → target**, then walk every open row in **sync debt** below, then re-apply the dsh adaptation by hand. Do **not** use `assets/NOTICE.md` review pins as the sole diff baseline — those pins record last review, not “skills/ equals that tree”.

Adaptation rules: replace foreign-harness tool names and platform references, remove the `superpowers:` skill-name prefix, **keep the behavioral content verbatim** (dsh exceptions only in the table below), and distill Matt / agent-skills / BMAD ADDs (never dump BMAD `_bmad` runtime, memlog, HTML seals, or trademark personas).

**dsh adaptation exceptions (allowed non-verbatim edits):**

| Exception | Why |
|---|---|
| Strip `superpowers:` / foreign skill-name prefixes | Catalog names are bare in dsh |
| Rewrite foreign harness tools → dsh (`subagent` / `subagent_fork`, `todo_write`, `dsh-tools.md`) | Platform adapter |
| `writing-plans` handoff label `Native` → `Inline` | Avoid “native harness” ambiguity; still means same-session `executing-plans` |
| `sdd-workspace`: refuse marker-less existing dirs (no adopt) | Deliberate ownership tighten vs obra; documented in the script header |
| Invoke bundled scripts via `bash …` | Packaged extractors may strip Unix exec bits |
| Keep catalog `Do not use` negatives / description contracts | Fusion routing gates |

### Content baseline and sync debt

| Source | Content baseline (landed in `skills/`) | NOTICE review pin | Open sync debt |
|---|---|---|---|
| obra/superpowers | Spine through v6.4.2 inline `executing-plans` (incl. `scripts/task-start` / `task-done`) at `8ca22dba9` | `8ca22dba9` | *(none)* — `diagnosing-superpowers` stays a known limitation (deep session-transcript mapping), not an open port row |
| mattpocock/skills | `GLOSSARY-FORMAT` + domain-modeling/handoff/grilling/wizard aligned to `49dd158d1`; `resolving-merge-conflicts` removed | `49dd158d1` | *(none)* |
| addyosmani/agent-skills | Distilled ADDs; `context-engineering` OPTIMIZE; `security-and-hardening` + `references/hardening-patterns.md` | `1401c8b80` | *(none)* for shipped ADDs |
| BMAD-METHOD | Distilled product ADDs under functional names (no `_bmad` runtime) | `bda3c5929` | *(none)* for shipped ADDs — further v7 personas/runtime stay out of scope |

**Fusion gate checklist (before/after merge):**

1. Catalog length stays **41**; `metadata.tier` set equals the **21-name** whitelist; no second meta-router; no `bmad-*` skill directory names.
2. Re-assert OPTIMIZE merges (brainstorming Scheme B / Not Doing / Always·Ask·Never; TDD; review Standards ∥ Spec; grilling user-only; incremental / simplification pins) after any obra spine overwrite.
3. Same-name overlaps from agent-skills (`code-simplification`, `incremental-implementation`, `test-driven-development`) OPTIMIZE in place — do not add peer directories.
4. Update `SEMANTIC_DESCRIPTION_GROUPS` / `NEGATIVE_BOUNDARY_BANNED` when obra changes skill routing semantics (for example `executing-plans` inline vs `subagent-driven-development`).
5. Bump NOTICE **review** pins when you re-read upstream; update the **content baseline / debt** table when landed content or debt changes; keep ADD `Do not use when…` and BMAD exit-state pins.
6. Run `pnpm exec vitest run packages/skill/superpowers/tests/superpowers.spec.ts`.
7. Confirm `executing-plans` ships `scripts/task-start` and `scripts/task-done` and the SKILL body invokes them (tests failing ≠ tests not recorded).

**Preserve on obra sync:** Matt-added skill directories (`domain-modeling`, `codebase-design`, `research`, `prototype`, `wizard`, `grilling`, `handoff`, `wait-what` and companions); agent-skills / BMAD ADD directories (`constraint-driven-development`, `doubt-driven-development`, `source-driven-development`, `context-engineering`, `security-and-hardening`, `forge-idea`, `party-mode`, `spec-kernel`, `correct-course`, `prd`, `prfaq`, `ux-spec`, `retrospective`); extension skill directories (`incremental-implementation`, `impact-analysis`, `code-simplification`, `structured-refactoring`, `dsh-harness-contributor`, `explaining-changes`); merged sections in `brainstorming`, `using-superpowers` (intent fork, anti-stack, tiny-edit, implementation priority, contextual gates), `test-driven-development`, `systematic-debugging`, `requesting-code-review`, `incremental-implementation`, `code-simplification`, `research`, `codebase-design`, `writing-plans`, `explaining-changes`, `handoff`, `verification-before-completion`; private invocation/`tier` parsing in `src/index.ts` (`discipline` | `product` included); review-pin blocks in `assets/NOTICE.md`.

**CI gate (not README-only):** `tests/superpowers.spec.ts` `skill composition contracts` asserts packaged `metadata.tier` values stay inside `ALLOWED_TIERS` and lock the 21-name whitelist after ADDs. `catalog description contracts` asserts semantic description groups (fail), positive-segment negative boundaries that block route contradictions (fail), and positive trigger overlap among extension skills (warn only). Gated skills include the discipline extension set plus the process spine (`brainstorming`, `systematic-debugging`, `verification-before-completion`, `dispatching-parallel-agents`, `writing-plans`, `executing-plans`, `research`, `requesting-code-review`, `subagent-driven-development`, `test-driven-development`). The thirteen ADDs are not members of those semantic/overlap tables; pairwise Jaccard description collisions warn on the packaged catalog (promote-to-fail is deferred). Dropping a tiered directory or clearing `tier` on obra re-port fails the package suite.

## Model Experience

### System-prompt bootstrap

#### What the model sees

On every non-subagent request, `system-prompt/assemble` prepends section `skill:superpowers` whose text is `buildBootstrapPreamble(...)`: the framing below, the full packaged `using-superpowers` SKILL.md, then `skills/using-superpowers/references/dsh-tools.md`. Agentless assemblies omit the section. `session.header.origin === 'subagent'` gets `skill:superpowers-worker` from `buildWorkerPreamble()` instead of the full bootstrap. Compaction cannot drop the guidance because it is reassembled with the system prompt each turn, not stored as a one-shot user message.

##### Verbatim parent framing

```markdown
<EXTREMELY_IMPORTANT>
You have superpowers.

## Standing order (before any tool call)

1. Call the dsh `skill` tool with the exact catalog name **before** clarifying, exploring, reading files, or acting — unless every tiny-edit condition in `using-superpowers` holds.
2. Announce `Using [skill] to [purpose]`, then follow that skill. Do not invent a second workflow.
3. Anti-stack: load **one** process skill first; add supporting skills only when that skill delegates them or the user requires them. "Not an automatic workflow" means do not stack — not "skip `skill`".
4. Independent domains in one turn: issue multiple `subagent` / `subagent_fork` calls in the **same** assistant message.
5. After dispatch: finish only local work that does **not** need child results, then **end this turn**. Parent↔child talk uses adjacent `send_message` (Steer; tool returns delivery ack only — replies and `subagent-settled` arrive via inbox). Do **not** loop `list_agents` or status-ping `send_message` ("how is it going?") to wait.
6. Tool names, wait/resume, and harness gates: **DeepSeek Harness platform adaptation** at the end of this section.

**Below is the full content of your `using-superpowers` skill — your introduction to using skills.
For all other skills, call the dsh `skill` tool with the exact catalog name.**

[full using-superpowers SKILL.md]

## DeepSeek Harness platform adaptation

Your harness is DeepSeek Harness. Follow this adaptation (same role as Superpowers `references/*-tools.md`):

[full dsh-tools.md]
</EXTREMELY_IMPORTANT>
```

##### Verbatim worker preamble

```markdown
<EXTREMELY_IMPORTANT>
You are a Superpowers **worker** subagent.

1. Execute the dispatch brief. Do not invent a second process workflow or re-route the parent task.
2. `using-superpowers` / skill-first orchestration belongs to the **parent**. SUBAGENT-STOP means ignore that standing skill — **not** "refuse every catalog skill".
3. Call `skill` only when the brief names a skill, or a catalog entry is clearly required to finish the brief.
4. Do the assigned work yourself unless the brief says otherwise. Prefer finishing over polling parent state.
5. You may `send_message` your direct parent (and the parent may message you): delivery ack only; put self-contained findings in the message body. Settlement is separate and unconditional.
</EXTREMELY_IMPORTANT>
```

#### Token effect

One large system-prompt section on every non-subagent request; skill catalog entries add their usual summary cost when `dsh-tool-skill` is mounted.

#### KV Cache effect

Stable prefix for a given skills root and bootstrap toggle: the section text is loaded once at plugin apply and reused. While `bootstrap` stays enabled and the packaged preamble is unchanged, the rendered text is byte-stable so the warm prefix cache is reused. Changing `skillsRoot` or disabling `bootstrap` changes the assembled prompt.

### Skill catalog and `skill` tool

#### What the model sees

Indirectly through `@deepseek-ai/dsh-tool-skill`: every model-invocable Superpowers skill name/description in `<available_skills>`, and full bodies when loaded via `skill`.

#### Token effect

Scales with skill count and description caps owned by `dsh-tool-skill`. The packaged catalog is forty-two skills, including six discipline extension skills (`incremental-implementation`, `impact-analysis`, `code-simplification`, `structured-refactoring`, `dsh-harness-contributor`, `explaining-changes`) plus thirteen agent-skills / BMAD ADDs.

#### KV Cache effect

Same as the skill consumer: initial catalog after the reusable prefix; replacements append.

<a id="version-compatibility"></a>
## Version compatibility

This bundle declares `peerDependencies` on `@deepseek-ai/dsh-*` packages. DSH checks those ranges against the running runtime at install and profile startup; an incompatible pair is refused unless the profile grants an exact `package@version` × `dsh-version` exemption. Source-workspace `workspace:*` peers mean the matching DSH release; packed manifests substitute that exact version. See the [plugin manager's compatibility reference](../../boot/plugin-manager/README.md#version-compatibility-and-exemptions) for `version-exemptions`, `allow-version`, and the crash/data-loss risk.

## Known Limitations and Deferred Work

- No runtime invariant companion is published; skills are immutable packaged files and bootstrap is a `system-prompt/assemble` listener with no independently observable durable event stream. Offline turn scoring lives in `scripts/score-skill-first.mjs` (first `tool/call` of each turn vs `skill`, plus same-turn `list_agents` counts after a `subagent` / `subagent_fork` dispatch); it does not enforce behavior at runtime.
- **No upstream hook binary** — bootstrap is a Cordis `system-prompt/assemble` listener, not `hooks/session-start`.
- **A complete persona replaces every section** — an agent whose composition registers a `complete` persona (agent presets) suppresses all prompt sections, including `skill:superpowers` and `skill:superpowers-worker`, for that agent.
- **Packaged preamble must avoid `{{...}}` prompt-variable syntax** — `loadBootstrapPreamble` rejects a complete `{{name}}` group at plugin apply (mirrors skill-always-apply); a custom `skillsRoot` that introduces one fails loud before the first turn.
- **Cross-harness reference content is removed** — foreign platform tool refs, Anthropic skill-authoring guides, and harness-specific testing examples are omitted; `dsh-tools.md` is the sole platform adapter and must stay deep enough for SDD wait/resume/model routing.
- **Upstream sync is manual** — no vendored submodule; re-porting means diffing against the recorded commits and re-applying the dsh adaptation. A local `superpowers/` checkout is for comparison only and is gitignored.
- **`diagnosing-superpowers` out of catalog** — obra v6.4.1+ ships a session-diagnosis skill that depends on foreign harness transcript paths and a large prompt/template tree; a shallow port would mislead. A deep dsh adaptation is a separate feature, not open sync debt. Packaged catalog length is **41**.
- **Peers come from DeepSeek Harness** — this bundle does not vendor `@deepseek-ai/dsh-*`; install into a profile that already has the CLI/base stack.
- **Fork product bases may mount the publish scope** — some fork `dsh-base` compositions depend on `@firefly0621/dsh-superpowers` so the product default and npm identity stay one package; this monorepo mounts it only via overlay patch or `dsh plugin add`. Splitting a private workspace name from the publish name remains deferred.
- **Description collision checks warn first** — packaged catalog pairwise Jaccard ≥ 0.55 logs a warning; promoting that check to fail is a follow-up after the fused catalog stabilizes.
